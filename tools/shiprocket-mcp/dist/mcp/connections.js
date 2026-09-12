"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expiredSellerTokenSessions = exports.globalSessionId = exports.connectionsBySessionId = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
exports.connectionsBySessionId = {};
exports.globalSessionId = node_crypto_1.default.randomUUID();
// Sessions where Shiprocket returned 401 — MCP tokens are revoked on the next HTTP request
// to force a full OAuth re-auth (login form) rather than a silent token refresh
exports.expiredSellerTokenSessions = new Set();
