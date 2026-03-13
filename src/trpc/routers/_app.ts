import { router } from "../init";
import { leaderboardRouter } from "./leaderboard";

export const appRouter = router({
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
