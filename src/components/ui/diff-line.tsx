import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
  slots: {
    root: "flex gap-2 px-4 py-2 font-mono text-[13px]",
    prefix: "",
    code: "",
  },
  variants: {
    type: {
      added: {
        root: "bg-[#0A1A0F]",
        prefix: "text-accent",
        code: "text-foreground",
      },
      removed: {
        root: "bg-[#1A0A0A]",
        prefix: "text-red-500",
        code: "text-muted-foreground",
      },
      context: {
        root: "",
        prefix: "text-muted-foreground",
        code: "text-muted-foreground",
      },
    },
  },
  defaultVariants: {
    type: "context",
  },
});

type DiffLineProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof diffLineVariants> & {
    children: string;
  };

const prefixMap = { added: "+", removed: "-", context: " " } as const;

function DiffLine({
  className,
  type = "context",
  children,
  ...props
}: DiffLineProps) {
  const { root, prefix, code } = diffLineVariants({ type });
  const resolvedType = type ?? "context";

  return (
    <div className={root({ className })} {...props}>
      <span className={prefix()}>{prefixMap[resolvedType]}</span>
      <span className={code()}>{children}</span>
    </div>
  );
}

export { DiffLine, diffLineVariants, type DiffLineProps };
