import type { Metadata } from "next";
import { Suspense } from "react";
import { RoastContent } from "./roast-content";

export const metadata: Metadata = {
  title: "Roast Results | DevRoast",
  description: "Your code has been roasted. See how bad it really is.",
};

function RoastSkeleton() {
  return (
    <main className="flex flex-col gap-10 px-20 py-10">
      <section className="flex items-center gap-12">
        <div className="size-[180px] animate-pulse rounded-full bg-card" />
        <div className="flex flex-1 flex-col gap-4">
          <div className="h-5 w-48 animate-pulse rounded bg-card" />
          <div className="h-6 w-96 animate-pulse rounded bg-card" />
          <div className="h-4 w-32 animate-pulse rounded bg-card" />
        </div>
      </section>
      <hr className="border-border" />
      <div className="flex flex-col gap-4">
        <div className="h-5 w-40 animate-pulse rounded bg-card" />
        <div className="h-40 animate-pulse rounded bg-card" />
      </div>
    </main>
  );
}

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<RoastSkeleton />}>
      <main className="flex flex-col gap-10 px-20 py-10">
        <RoastContent params={params} />
      </main>
    </Suspense>
  );
}
