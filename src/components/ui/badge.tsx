import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  slots: {
    root: "inline-flex items-center gap-2 font-mono text-xs",
    dot: "size-2 shrink-0 rounded-full",
  },
  variants: {
    status: {
      critical: {
        root: "text-red-500",
        dot: "bg-red-500",
      },
      warning: {
        root: "text-amber-500",
        dot: "bg-amber-500",
      },
      good: {
        root: "text-accent",
        dot: "bg-accent",
      },
    },
  },
  defaultVariants: {
    status: "good",
  },
});

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    children: React.ReactNode;
  };

function Badge({ className, status, children, ...props }: BadgeProps) {
  const { root, dot } = badgeVariants({ status });

  return (
    <span className={root({ className })} {...props}>
      <span className={dot()} aria-hidden="true" />
      {children}
    </span>
  );
}

export { Badge, badgeVariants, type BadgeProps };
