import { twMerge } from "tailwind-merge";

type ScoreRingProps = {
  score: number;
  max?: number;
  size?: number;
  className?: string;
};

function getScoreColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio >= 0.7) return "#10B981";
  if (ratio >= 0.4) return "#F59E0B";
  return "#EF4444";
}

function ScoreRing({ score, max = 10, size = 180, className }: ScoreRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(score / max, 1);
  const strokeDashoffset = circumference * (1 - ratio);
  const color = getScoreColor(score, max);

  return (
    <div
      className={twMerge(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        role="img"
        aria-label={`Score ${score} out of ${max}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="flex items-baseline gap-0.5 font-mono">
        <span className="text-5xl font-bold text-foreground leading-none">
          {score}
        </span>
        <span className="text-base text-muted-foreground leading-none">
          /{max}
        </span>
      </div>
    </div>
  );
}

export { ScoreRing, type ScoreRingProps };
