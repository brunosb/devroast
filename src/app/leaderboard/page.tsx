import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { CollapsibleCode } from "../collapsible-code";

export const metadata: Metadata = {
  title: "Shame Leaderboard | DevRoast",
  description:
    "The most roasted code on the internet. See the worst-scored submissions on DevRoast.",
};

export default async function LeaderboardPage() {
  "use cache";
  cacheLife("hours");

  const caller = appRouter.createCaller(await createTRPCContext());

  const [entries, stats] = await Promise.all([
    caller.leaderboard.getFullLeaderboard(),
    caller.leaderboard.getStats(),
  ]);

  return (
    <main className="flex flex-col gap-10 px-6 py-10 md:px-20">
      {/* Hero Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent">
            {">"}
          </span>
          <h1 className="font-mono text-[28px] font-bold text-foreground">
            shame_leaderboard
          </h1>
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          {"// the most roasted code on the internet"}
        </p>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground/60">
          <span>{stats.totalRoasts.toLocaleString()} submissions</span>
          <span>·</span>
          <span>avg score: {stats.avgScore.toFixed(1)}/10</span>
        </div>
      </section>

      {/* Leaderboard Entries */}
      <section className="flex flex-col gap-5">
        {entries.length === 0 ? (
          <p className="py-8 text-center font-mono text-xs text-muted-foreground">
            no roasts yet. be the first victim.
          </p>
        ) : (
          entries.map((entry, index) => (
            <article key={entry.id} className="border border-border">
              {/* Meta Row */}
              <Link href={`/roast/${entry.id}`}>
                <div className="flex h-12 items-center justify-between border-b border-border px-5 transition-colors hover:bg-muted-foreground/5">
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-[13px]">
                      <span className="text-muted-foreground/60">#</span>
                      <span className="font-bold text-amber-500">
                        {index + 1}
                      </span>
                    </span>
                    <span className="text-xs">
                      <span className="text-muted-foreground/60">score: </span>
                      <span className="text-[13px] font-bold text-red-500">
                        {entry.score}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-muted-foreground">
                      {entry.language}
                    </span>
                    <span className="text-muted-foreground/60">
                      {entry.lineCount} lines
                    </span>
                  </div>
                </div>
              </Link>

              {/* Collapsible Code Block */}
              <CollapsibleCode lineCount={entry.lineCount}>
                <CodeBlock
                  code={entry.code}
                  language={entry.language}
                  className="bg-input [&_pre]:bg-transparent! [&_pre]:py-3.5 [&_pre]:text-xs"
                />
              </CollapsibleCode>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
