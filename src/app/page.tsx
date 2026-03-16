import Link from "next/link";
import { Suspense } from "react";
import { HydrateClient } from "@/trpc/server";
import { CodeSubmitForm } from "./code-submit-form";
import { FooterStats } from "./footer-stats";
import { ShameLeaderboard } from "./shame-leaderboard";
import { ShameLeaderboardSkeleton } from "./shame-leaderboard-skeleton";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex flex-col items-center px-6 pb-20 pt-16">
        {/* Hero */}
        <section className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-mono text-4xl font-bold text-foreground">
            <span className="text-accent">$</span> paste your code. get roasted.
          </h1>
          <p className="max-w-md font-mono text-sm text-muted-foreground">
            Our AI will brutally review your code and rate it from 0 to 10. The
            worse the code, the funnier the roast.
          </p>
        </section>

        <CodeSubmitForm />

        {/* Footer Stats */}
        <FooterStats />

        {/* Leaderboard Preview */}
        <section className="mt-16 flex w-full max-w-[960px] flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm text-muted-foreground">
              <span className="text-muted-foreground/50">{"// "}</span>
              shame_leaderboard
            </h2>
            <Link
              href="/leaderboard"
              className="font-mono text-xs text-accent transition-colors hover:text-accent/80"
            >
              $ view_all {">>"}
            </Link>
          </div>

          {/* Cards + Info Footer */}
          <Suspense fallback={<ShameLeaderboardSkeleton />}>
            <ShameLeaderboard />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  );
}
