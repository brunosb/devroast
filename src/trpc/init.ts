import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { db } from "@/db";

export const createTRPCContext = cache(async () => {
  return { db };
});

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create();

export const router = t.router;
export const publicProcedure = t.procedure;
