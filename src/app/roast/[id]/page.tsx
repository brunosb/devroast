"use cache";

import type { Metadata } from "next";
import {
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

export const metadata: Metadata = {
  title: "Roast Results | DevRoast",
  description: "Your code has been roasted. See how bad it really is.",
};

const roastData = {
  score: 3.5,
  verdict: "needs_serious_help",
  roastMessage:
    '"this code looks like it was written during a power outage... in 2005."',
  language: "javascript",
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    var discount = total * 0.1;
    total = total - discount;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`,
  issues: [
    {
      status: "critical" as const,
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
      status: "warning" as const,
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
      status: "good" as const,
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
      status: "good" as const,
      title: "single responsibility",
      description:
        "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
    },
  ],
  diff: {
    filename: "your_code.ts → improved_code.ts",
    lines: [
      { type: "context" as const, code: "function calculateTotal(items) {" },
      { type: "removed" as const, code: "  var total = 0;" },
      {
        type: "removed" as const,
        code: "  for (var i = 0; i < items.length; i++) {",
      },
      {
        type: "removed" as const,
        code: "    total = total + items[i].price;",
      },
      { type: "removed" as const, code: "  }" },
      { type: "removed" as const, code: "  return total;" },
      {
        type: "added" as const,
        code: "  return items.reduce((sum, item) => sum + item.price, 0);",
      },
      { type: "context" as const, code: "}" },
    ],
  },
};

export default async function RoastResultsPage() {
  const lines = roastData.code.trim().split("\n");

  return (
    <main className="flex flex-col gap-10 px-20 py-10">
      {/* Score Hero */}
      <section className="flex items-center gap-12">
        <ScoreRing score={roastData.score} />

        <div className="flex flex-1 flex-col gap-4">
          <Badge status="critical">verdict: {roastData.verdict}</Badge>

          <p className="font-mono text-xl leading-relaxed text-foreground">
            {roastData.roastMessage}
          </p>

          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground/60">
            <span>lang: {roastData.language}</span>
            <span>·</span>
            <span>{lines.length} lines</span>
          </div>

          <div>
            <button
              type="button"
              className="border border-border px-4 py-2 font-mono text-xs text-foreground transition-colors hover:bg-card"
            >
              $ share_roast
            </button>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Submitted Code Section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-sm font-bold">
          <span className="text-accent">{"// "}</span>
          <span className="text-foreground">your_submission</span>
        </h2>

        <div className="overflow-hidden border border-border">
          <CodeBlock
            code={roastData.code}
            language={roastData.language}
            className="bg-input [&_pre]:text-xs"
          />
        </div>
      </section>

      <hr className="border-border" />

      {/* Analysis Section */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-sm font-bold">
          <span className="text-accent">{"// "}</span>
          <span className="text-foreground">detailed_analysis</span>
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {roastData.issues.map((issue) => (
            <AnalysisCardRoot key={issue.title}>
              <Badge status={issue.status}>{issue.status}</Badge>
              <AnalysisCardTitle>{issue.title}</AnalysisCardTitle>
              <AnalysisCardDescription>
                {issue.description}
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* Diff Section */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-sm font-bold">
          <span className="text-accent">{"// "}</span>
          <span className="text-foreground">suggested_fix</span>
        </h2>

        <div className="overflow-hidden border border-border bg-input">
          <div className="flex h-10 items-center border-b border-border px-4">
            <span className="font-mono text-xs font-medium text-muted-foreground">
              {roastData.diff.filename}
            </span>
          </div>
          <div className="py-1">
            {roastData.diff.lines.map((line) => (
              <DiffLine key={line.code} type={line.type}>
                {line.code}
              </DiffLine>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
