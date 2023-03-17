"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const client_1 = require("@trpc/client");
const next_1 = require("@trpc/next");
const superjson_1 = __importDefault(require("superjson"));
function getEndingLink(ctx) {
    if (typeof window === "undefined") {
        return (0, client_1.httpBatchLink)({
            url: `http://localhost:3000/api/trpc`,
            headers() {
                if (ctx === null || ctx === void 0 ? void 0 : ctx.req) {
                    return {
                        ...ctx.req.headers,
                        "x-ssr": "1",
                    };
                }
                return {};
            },
        });
    }
    const client = (0, client_1.createWSClient)({
        url: "ws://localhost:3001",
    });
    return (0, client_1.wsLink)({
        client,
    });
}
exports.api = (0, next_1.createTRPCNext)({
    config({ ctx }) {
        return {
            links: [getEndingLink(ctx)],
            transformer: superjson_1.default,
            queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    ssr: true,
});
