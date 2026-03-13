"use client";

import hljs from "highlight.js/lib/common";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { twMerge } from "tailwind-merge";

const MAX_CHARS = 2500;

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", ext: "js" },
  { id: "typescript", label: "TypeScript", ext: "tsx" },
  { id: "python", label: "Python", ext: "py" },
  { id: "java", label: "Java", ext: "java" },
  { id: "go", label: "Go", ext: "go" },
  { id: "rust", label: "Rust", ext: "rs" },
  { id: "c", label: "C", ext: "c" },
  { id: "cpp", label: "C++", ext: "cpp" },
  { id: "csharp", label: "C#", ext: "cs" },
  { id: "ruby", label: "Ruby", ext: "rb" },
  { id: "php", label: "PHP", ext: "php" },
  { id: "swift", label: "Swift", ext: "swift" },
  { id: "kotlin", label: "Kotlin", ext: "kt" },
  { id: "sql", label: "SQL", ext: "sql" },
  { id: "html", label: "HTML", ext: "html" },
  { id: "css", label: "CSS", ext: "css" },
  { id: "json", label: "JSON", ext: "json" },
  { id: "yaml", label: "YAML", ext: "yml" },
  { id: "bash", label: "Bash", ext: "sh" },
  { id: "markdown", label: "Markdown", ext: "md" },
] as const;

type LanguageId = (typeof LANGUAGES)[number]["id"];

// Singleton shiki highlighter
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["vesper"],
      langs: LANGUAGES.map((l) => l.id),
    });
  }
  return highlighterPromise;
}

// Map hljs language names → our IDs
const HLJS_MAP: Record<string, LanguageId> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  go: "go",
  rust: "rust",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  ruby: "ruby",
  php: "php",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",
  xml: "html",
  css: "css",
  json: "json",
  yaml: "yaml",
  bash: "bash",
  shell: "bash",
  markdown: "markdown",
};

function getExtension(langId: string): string {
  return LANGUAGES.find((l) => l.id === langId)?.ext ?? "txt";
}

function getLabelById(langId: string): string {
  return LANGUAGES.find((l) => l.id === langId)?.label ?? langId;
}

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  placeholder?: string;
  className?: string;
};

function CodeEditor({
  value,
  onChange,
  language: languageProp,
  onLanguageChange,
  placeholder = "// paste your terrible code here...",
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [manualLanguage, setManualLanguage] = useState<string | null>(null);
  const [highlightedHtml, setHighlightedHtml] = useState("");

  const activeLanguage =
    manualLanguage ?? languageProp ?? detectedLanguage ?? "plaintext";

  // Initialize shiki highlighter (singleton)
  useEffect(() => {
    getHighlighter().then(setHighlighter);
  }, []);

  // Auto-detect language (debounced 300ms)
  useEffect(() => {
    if (manualLanguage || languageProp || !value.trim()) {
      if (!value.trim()) setDetectedLanguage(null);
      return;
    }

    const timer = setTimeout(() => {
      const result = hljs.highlightAuto(value);
      if (result.language) {
        const mapped = HLJS_MAP[result.language];
        if (mapped) {
          setDetectedLanguage(mapped);
          onLanguageChange?.(mapped);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, manualLanguage, languageProp, onLanguageChange]);

  // Generate highlighted HTML
  useEffect(() => {
    if (!highlighter || !value) {
      setHighlightedHtml("");
      return;
    }

    try {
      const html = highlighter.codeToHtml(value, {
        lang: activeLanguage,
        theme: "vesper",
      });
      setHighlightedHtml(html);
    } catch {
      const html = highlighter.codeToHtml(value, {
        lang: "plaintext",
        theme: "vesper",
      });
      setHighlightedHtml(html);
    }
  }, [value, activeLanguage, highlighter]);

  // Scroll sync
  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const pre = preRef.current;
    if (textarea && pre) {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    }
  }, []);

  // Tab → 2 spaces
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = e.currentTarget;
        const { selectionStart, selectionEnd } = textarea;
        const newValue = `${value.substring(0, selectionStart)}  ${value.substring(selectionEnd)}`;
        onChange(newValue);
        requestAnimationFrame(() => {
          textarea.selectionStart = selectionStart + 2;
          textarea.selectionEnd = selectionStart + 2;
        });
      }
    },
    [value, onChange],
  );

  // Language manual select
  const handleLanguageSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const lang = e.target.value;
      if (lang === "auto") {
        setManualLanguage(null);
      } else {
        setManualLanguage(lang);
        onLanguageChange?.(lang);
      }
    },
    [onLanguageChange],
  );

  const filename = `paste_here.${getExtension(activeLanguage)}`;
  const showHighlighted = Boolean(value && highlightedHtml);

  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-xl border border-border font-mono",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-3 rounded-full bg-[#FF5F57]" />
        <span className="size-3 rounded-full bg-[#FEBC2E]" />
        <span className="size-3 rounded-full bg-[#28C840]" />
        <span className="ml-4 text-xs text-muted-foreground">{filename}</span>
        <span className="flex-1" />
        <select
          value={manualLanguage ?? "auto"}
          onChange={handleLanguageSelect}
          className="cursor-pointer rounded border border-border bg-transparent px-2 py-0.5 text-xs text-muted-foreground outline-none transition-colors focus:border-accent"
        >
          <option value="auto">
            auto
            {detectedLanguage ? ` · ${getLabelById(detectedLanguage)}` : ""}
          </option>
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Editor area */}
      <div className="relative grid max-h-[500px] overflow-auto">
        {/* Highlighted code layer */}
        <div
          ref={preRef}
          className="pointer-events-none col-start-1 row-start-1 overflow-hidden [&_code]:font-mono [&_pre]:min-h-[300px] [&_pre]:bg-transparent! [&_pre]:p-5 [&_pre]:text-[13px] [&_pre]:leading-relaxed"
          aria-hidden="true"
          dangerouslySetInnerHTML={
            showHighlighted ? { __html: highlightedHtml } : undefined
          }
        />

        {/* Textarea overlay */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="col-start-1 row-start-1 min-h-[300px] w-full resize-none overflow-auto bg-transparent p-5 text-[13px] leading-relaxed text-foreground caret-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          style={{
            WebkitTextFillColor: showHighlighted ? "transparent" : undefined,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end border-t border-border px-4 py-1.5">
        <span
          className={twMerge(
            "text-[11px] tabular-nums",
            value.length > MAX_CHARS
              ? "text-red-400"
              : "text-muted-foreground/60",
          )}
        >
          {value.length}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
}

export { CodeEditor, LANGUAGES, MAX_CHARS, type CodeEditorProps };
