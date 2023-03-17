"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("@/server/api/trpc");
exports.userRouter = (0, trpc_1.createTRPCRouter)({
    getAll: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const users = await ctx.prisma.user.findMany();
        return users;
    }),
    getOne: trpc_1.privateProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(({ ctx, input }) => {
        return ctx.prisma.user.findFirst({ where: { id: input.id } });
    }),
});
