import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { verify } from "jsonwebtoken";
import { parseCookies } from "nookies";

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { session } = parseCookies(_opts);

  return {
    prisma,
    session,
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

  const user = verify(ctx.session, "secret");

  console.log(user);

  return next({
    ctx: {
      user,
    },
  });
});

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
