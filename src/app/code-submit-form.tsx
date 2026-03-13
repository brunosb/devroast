"use client";

import { useState } from "react";
import { CodeEditor, MAX_CHARS } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export function CodeSubmitForm() {
  const [code, setCode] = useState("");

  return (
    <>
      {/* Code Editor */}
      <section className="mt-12 w-full max-w-[780px]">
        <CodeEditor value={code} onChange={setCode} />
      </section>

      {/* Actions Bar */}
      <section className="mt-4 flex w-full max-w-[780px] items-center justify-between">
        <Toggle label="roast mode: brutal" defaultChecked />
        <Button
          variant="accent"
          size="md"
          className="font-mono"
          disabled={code.trim().length === 0 || code.length > MAX_CHARS}
        >
          <span className="text-accent-foreground/70">$</span> roast_my_code
        </Button>
      </section>
    </>
  );
}
