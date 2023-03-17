import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { authRouter } from "@/server/api/routers/auth";
import { observable } from "@trpc/server/observable";

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => {
    return "OK";
  }),
  user: userRouter,
  auth: authRouter,
  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 5000);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
