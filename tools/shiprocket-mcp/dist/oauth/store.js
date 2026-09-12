"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClient = registerClient;
exports.getClient = getClient;
exports.storeAuthCode = storeAuthCode;
exports.consumeAuthCode = consumeAuthCode;
exports.issueTokens = issueTokens;
exports.getAccessTokenData = getAccessTokenData;
exports.revokeAccessToken = revokeAccessToken;
exports.rotateTokens = rotateTokens;
const node_crypto_1 = __importDefault(require("node:crypto"));
const ioredis_1 = __importDefault(require("ioredis"));
// ─── Redis key helpers ────────────────────────────────────────────────────────
const K = {
    client: (id) => `sr:client:${id}`,
    authCode: (code) => `sr:authcode:${code}`,
    accessToken: (token) => `sr:at:${token}`,
    refreshToken: (token) => `sr:rt:${token}`,
    atToRt: (accessToken) => `sr:at_to_rt:${accessToken}`,
};
const REFRESH_TOKEN_TTL_S = 30 * 24 * 60 * 60; // 30 days
const ACCESS_TOKEN_TTL_S = 3_600; // 1 hour
const AUTH_CODE_TTL_S = 60; // 60 seconds
// ─── Backend selection ────────────────────────────────────────────────────────
let redis = null;
if (process.env.REDIS_HOST) {
    redis = new ioredis_1.default({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === "true" ? {} : undefined,
        lazyConnect: false,
        enableReadyCheck: true,
        retryStrategy: (times) => Math.min(times * 100, 3000),
    });
    redis.on("error", (err) => console.error("Redis error:", err.message));
    redis.on("connect", () => console.log("Redis connected"));
}
// ─── In-memory fallback stores (dev only) ─────────────────────────────────────
const memClients = new Map();
const memAuthCodes = new Map();
const memAccessTokens = new Map();
const memRefreshTokens = new Map();
// Clean up expired in-memory entries every minute
setInterval(() => {
    const now = Date.now();
    for (const [k, v] of memAuthCodes) {
        if (v.expiresAt < now)
            memAuthCodes.delete(k);
    }
    for (const [k, v] of memAccessTokens) {
        if (v.expiresAt < now)
            memAccessTokens.delete(k);
    }
    for (const [k, v] of memRefreshTokens) {
        if (v.expiresAt < now)
            memRefreshTokens.delete(k);
    }
}, 60_000).unref();
// ─── Client registration ──────────────────────────────────────────────────────
async function registerClient(data) {
    const clientId = `sr_client_${node_crypto_1.default.randomBytes(16).toString("hex")}`;
    const client = { ...data, clientId, createdAt: Date.now() };
    if (redis) {
        await redis.set(K.client(clientId), JSON.stringify(client));
    }
    else {
        memClients.set(clientId, client);
    }
    return client;
}
async function getClient(clientId) {
    if (redis) {
        const raw = await redis.get(K.client(clientId));
        return raw ? JSON.parse(raw) : undefined;
    }
    return memClients.get(clientId);
}
// ─── Auth codes (60s TTL, one-time use) ──────────────────────────────────────
async function storeAuthCode(code, data) {
    const entry = { ...data, expiresAt: Date.now() + AUTH_CODE_TTL_S * 1000 };
    if (redis) {
        await redis.set(K.authCode(code), JSON.stringify(entry), "EX", AUTH_CODE_TTL_S);
    }
    else {
        memAuthCodes.set(code, entry);
    }
}
async function consumeAuthCode(code) {
    if (redis) {
        const key = K.authCode(code);
        const raw = await redis.get(key);
        await redis.del(key); // one-time use regardless
        if (!raw)
            return undefined;
        const entry = JSON.parse(raw);
        if (entry.expiresAt < Date.now())
            return undefined;
        return entry;
    }
    const entry = memAuthCodes.get(code);
    memAuthCodes.delete(code);
    if (!entry || entry.expiresAt < Date.now())
        return undefined;
    return entry;
}
// ─── Access + refresh tokens ──────────────────────────────────────────────────
async function issueTokens(data) {
    const accessToken = `mcp_${node_crypto_1.default.randomBytes(24).toString("hex")}`;
    const refreshToken = `mcp_r_${node_crypto_1.default.randomBytes(24).toString("hex")}`;
    const atData = { ...data, expiresAt: Date.now() + ACCESS_TOKEN_TTL_S * 1000 };
    // Refresh tokens carry the session data themselves so rotation never depends
    // on the (much shorter-lived) access token record still being in the store.
    const rtData = { linkedAccessToken: accessToken, ...data };
    if (redis) {
        const pipeline = redis.pipeline();
        pipeline.set(K.accessToken(accessToken), JSON.stringify(atData), "EX", ACCESS_TOKEN_TTL_S);
        pipeline.set(K.refreshToken(refreshToken), JSON.stringify(rtData), "EX", REFRESH_TOKEN_TTL_S);
        pipeline.set(K.atToRt(accessToken), refreshToken, "EX", REFRESH_TOKEN_TTL_S);
        await pipeline.exec();
    }
    else {
        memAccessTokens.set(accessToken, { data: atData, expiresAt: atData.expiresAt });
        memRefreshTokens.set(refreshToken, {
            data: rtData,
            expiresAt: Date.now() + REFRESH_TOKEN_TTL_S * 1000,
        });
    }
    return { accessToken, refreshToken };
}
async function getAccessTokenData(token) {
    if (redis) {
        const raw = await redis.get(K.accessToken(token));
        if (!raw)
            return undefined;
        const data = JSON.parse(raw);
        if (data.expiresAt < Date.now())
            return undefined;
        return data;
    }
    const entry = memAccessTokens.get(token);
    if (!entry || entry.expiresAt < Date.now())
        return undefined;
    return entry.data;
}
async function revokeAccessToken(accessToken) {
    if (redis) {
        const rtKey = K.atToRt(accessToken);
        const refreshToken = await redis.get(rtKey);
        const pipeline = redis.pipeline();
        pipeline.del(K.accessToken(accessToken));
        pipeline.del(rtKey);
        if (refreshToken)
            pipeline.del(K.refreshToken(refreshToken));
        await pipeline.exec();
    }
    else {
        memAccessTokens.delete(accessToken);
        for (const [rt, entry] of memRefreshTokens) {
            if (entry.data.linkedAccessToken === accessToken) {
                memRefreshTokens.delete(rt);
                break;
            }
        }
    }
}
async function rotateTokens(oldRefreshToken) {
    if (redis) {
        const rtKey = K.refreshToken(oldRefreshToken);
        const rtRaw = await redis.get(rtKey);
        if (!rtRaw)
            return undefined;
        let rtData;
        try {
            rtData = JSON.parse(rtRaw);
        }
        catch {
            // Pre-fix refresh token record (plain access-token-id string) — no
            // session data to recover from it, so treat it as invalid.
            await redis.del(rtKey);
            return undefined;
        }
        const oldAccessToken = rtData.linkedAccessToken;
        // Invalidate old pair atomically. The access token record may already
        // be gone (TTL'd out) — deleting a missing key is a harmless no-op.
        const pipeline = redis.pipeline();
        pipeline.del(rtKey);
        pipeline.del(K.accessToken(oldAccessToken));
        pipeline.del(K.atToRt(oldAccessToken));
        await pipeline.exec();
        const data = {
            clientId: rtData.clientId,
            shiprocketToken: rtData.shiprocketToken,
            scope: rtData.scope,
            resource: rtData.resource,
            expiresAt: Date.now() + ACCESS_TOKEN_TTL_S * 1000,
        };
        const tokens = await issueTokens({
            clientId: rtData.clientId,
            shiprocketToken: rtData.shiprocketToken,
            scope: rtData.scope,
            resource: rtData.resource,
        });
        return { ...tokens, data, oldAccessToken };
    }
    // In-memory path
    const entry = memRefreshTokens.get(oldRefreshToken);
    if (!entry)
        return undefined;
    if (entry.expiresAt < Date.now()) {
        memRefreshTokens.delete(oldRefreshToken);
        return undefined;
    }
    const { linkedAccessToken: oldAccessToken, ...sessionData } = entry.data;
    memRefreshTokens.delete(oldRefreshToken);
    memAccessTokens.delete(oldAccessToken);
    const data = { ...sessionData, expiresAt: Date.now() + ACCESS_TOKEN_TTL_S * 1000 };
    const tokens = await issueTokens(sessionData);
    return { ...tokens, data, oldAccessToken };
}
