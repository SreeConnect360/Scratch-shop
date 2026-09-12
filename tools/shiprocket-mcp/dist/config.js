"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_DOMAINS = void 0;
exports.API_DOMAINS = {
    SHIPROCKET: process.env.API_BASE_SHIPROCKET ?? "https://apiv2.shiprocket.in",
    SERVICEABILITY: process.env.API_BASE_SERVICEABILITY ??
        "https://serviceability.shiprocket.in",
};
