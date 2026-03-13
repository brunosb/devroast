import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground enabled:hover:bg-primary/90",
      accent: "bg-accent text-accent-foreground enabled:hover:bg-accent/90",
      secondary:
        "bg-secondary text-secondary-foreground enabled:hover:bg-secondary/80",
      destructive:
        "bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90",
      outline:
        "border border-border bg-transparent text-foreground enabled:hover:bg-secondary",
      ghost: "bg-transparent text-foreground enabled:hover:bg-secondary",
    },
    size: {
      sm: "px-4 py-1.5 text-xs rounded-md",
      md: "px-6 py-2.5 text-sm rounded-lg",
      lg: "px-8 py-3 text-base rounded-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
