"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const node_crypto_1 = require("node:crypto");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const index_1 = require("@/mcp/index");
const connections_1 = require("@/mcp/connections");
const router_1 = require("@/oauth/router");
const store_1 = require("@/oauth/store");
if (process.env.NODE_ENV === "production" && !process.env.OAUTH_ISSUER) {
    console.error("FATAL: OAUTH_ISSUER environment variable must be set in production");
    process.exit(1);
}
const PORT = parseInt(process.env.APP_PORT ?? "3000", 10);
function extractBearer(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
        return null;
    return auth.slice(7);
}
function sendUnauthorized(res) {
    const base = process.env.OAUTH_ISSUER ?? `http://localhost:${process.env.APP_PORT ?? "3000"}`;
    res
        .status(401)
        .set("WWW-Authenticate", `Bearer realm="Shiprocket MCP", resource_metadata="${base}/.well-known/oauth-protected-resource"`)
        .json({ error: "unauthorized", error_description: "Valid Bearer token required" });
}
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too_many_requests", error_description: "Rate limit exceeded, try again later" },
    validate: { xForwardedForHeader: false },
});
async function startHttpServer() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1); // trust first proxy (ngrok, nginx, etc.)
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, mcp-session-id, mcp-protocol-version, Authorization");
        res.setHeader("Access-Control-Expose-Headers", "mcp-session-id, WWW-Authenticate");
        if (req.method === "OPTIONS") {
            res.status(204).send();
            return;
        }
        next();
    });
    const transports = new Map();
    function cleanupSession(sessionId) {
        transports.delete(sessionId);
        connections_1.expiredSellerTokenSessions.delete(sessionId);
        delete connections_1.connectionsBySessionId[sessionId];
    }
    // Apply rate limiting to auth endpoints
    app.use("/oauth/authorize", authRateLimiter);
    app.use("/oauth/token", authRateLimiter);
    app.use("/oauth/register", authRateLimiter);
    app.use(router_1.oauthRouter);
    app.get("/health-check", (_req, res) => {
        res.json({ success: true, sessions: transports.size });
    });
    app.post("/mcp", async (req, res) => {
        const token = extractBearer(req);
        if (!token) {
            sendUnauthorized(res);
            return;
        }
        const tokenData = await (0, store_1.getAccessTokenData)(token);
        if (!tokenData) {
            sendUnauthorized(res);
            return;
        }
        const sessionId = req.headers["mcp-session-id"];
        if (sessionId) {
            const transport = transports.get(sessionId);
            if (!transport) {
                res.status(404).json({ success: false, message: "Session not found or expired" });
                return;
            }
            // Shiprocket expired in a previous tool call — revoke MCP tokens now and force full re-auth
            if (connections_1.expiredSellerTokenSessions.has(sessionId)) {
                connections_1.expiredSellerTokenSessions.delete(sessionId);
                await (0, store_1.revokeAccessToken)(token);
                sendUnauthorized(res);
                return;
            }
            // Keep session token current — handles rotation and sessions initialised before token was set
            if (connections_1.connectionsBySessionId[sessionId]) {
                connections_1.connectionsBySessionId[sessionId].accessToken = token;
            }
            await transport.handleRequest(req, res, req.body);
            return;
        }
        // New session — bind this user's Shiprocket token to it
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: () => (0, node_crypto_1.randomUUID)(),
            onsessioninitialized: (newSessionId) => {
                transports.set(newSessionId, transport);
                connections_1.connectionsBySessionId[newSessionId] = {
                    transport,
                    sellerToken: tokenData.shiprocketToken,
                    accessToken: token,
                };
                transport.onclose = () => cleanupSession(newSessionId);
            },
        });
        const server = (0, index_1.createMcpServer)();
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    app.get("/mcp", async (req, res) => {
        const sessionId = req.headers["mcp-session-id"];
        if (!sessionId) {
            res.status(400).json({ success: false, message: "Missing mcp-session-id header" });
            return;
        }
        const token = extractBearer(req);
        if (!token) {
            sendUnauthorized(res);
            return;
        }
        const tokenData = await (0, store_1.getAccessTokenData)(token);
        if (!tokenData) {
            sendUnauthorized(res);
            return;
        }
        const transport = transports.get(sessionId);
        if (!transport) {
            res.status(404).json({ success: false, message: "Session not found or expired" });
            return;
        }
        // Same expiry check on the SSE channel
        if (connections_1.expiredSellerTokenSessions.has(sessionId)) {
            connections_1.expiredSellerTokenSessions.delete(sessionId);
            await (0, store_1.revokeAccessToken)(token);
            sendUnauthorized(res);
            return;
        }
        if (connections_1.connectionsBySessionId[sessionId]) {
            connections_1.connectionsBySessionId[sessionId].accessToken = token;
        }
        await transport.handleRequest(req, res);
    });
    app.delete("/mcp", async (req, res) => {
        const sessionId = req.headers["mcp-session-id"];
        if (sessionId) {
            const transport = transports.get(sessionId);
            if (transport) {
                await transport.close();
                cleanupSession(sessionId);
            }
        }
        res.status(200).json({ success: true });
    });
    app.use((_req, res) => {
        res.status(404).json({ success: false, message: "Not found" });
    });
    app.use((err, _req, res, _next) => {
        if ("status" in err && err.status === 400 && "body" in err) {
            res.status(400).json({ success: false, message: "Invalid JSON payload" });
            return;
        }
        console.error(`Request error: ${err.stack}`);
        res.status(500).json({ success: false, message: "Something went wrong" });
    });
    process.on("uncaughtException", (error) => {
        console.error(`Uncaught Exception: ${error.stack}`);
        process.exit(1);
    });
    process.on("unhandledRejection", (reason) => {
        console.error(`Unhandled Rejection: ${reason}`);
    });
    return new Promise((resolve) => {
        app.listen(PORT, () => {
            console.log(`Shiprocket MCP HTTP server running on http://localhost:${PORT}`);
            resolve();
        });
    });
}
(async () => {
    try {
        await startHttpServer();
    }
    catch (err) {
        if (err instanceof Error) {
            console.error({ success: false, error: err.message });
        }
        process.exit(1);
    }
})();
