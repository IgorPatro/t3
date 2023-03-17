import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError({ error }) {
    console.error(error);
  },
  batching: {
    enabled: true,
  },
});
