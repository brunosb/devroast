"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CodeEditor, MAX_CHARS } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useTRPC } from "@/trpc/client";

export function CodeSubmitForm() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const brutalRef = useRef(true);
  const router = useRouter();
  const trpc = useTRPC();

  const createRoast = useMutation(
    trpc.roast.create.mutationOptions({
      onSuccess(data) {
        router.push(`/roast/${data.id}`);
      },
    }),
  );

  const canSubmit =
    code.trim().length > 0 &&
    code.length <= MAX_CHARS &&
    !createRoast.isPending;

  return (
    <>
      {/* Code Editor */}
      <section className="mt-12 w-full max-w-[780px]">
        <CodeEditor
          value={code}
          onChange={setCode}
          onLanguageChange={setLanguage}
        />
      </section>

      {/* Actions Bar */}
      <section className="mt-4 flex w-full max-w-[780px] items-center justify-between">
        <Toggle
          label="roast mode: brutal"
          defaultChecked
          onCheckedChange={(checked) => {
            brutalRef.current = checked;
          }}
        />
        <Button
          variant="accent"
          size="md"
          className="font-mono"
          disabled={!canSubmit}
          onClick={() =>
            createRoast.mutate({
              code,
              language,
              brutalMode: brutalRef.current,
            })
          }
        >
          {createRoast.isPending ? (
            <>
              <span className="text-accent-foreground/70">$</span>{" "}
              roasting...
            </>
          ) : (
            <>
              <span className="text-accent-foreground/70">$</span>{" "}
              roast_my_code
            </>
          )}
        </Button>
      </section>
    </>
  );
}
