import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "@/env.mjs";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
