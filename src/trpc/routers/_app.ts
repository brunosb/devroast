import { router } from "../init";
import { leaderboardRouter } from "./leaderboard";
import { roastRouter } from "./roast";

export const appRouter = router({
  leaderboard: leaderboardRouter,
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
