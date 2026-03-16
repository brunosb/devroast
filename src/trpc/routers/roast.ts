import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { issues, roasts, stats } from "@/db/schema";
import { publicProcedure, router } from "../init";

const diffLineSchema = z.object({
  type: z.enum(["context", "removed", "added"]),
  code: z.string(),
});

const roastOutputSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum([
    "disaster",
    "needs_serious_help",
    "not_great",
    "acceptable",
    "clean_code",
  ]),
  roastText: z.string(),
  issues: z
    .array(
      z.object({
        severity: z.enum(["critical", "warning", "good"]),
        title: z.string(),
        description: z.string(),
      }),
    )
    .min(1)
    .max(8),
  diff: z
    .object({
      filename: z.string(),
      lines: z.array(diffLineSchema),
    })
    .nullable(),
});

function buildSystemPrompt(brutalMode: boolean) {
  const tone = brutalMode
    ? `You are an EXTREMELY sarcastic, brutally funny senior developer who takes pleasure in roasting terrible code. Your commentary should be savage but technically accurate. Use dark humor, dramatic metaphors, and exaggerated disappointment. Make the developer question their career choices.`
    : `You are a witty senior developer who provides code reviews with a humorous edge. Your tone is playful and teasing but still constructive. Think friendly roast, not mean-spirited.`;

  return `${tone}

You analyze code snippets and produce a structured review with:

1. **score** (0-10): How good the code is. 0 = absolute disaster, 10 = perfect. Be harsh but fair.
2. **verdict**: One of: "disaster" (0-2), "needs_serious_help" (2-4), "not_great" (4-6), "acceptable" (6-8), "clean_code" (8-10). Must match the score range.
3. **roastText**: A single memorable quote roasting the code (1-2 sentences). ${brutalMode ? "Make it SAVAGE." : "Make it witty."}
4. **issues**: Array of 2-6 specific issues found. Each has:
   - severity: "critical" (bugs/security), "warning" (bad practices), "good" (things done right)
   - title: Short title (max 60 chars, lowercase)
   - description: Explanation of the issue and how to fix it (2-3 sentences)
   Include at least one "good" issue if possible — find SOMETHING positive.
5. **diff**: A suggested fix showing key improvements. Use "context" lines for unchanged code, "removed" for old code, "added" for new code. The filename should be "your_code → improved_code". Set to null if the code is too short or there's nothing meaningful to fix.

RULES:
- Focus on real technical issues: bugs, security, performance, readability, best practices.
- The roastText should be quotable and funny, wrapped in quotes.
- Keep diff concise — show only the most impactful change, not a full rewrite.
- If the code is actually good, acknowledge it but still find something to tease about.`;
}

export const roastRouter = router({
  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2500),
        language: z.string().min(1).max(50),
        brutalMode: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lineCount = input.code.trim().split("\n").length;

      const { output } = await generateText({
        model: google("gemini-2.5-flash-lite"),
        output: Output.object({ schema: roastOutputSchema }),
        system: buildSystemPrompt(input.brutalMode),
        prompt: `Review this ${input.language} code:\n\n\`\`\`${input.language}\n${input.code}\n\`\`\``,
      });

      if (!output) {
        throw new Error("AI failed to generate a valid roast");
      }

      const diffJson = output.diff ? JSON.stringify(output.diff) : null;

      const [roast] = await ctx.db
        .insert(roasts)
        .values({
          code: input.code,
          language: input.language,
          lineCount,
          brutalMode: input.brutalMode,
          score: output.score,
          verdict: output.verdict,
          roastText: output.roastText,
          diff: diffJson,
        })
        .returning({ id: roasts.id });

      if (output.issues.length > 0) {
        await ctx.db.insert(issues).values(
          output.issues.map((issue) => ({
            roastId: roast.id,
            severity: issue.severity,
            title: issue.title,
            description: issue.description,
          })),
        );
      }

      await ctx.db
        .insert(stats)
        .values({
          id: 1,
          totalRoasts: 1,
          avgScore: output.score,
        })
        .onConflictDoUpdate({
          target: stats.id,
          set: {
            totalRoasts: sql`${stats.totalRoasts} + 1`,
            avgScore: sql`(${stats.avgScore} * ${stats.totalRoasts} + ${output.score}) / (${stats.totalRoasts} + 1)`,
            updatedAt: sql`now()`,
          },
        });

      return { id: roast.id };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [roast] = await ctx.db
        .select()
        .from(roasts)
        .where(eq(roasts.id, input.id));

      if (!roast) {
        throw new Error("Roast not found");
      }

      const roastIssues = await ctx.db
        .select()
        .from(issues)
        .where(eq(issues.roastId, roast.id));

      return {
        ...roast,
        diff: roast.diff ? JSON.parse(roast.diff) : null,
        issues: roastIssues,
      };
    }),
});
