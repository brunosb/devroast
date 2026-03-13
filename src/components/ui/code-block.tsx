import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
};

async function CodeBlock({
  code,
  language = "javascript",
  filename,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    theme: "vesper",
  });

  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-lg border border-border font-mono",
        className,
      )}
    >
      {filename && (
        <div className="flex h-10 items-center gap-3 border-b border-border px-4">
          <span className="size-2.5 rounded-full bg-red-500" />
          <span className="size-2.5 rounded-full bg-amber-500" />
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="flex-1" />
          <span className="text-xs text-muted-foreground">{filename}</span>
        </div>
      )}
      <div
        className="[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export { CodeBlock, type CodeBlockProps };
