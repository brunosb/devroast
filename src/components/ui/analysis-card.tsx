import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

function AnalysisCardRoot({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-3 rounded-none border border-border p-5",
        className,
      )}
      {...props}
    />
  );
}

function AnalysisCardTitle({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={twMerge("font-mono text-[13px] text-foreground", className)}
      {...props}
    />
  );
}

function AnalysisCardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={twMerge(
        "font-mono text-xs leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { AnalysisCardRoot, AnalysisCardTitle, AnalysisCardDescription };
