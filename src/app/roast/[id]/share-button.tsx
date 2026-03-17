"use client";

import { useCallback, useState } from "react";

export function ShareButton({ roastId }: { roastId: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/roast/${roastId}`;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roastId]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-fit items-center gap-1.5 border border-border px-4 py-2 font-mono text-xs text-foreground transition-colors enabled:hover:border-muted-foreground"
    >
      {copied ? "✓ copied!" : "$ share_roast"}
    </button>
  );
}
