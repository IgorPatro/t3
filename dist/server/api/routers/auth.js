"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
const trpc_1 = require("@/server/api/trpc");
const server_1 = require("@trpc/server");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
    repPassword: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.authRouter = (0, trpc_1.createTRPCRouter)({
    register: trpc_1.publicProcedure
        .input(exports.RegisterSchema)
        .mutation(async ({ ctx, input }) => {
        const existingUser = await ctx.prisma.user.findFirst({
            where: { email: input.email },
        });
        if (existingUser)
            throw new server_1.TRPCError({
                code: "CONFLICT",
            });
        const { repPassword: __repPassword, ...rest } = input;
        const createdUser = await ctx.prisma.user.create({
            data: {
                ...rest,
                password: await (0, bcrypt_1.hash)(input.password, 10),
            },
        });
        return createdUser;
    }),
    login: trpc_1.publicProcedure.input(exports.LoginSchema).mutation(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findFirst({
            where: { email: input.email },
        });
        if (!user)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
            });
        const isPasswordCorrect = await (0, bcrypt_1.compare)(input.password, user.password);
        if (!isPasswordCorrect)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
            });
        const token = (0, jsonwebtoken_1.sign)(user.id, "secret");
        return token;
    }),
    me: trpc_1.privateProcedure.query(({ ctx }) => {
        const { userId } = ctx;
        return {
            user: {
                id: userId,
            },
        };
    }),
});
