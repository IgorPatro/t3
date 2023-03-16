import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({});
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.user.findFirst({ where: { id: input.id } })
    ),
  create: publicProcedure
    .input(
      z.object({
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({ data: input });
    }),
});
