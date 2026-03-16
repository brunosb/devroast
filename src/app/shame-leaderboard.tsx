import "server-only";

import { cacheLife } from "next/cache";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { CollapsibleCode } from "./collapsible-code";

export async function ShameLeaderboard() {
  "use cache";
  cacheLife("hours");

  const caller = appRouter.createCaller(await createTRPCContext());

  const [topWorst, stats] = await Promise.all([
    caller.leaderboard.getTopWorst(),
    caller.leaderboard.getStats(),
  ]);

  if (topWorst.length === 0) {
    return (
      <p className="py-8 text-center font-mono text-xs text-muted-foreground">
        no roasts yet. be the first victim.
      </p>
    );
  }

  return (
    <>
      {topWorst.map((entry, index) => (
        <article key={entry.id} className="border border-border">
          {/* Meta Row */}
          <Link href={`/roast/${entry.id}`}>
            <div className="flex h-12 items-center justify-between border-b border-border px-5 transition-colors hover:bg-muted-foreground/5">
              <div className="flex items-center gap-4 font-mono">
                <span className="text-[13px]">
                  <span className="text-muted-foreground/60">#</span>
                  <span className="font-bold text-amber-500">{index + 1}</span>
                </span>
                <span className="text-xs">
                  <span className="text-muted-foreground/60">score: </span>
                  <span className="text-[13px] font-bold text-red-500">
                    {entry.score}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-muted-foreground">{entry.language}</span>
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
      ))}

      <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
        showing top 3 of {stats.totalRoasts} ·{" "}
        <Link
          href="/leaderboard"
          className="text-accent transition-colors hover:text-accent/80"
        >
          view full leaderboard {">>"}
        </Link>
      </p>
    </>
  );
}
