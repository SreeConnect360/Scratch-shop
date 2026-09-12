"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyS256 = verifyS256;
exports.redirectUriMatches = redirectUriMatches;
const node_crypto_1 = __importDefault(require("node:crypto"));
function verifyS256(codeVerifier, codeChallenge) {
    const computed = node_crypto_1.default
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");
    return computed === codeChallenge;
}
// RFC 9126: localhost redirect URIs match regardless of port
function redirectUriMatches(registered, requested) {
    try {
        const r1 = new URL(registered);
        const r2 = new URL(requested);
        const isLocalhost = r1.hostname === "localhost" || r1.hostname === "127.0.0.1";
        if (isLocalhost) {
            return (r1.protocol === r2.protocol &&
                r1.hostname === r2.hostname &&
                r1.pathname === r2.pathname);
        }
        return registered === requested;
    }
    catch {
        return false;
    }
}
