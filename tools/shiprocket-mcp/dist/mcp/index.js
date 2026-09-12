"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpServer = exports.createMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const tools_1 = require("@/mcp/tools");
const createMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "shiprocket-mcp",
        version: "1.0.0",
    });
    (0, tools_1.initializeTools)(server);
    return server;
};
exports.createMcpServer = createMcpServer;
exports.mcpServer = (0, exports.createMcpServer)();
