import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Shame Leaderboard | DevRoast",
  description:
    "The most roasted code on the internet. See the worst-scored submissions on DevRoast.",
};

const leaderboardEntries = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
  },
  {
    rank: 2,
    score: 1.8,
    language: "typescript",
    code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
  },
  {
    rank: 3,
    score: 2.1,
    language: "sql",
    code: `SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
  },
  {
    rank: 4,
    score: 2.3,
    language: "java",
    code: `catch (e) {
  // ignore
}`,
  },
  {
    rank: 5,
    score: 2.5,
    language: "javascript",
    code: `const sleep = (ms) =>
  new Date(Date.now() + ms)
  while(new Date() < end) {}`,
  },
];

export default async function LeaderboardPage() {
  return (
    <main className="flex flex-col gap-10 px-20 py-10">
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
          <span>2,847 submissions</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>
      </section>

      {/* Leaderboard Entries */}
      <section className="flex flex-col gap-5">
        {leaderboardEntries.map((entry) => {
          const lines = entry.code.trim().split("\n");
          return (
            <article key={entry.rank} className="border border-border">
              {/* Meta Row */}
              <div className="flex h-12 items-center justify-between border-b border-border px-5">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[13px]">
                    <span className="text-muted-foreground/60">#</span>
                    <span className="font-bold text-amber-500">
                      {entry.rank}
                    </span>
                  </span>
                  <span className="font-mono text-xs">
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
                    {lines.length} lines
                  </span>
                </div>
              </div>

              {/* Code Block */}
              <CodeBlock
                code={entry.code}
                language={entry.language}
                className="h-30 bg-input [&_pre]:bg-transparent! [&_pre]:py-3.5 [&_pre]:text-xs"
              />
            </article>
          );
        })}
      </section>
    </main>
  );
}
