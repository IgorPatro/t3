import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { authRouter } from "@/server/api/routers/auth";

export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
