import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { OGImage } from "@/components/og-image";
import { db } from "@/db";
import { roasts } from "@/db/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [roast] = await db.select().from(roasts).where(eq(roasts.id, id));

  if (!roast) {
    return new Response("Not found", { status: 404 });
  }

  const jetbrainsMono = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-800-normal.woff2",
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(<OGImage roast={roast} />, {
    width: 1200,
    height: 630,
    format: "png",
    fonts: [
      {
        name: "JetBrains Mono",
        data: jetbrainsMono,
        weight: 800,
        style: "normal",
      },
    ],
  });
}
