"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const root_1 = require("./root");
const ws_1 = require("@trpc/server/adapters/ws");
const http_1 = __importDefault(require("http"));
const next_1 = __importDefault(require("next"));
const url_1 = require("url");
const ws_2 = __importDefault(require("ws"));
const db_1 = require("../db");
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
void app.prepare().then(() => {
    const server = http_1.default.createServer((req, res) => {
        var _a;
        const proto = req.headers["x-forwarded-proto"];
        if (proto && proto === "http") {
            res.writeHead(303, {
                location: `https://` + req.headers.host + ((_a = req.headers.url) !== null && _a !== void 0 ? _a : ""),
            });
            res.end();
            return;
        }
        const parsedUrl = (0, url_1.parse)(req.url, true);
        void handle(req, res, parsedUrl);
    });
    const wss = new ws_2.default.Server({ server });
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
    process.on("SIGTERM", () => {
        console.log("SIGTERM");
        handler.broadcastReconnectNotification();
    });
    server.listen(port);
    console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
});
