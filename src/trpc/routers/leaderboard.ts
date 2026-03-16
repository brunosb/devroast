import { asc, eq } from "drizzle-orm";
import { roasts, stats } from "@/db/schema";
import { publicProcedure, router } from "../init";

export const leaderboardRouter = router({
  getStats: publicProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({
        totalRoasts: stats.totalRoasts,
        avgScore: stats.avgScore,
      })
      .from(stats)
      .where(eq(stats.id, 1));

    return row ?? { totalRoasts: 0, avgScore: 0 };
  }),

  getTopWorst: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: roasts.id,
        score: roasts.score,
        code: roasts.code,
        language: roasts.language,
        lineCount: roasts.lineCount,
      })
      .from(roasts)
      .orderBy(asc(roasts.score))
      .limit(3);
  }),

  getFullLeaderboard: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: roasts.id,
        score: roasts.score,
        code: roasts.code,
        language: roasts.language,
        lineCount: roasts.lineCount,
      })
      .from(roasts)
      .orderBy(asc(roasts.score))
      .limit(20);
  }),
});
