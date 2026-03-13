import Link from "next/link";

function Navbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b border-border px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-accent">{">"}</span>
        <span className="font-mono text-lg font-medium text-foreground">
          devroast
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/leaderboard"
          className="font-mono text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          leaderboard
        </Link>
      </div>
    </nav>
  );
}

export { Navbar };
