"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { type ReactNode, useState } from "react";

type CollapsibleCodeProps = {
  children: ReactNode;
  lineCount: number;
};

export function CollapsibleCode({ children, lineCount }: CollapsibleCodeProps) {
  const [open, setOpen] = useState(false);

  if (lineCount <= 4) {
    return <>{children}</>;
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <div className={open ? "" : "max-h-30 overflow-hidden"}>{children}</div>
        {!open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-input to-transparent" />
        )}
      </div>
      <Collapsible.Trigger className="w-full cursor-pointer border-t border-border py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
        {open ? "▲ show less" : "▼ show more"}
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
