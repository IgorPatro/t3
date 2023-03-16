import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

export const RegisterSchema = z.object({
  email: z.string(),
  password: z.string(),
  repPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });

      if (existingUser)
        throw new TRPCError({
          code: "CONFLICT",
        });

      const { repPassword: __repPassword, ...rest } = input;

      const createdUser = await ctx.prisma.user.create({
        data: {
          ...rest,
          password: await hash(input.password, 10),
        },
      });

      return createdUser;
    }),
  login: publicProcedure.input(LoginSchema).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({
      where: { email: input.email },
    });

    if (!user)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    const isPasswordCorrect = await compare(input.password, user.password);

    if (!isPasswordCorrect)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    const token = sign(user.id, "secret");

    return token;
  }),
  me: privateProcedure.query(({ ctx }) => {
    const { userId } = ctx;

    return {
      user: {
        id: userId,
      },
    };
  }),
});
