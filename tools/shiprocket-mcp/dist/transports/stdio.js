"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@/config");
const connections_1 = require("@/mcp/connections");
const index_1 = require("@/mcp/index");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const axios_1 = __importDefault(require("axios"));
const transport = new stdio_js_1.StdioServerTransport();
(async () => {
    try {
        const sellerEmail = process.env.SELLER_EMAIL || process.env.SHIPROCKET_EMAIL;
        const sellerPassword = process.env.SELLER_PASSWORD || process.env.SHIPROCKET_PASSWORD;
        if (!sellerEmail || !sellerPassword) {
            throw new Error("Seller email and password is required in ENV (SELLER_EMAIL / SELLER_PASSWORD or SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD)");
        }
        const url = `${config_1.API_DOMAINS.SHIPROCKET}/v1/external/auth/login`;
        const data = (await axios_1.default.post(url, { email: sellerEmail, password: sellerPassword })).data;
        const sellerToken = data.token;
        connections_1.connectionsBySessionId[connections_1.globalSessionId] = { transport, sellerToken };
        await index_1.mcpServer.connect(transport);
    }
    catch (err) {
        if (err instanceof axios_1.default.AxiosError) {
            console.error({
                success: false,
                error: err.response?.data,
            });
        }
        else if (err instanceof Error) {
            console.error({
                success: false,
                error: err.message,
            });
        }
        process.exit(1);
    }
})();
