"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const root_1 = require("./root");
const ws_1 = require("@trpc/server/adapters/ws");
const ws_2 = __importDefault(require("ws"));
const db_1 = require("@/server/db");
const wss = new ws_2.default.Server({
    port: 3001,
});
const handler = (0, ws_1.applyWSSHandler)({
    wss,
    router: root_1.appRouter,
    createContext: () => {
        return {
            prisma: db_1.prisma,
            session: undefined,
        };
    },
});
wss.on("connection", (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once("close", () => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
    });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");
process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
});
