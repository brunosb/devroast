"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeEditor, MAX_CHARS } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import {
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { Toggle } from "@/components/ui/toggle";

const leaderboardData = [
  {
    rank: 1,
    score: 2.1,
    codePreview: "if (x == true && y == true && z == true) { return true }",
    language: "JavaScript",
  },
  {
    rank: 2,
    score: 3.4,
    codePreview: "for i in range(len(list)): print(list[i])",
    language: "Python",
  },
  {
    rank: 3,
    score: 4.8,
    codePreview: "catch (Exception e) { /* TODO: handle later */ }",
    language: "Java",
  },
];

export default function Home() {
  const [code, setCode] = useState("");

  return (
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

      {/* Code Editor */}
      <section className="mt-12 w-full max-w-[780px]">
        <CodeEditor value={code} onChange={setCode} />
      </section>

      {/* Actions Bar */}
      <section className="mt-4 flex w-full max-w-[780px] items-center justify-between">
        <Toggle label="roast mode: brutal" defaultChecked />
        <Button
          variant="accent"
          size="md"
          className="font-mono"
          disabled={code.trim().length === 0 || code.length > MAX_CHARS}
        >
          <span className="text-accent-foreground/70">$</span> roast_my_code
        </Button>
      </section>

      {/* Footer Stats */}
      <p className="mt-12 font-mono text-xs text-muted-foreground">
        2,847 codes roasted · avg score: 4.2/10
      </p>

      {/* Leaderboard Preview */}
      <section className="mt-16 w-full max-w-[960px]">
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

        {/* Table Header */}
        <div className="mt-4 flex items-center gap-6 border-b border-border px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60">
          <span className="w-10">rank</span>
          <span className="w-15">score</span>
          <span className="flex-1">code preview</span>
          <span className="w-25 text-right">language</span>
        </div>

        {/* Rows */}
        {leaderboardData.map((entry) => (
          <LeaderboardRowRoot key={entry.rank}>
            <LeaderboardRowRank>#{entry.rank}</LeaderboardRowRank>
            <LeaderboardRowScore score={entry.score} />
            <LeaderboardRowCode>{entry.codePreview}</LeaderboardRowCode>
            <LeaderboardRowLanguage>{entry.language}</LeaderboardRowLanguage>
          </LeaderboardRowRoot>
        ))}

        <Link
          href="/leaderboard"
          className="mt-4 block text-center font-mono text-xs text-accent transition-colors hover:text-accent/80"
        >
          $ view_all {">>"}
        </Link>
      </section>
    </main>
  );
}
