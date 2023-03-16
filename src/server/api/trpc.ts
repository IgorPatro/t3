import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return {
    prisma,
    session: _opts.req.cookies.session,
  };
};

import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
