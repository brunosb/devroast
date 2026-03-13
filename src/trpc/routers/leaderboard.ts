import { eq } from "drizzle-orm";
import { stats } from "@/db/schema";
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
});
