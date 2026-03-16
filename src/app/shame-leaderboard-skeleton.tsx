export function ShameLeaderboardSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
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

      <div className="mt-4 flex animate-pulse justify-center">
        <span className="h-4 w-56 rounded bg-muted-foreground/10" />
      </div>
    </>
  );
}
