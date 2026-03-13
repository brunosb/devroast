"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

export function FooterStats() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.leaderboard.getStats.queryOptions());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalRoasts = data?.totalRoasts ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <p className="mt-12 font-mono text-xs text-muted-foreground">
      {mounted ? (
        <NumberFlow value={totalRoasts} format={{ useGrouping: true }} />
      ) : (
        <span>{totalRoasts.toLocaleString()}</span>
      )}{" "}
      codes roasted · avg score:{" "}
      {mounted ? (
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
      ) : (
        <span>{avgScore.toFixed(1)}</span>
      )}
      /10
    </p>
  );
}
