import type { Roast } from "@/db/schema";

type VerdictColor = {
  dot: string;
  text: string;
};

function getVerdictColor(verdict: string): VerdictColor {
  switch (verdict) {
    case "disaster":
    case "needs_serious_help":
      return { dot: "#EF4444", text: "#EF4444" };
    case "not_great":
      return { dot: "#F59E0B", text: "#F59E0B" };
    default:
      return { dot: "#10B981", text: "#10B981" };
  }
}

function getScoreColor(score: number): string {
  if (score >= 7) return "#10B981";
  if (score >= 4) return "#F59E0B";
  return "#EF4444";
}

export function OGImage({ roast }: { roast: Roast }) {
  const verdictColor = getVerdictColor(roast.verdict);
  const scoreColor = getScoreColor(roast.score);
  const lineCount = roast.code.trim().split("\n").length;

  const roastPreview =
    roast.roastText.length > 120
      ? `"${roast.roastText.slice(0, 117)}..."`
      : `"${roast.roastText}"`;

  return (
    <div
      tw="w-full h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0A0A0A", padding: 64, gap: 28 }}
    >
      {/* Logo */}
      <div tw="flex items-center" style={{ gap: 8 }}>
        <span
          tw="text-2xl font-bold"
          style={{ fontFamily: "JetBrains Mono", color: "#10B981" }}
        >
          {">"}
        </span>
        <span
          tw="text-xl font-medium"
          style={{ fontFamily: "JetBrains Mono", color: "#E5E5E5" }}
        >
          devroast
        </span>
      </div>

      {/* Score */}
      <div tw="flex items-end" style={{ gap: 4 }}>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
            color: scoreColor,
          }}
        >
          {roast.score.toFixed(1)}
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 56,
            lineHeight: 1,
            color: "#737373",
          }}
        >
          /10
        </span>
      </div>

      {/* Verdict */}
      <div tw="flex items-center" style={{ gap: 8 }}>
        <div
          tw="rounded-full"
          style={{
            width: 12,
            height: 12,
            backgroundColor: verdictColor.dot,
          }}
        />
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            color: verdictColor.text,
          }}
        >
          {roast.verdict}
        </span>
      </div>

      {/* Language info */}
      <span
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 16,
          color: "#4B5563",
        }}
      >
        lang: {roast.language} · {lineCount} lines
        {roast.brutalMode ? " · brutal mode" : ""}
      </span>

      {/* Roast text */}
      <span
        tw="text-center"
        style={{
          fontFamily: "Geist",
          fontSize: 22,
          color: "#E5E5E5",
          lineHeight: 1.5,
          maxWidth: 1072,
        }}
      >
        {roastPreview}
      </span>
    </div>
  );
}
