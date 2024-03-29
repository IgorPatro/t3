import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { verify } from "jsonwebtoken";
import { parseCookies } from "nookies";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { session } = parseCookies(_opts);

  return {
    prisma,
    session,
  };
};

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

  let userId: string;

  try {
    userId = verify(ctx.session, "secret") as string;
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      userId,
    },
  });
});

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
