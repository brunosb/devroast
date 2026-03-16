import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { db } from "@/db";
import { issues, roasts } from "@/db/schema";

type VerdictStatus = "critical" | "warning" | "good";

function getVerdictBadgeStatus(verdict: string): VerdictStatus {
  switch (verdict) {
    case "disaster":
    case "needs_serious_help":
      return "critical";
    case "not_great":
      return "warning";
    default:
      return "good";
  }
}

type DiffData = {
  filename: string;
  lines: { type: "context" | "removed" | "added"; code: string }[];
};

export async function RoastContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [roast] = await db.select().from(roasts).where(eq(roasts.id, id));

  if (!roast) {
    notFound();
  }

  const roastIssues = await db
    .select()
    .from(issues)
    .where(eq(issues.roastId, roast.id));

  const diff: DiffData | null = roast.diff ? JSON.parse(roast.diff) : null;
  const lines = roast.code.trim().split("\n");

  return (
    <>
      {/* Score Hero */}
      <section className="flex items-center gap-12">
        <ScoreRing score={roast.score} />

        <div className="flex flex-1 flex-col gap-4">
          <Badge status={getVerdictBadgeStatus(roast.verdict)}>
            verdict: {roast.verdict}
          </Badge>

          <p className="font-mono text-xl leading-relaxed text-foreground">
            {roast.roastText}
          </p>

          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground/60">
            <span>lang: {roast.language}</span>
            <span>·</span>
            <span>{lines.length} lines</span>
            {roast.brutalMode && (
              <>
                <span>·</span>
                <span className="text-red-500">brutal mode</span>
              </>
            )}
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
            code={roast.code}
            language={roast.language}
            className="bg-input [&_pre]:text-xs"
          />
        </div>
      </section>

      <hr className="border-border" />

      {/* Analysis Section */}
      {roastIssues.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="font-mono text-sm font-bold">
            <span className="text-accent">{"// "}</span>
            <span className="text-foreground">detailed_analysis</span>
          </h2>

          <div className="grid grid-cols-2 gap-5">
            {roastIssues.map((issue) => (
              <AnalysisCardRoot key={issue.id}>
                <Badge status={issue.severity}>{issue.severity}</Badge>
                <AnalysisCardTitle>{issue.title}</AnalysisCardTitle>
                <AnalysisCardDescription>
                  {issue.description}
                </AnalysisCardDescription>
              </AnalysisCardRoot>
            ))}
          </div>
        </section>
      )}

      {/* Diff Section */}
      {diff && (
        <>
          <hr className="border-border" />

          <section className="flex flex-col gap-6">
            <h2 className="font-mono text-sm font-bold">
              <span className="text-accent">{"// "}</span>
              <span className="text-foreground">suggested_fix</span>
            </h2>

            <div className="overflow-hidden border border-border bg-input">
              <div className="flex h-10 items-center border-b border-border px-4">
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {diff.filename}
                </span>
              </div>
              <div className="py-1">
                {diff.lines.map((line, i) => (
                  <DiffLine key={`${line.type}-${i}`} type={line.type}>
                    {line.code}
                  </DiffLine>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
