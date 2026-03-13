"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ToggleProps = Omit<ComponentProps<typeof Switch.Root>, "className"> & {
  label?: string;
  className?: string;
};

function Toggle({ label, className, ...props }: ToggleProps) {
  return (
    <label className={twMerge("inline-flex items-center gap-3", className)}>
      <Switch.Root
        className="peer relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full bg-secondary transition-colors data-[checked]:bg-accent"
        {...props}
      >
        <Switch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-white transition-transform data-[checked]:translate-x-[22px]" />
      </Switch.Root>
      {label && (
        <span className="font-mono text-xs text-muted-foreground transition-colors peer-data-[checked]:text-accent">
          {label}
        </span>
      )}
    </label>
  );
}

export { Toggle, type ToggleProps };
