import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

type CodeBlockProps = {
  code: string;
  language?: string;
  className?: string;
};

async function CodeBlock({
  code,
  language = "javascript",
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    theme: "vesper",
  });

  return (
    <div
      className={twMerge(
        "overflow-hidden font-mono [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_code]:font-mono",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { CodeBlock, type CodeBlockProps };
