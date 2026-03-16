export default function LeaderboardLoading() {
  return (
    <main className="flex flex-col gap-10 px-6 py-10 md:px-20">
      {/* Hero Section Skeleton */}
      <section className="flex animate-pulse flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="h-8 w-5 rounded bg-muted-foreground/10" />
          <span className="h-8 w-64 rounded bg-muted-foreground/10" />
        </div>
        <span className="h-4 w-72 rounded bg-muted-foreground/10" />
        <span className="h-3 w-48 rounded bg-muted-foreground/10" />
      </section>

      {/* Entries Skeleton */}
      <section className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            key={i}
            className="animate-pulse border border-border"
          >
            {/* Meta Row Skeleton */}
            <div className="flex h-12 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-4">
                <span className="h-4 w-8 rounded bg-muted-foreground/10" />
                <span className="h-4 w-14 rounded bg-muted-foreground/10" />
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-16 rounded bg-muted-foreground/10" />
                <span className="h-4 w-12 rounded bg-muted-foreground/10" />
              </div>
            </div>
            {/* Code Block Skeleton */}
            <div className="flex flex-col gap-2 bg-input p-4">
              <span className="h-3 w-3/4 rounded bg-muted-foreground/10" />
              <span className="h-3 w-1/2 rounded bg-muted-foreground/10" />
              <span className="h-3 w-2/3 rounded bg-muted-foreground/10" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
