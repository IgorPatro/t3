"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateProcedure = exports.publicProcedure = exports.createTRPCRouter = exports.createTRPCContext = void 0;
const db_1 = require("@/server/db");
const server_1 = require("@trpc/server");
const jsonwebtoken_1 = require("jsonwebtoken");
const nookies_1 = require("nookies");
const server_2 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const createTRPCContext = (_opts) => {
    const { session } = (0, nookies_1.parseCookies)(_opts);
    return {
        prisma: db_1.prisma,
        session,
    };
};
exports.createTRPCContext = createTRPCContext;
const t = server_2.initTRPC.context().create({
    transformer: superjson_1.default,
    errorFormatter({ shape }) {
        return shape;
    },
});
exports.createTRPCRouter = t.router;
const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session) {
        throw new server_1.TRPCError({
            code: "UNAUTHORIZED",
        });
    }
    let userId;
    try {
        userId = (0, jsonwebtoken_1.verify)(ctx.session, "secret");
    }
    catch (error) {
        throw new server_1.TRPCError({
            code: "UNAUTHORIZED",
        });
    }
    return next({
        ctx: {
            userId,
        },
    });
});
exports.publicProcedure = t.procedure;
exports.privateProcedure = t.procedure.use(isAuthed);
