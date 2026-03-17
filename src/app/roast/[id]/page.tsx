import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { RoastContent } from "./roast-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [roast] = await db.select().from(roasts).where(eq(roasts.id, id));

  if (!roast) {
    return {
      title: "Roast Not Found | DevRoast",
    };
  }

  const description =
    roast.roastText.length > 150
      ? `${roast.roastText.slice(0, 147)}...`
      : roast.roastText;

  return {
    title: `Score ${roast.score}/10 — ${roast.verdict} | DevRoast`,
    description,
    openGraph: {
      title: `Score ${roast.score}/10 — ${roast.verdict} | DevRoast`,
      description,
      images: [
        {
          url: `/api/og/${id}`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Score ${roast.score}/10 — ${roast.verdict} | DevRoast`,
      description,
      images: [`/api/og/${id}`],
    },
  };
}

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
