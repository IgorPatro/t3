"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const next_1 = require("@trpc/server/adapters/next");
const trpc_1 = require("@/server/api/trpc");
const root_1 = require("@/server/api/root");
exports.default = (0, next_1.createNextApiHandler)({
    router: root_1.appRouter,
    createContext: trpc_1.createTRPCContext,
    onError({ error }) {
        console.error(error);
    },
    batching: {
        enabled: true,
    },
});
