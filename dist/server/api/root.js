"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("@/server/api/trpc");
const user_1 = require("@/server/api/routers/user");
const auth_1 = require("@/server/api/routers/auth");
const observable_1 = require("@trpc/server/observable");
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    healthcheck: trpc_1.publicProcedure.query(() => {
        return "OK";
    }),
    user: user_1.userRouter,
    auth: auth_1.authRouter,
    randomNumber: trpc_1.publicProcedure.subscription(() => {
        return (0, observable_1.observable)((emit) => {
            const int = setInterval(() => {
                emit.next(Math.random());
            }, 5000);
            return () => {
                clearInterval(int);
            };
        });
    }),
});
