import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

function LeaderboardRowRoot({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-6 border-b border-border px-5 py-4 font-mono",
        className,
      )}
      {...props}
    />
  );
}

function LeaderboardRowRank({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={twMerge("w-10 text-[13px] text-muted-foreground", className)}
      {...props}
    />
  );
}

function getScoreColor(score: number): string {
  if (score >= 7) return "text-accent";
  if (score >= 4) return "text-amber-500";
  return "text-red-500";
}

type LeaderboardRowScoreProps = ComponentProps<"span"> & {
  score: number;
};

function LeaderboardRowScore({
  score,
  className,
  ...props
}: LeaderboardRowScoreProps) {
  return (
    <span
      className={twMerge(
        "w-15 text-[13px] font-bold",
        getScoreColor(score),
        className,
      )}
      {...props}
    >
      {score}
    </span>
  );
}

function LeaderboardRowCode({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={twMerge(
        "flex-1 truncate text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function LeaderboardRowLanguage({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={twMerge(
        "w-25 text-right text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  LeaderboardRowRoot,
  LeaderboardRowRank,
  LeaderboardRowScore,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
};
