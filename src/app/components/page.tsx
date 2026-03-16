"use cache";

import {
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import {
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

const variants = [
  "primary",
  "accent",
  "secondary",
  "destructive",
  "outline",
  "ghost",
] as const;

const sizes = ["sm", "md", "lg"] as const;

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default async function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background p-12">
      <h1 className="mb-12 font-mono text-3xl font-bold text-foreground">
        UI Components
      </h1>

      {/* Button */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> button
        </h2>
        <div className="space-y-10">
          {variants.map((variant) => (
            <div key={variant}>
              <h3 className="mb-4 font-mono text-sm font-medium text-muted-foreground">
                variant=&quot;{variant}&quot;
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                {sizes.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {variant} ({size})
                  </Button>
                ))}
                <Button variant={variant} disabled>
                  {variant} (disabled)
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Toggle */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> toggle
        </h2>
        <div className="flex flex-wrap items-center gap-8">
          <Toggle label="roast mode" defaultChecked />
          <Toggle label="roast mode" />
        </div>
      </section>

      {/* Badge */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> badge_status
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <Badge status="critical">critical</Badge>
          <Badge status="warning">warning</Badge>
          <Badge status="good">good</Badge>
          <Badge status="critical">needs_serious_help</Badge>
        </div>
      </section>

      {/* AnalysisCard */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> cards
        </h2>
        <AnalysisCardRoot className="max-w-[480px]">
          <Badge status="critical">critical</Badge>
          <AnalysisCardTitle>using var instead of const/let</AnalysisCardTitle>
          <AnalysisCardDescription>
            the var keyword is function-scoped rather than block-scoped, which
            can lead to unexpected behavior and bugs. modern javascript uses
            const for immutable bindings and let for mutable ones.
          </AnalysisCardDescription>
        </AnalysisCardRoot>
      </section>

      {/* CodeBlock */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> code_block
        </h2>
        <div className="max-w-[560px]">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex h-10 items-center gap-3 border-b border-border px-4">
              <span className="size-2.5 rounded-full bg-red-500" />
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="size-2.5 rounded-full bg-accent" />
              <span className="flex-1" />
              <span className="text-xs text-muted-foreground">
                calculate.js
              </span>
            </div>
            <CodeBlock code={sampleCode} language="javascript" />
          </div>
        </div>
      </section>

      {/* DiffLine */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> diff_line
        </h2>
        <div className="max-w-[560px]">
          <DiffLine type="removed">var total = 0;</DiffLine>
          <DiffLine type="added">const total = 0;</DiffLine>
          <DiffLine type="context">
            {"for (let i = 0; i < items.length; i++) {"}
          </DiffLine>
        </div>
      </section>

      {/* LeaderboardRow */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> table_row
        </h2>
        <div>
          <LeaderboardRowRoot>
            <LeaderboardRowRank>#1</LeaderboardRowRank>
            <LeaderboardRowScore score={2.1} />
            <LeaderboardRowCode>
              function calculateTotal(items) {"{"}var total = 0; ...
            </LeaderboardRowCode>
            <LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
          </LeaderboardRowRoot>
          <LeaderboardRowRoot>
            <LeaderboardRowRank>#2</LeaderboardRowRank>
            <LeaderboardRowScore score={5.8} />
            <LeaderboardRowCode>
              const sum = items.reduce((acc, item) ={">"}acc + item.price, 0);
            </LeaderboardRowCode>
            <LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
          </LeaderboardRowRoot>
          <LeaderboardRowRoot>
            <LeaderboardRowRank>#3</LeaderboardRowRank>
            <LeaderboardRowScore score={8.4} />
            <LeaderboardRowCode>
              export const calculateTotal = (items: Item[]) ={">"}
              items.reduce(...)
            </LeaderboardRowCode>
            <LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
          </LeaderboardRowRoot>
        </div>
      </section>

      {/* ScoreRing */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
          <span className="text-accent">{"//"}</span> score_ring
        </h2>
        <div className="flex flex-wrap items-center gap-12">
          <ScoreRing score={3.5} />
          <ScoreRing score={7.2} />
          <ScoreRing score={9.1} />
        </div>
      </section>
    </div>
  );
}
