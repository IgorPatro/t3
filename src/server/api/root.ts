import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { userRouter } from "@/server/api/routers/user";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
