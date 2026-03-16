# App (Pages) — Padrões

## Server vs Client Components

- **Server Component por padrão** — pages em `src/app/` são server components
- Extrair partes interativas para arquivos `"use client"` separados no mesmo diretório
- Nomenclatura dos client components extraídos: `<nome-descritivo>.tsx` (ex: `footer-stats.tsx`, `code-submit-form.tsx`)

## Hydration-safe com NumberFlow

Componentes que usam `@number-flow/react` precisam de um guard de montagem para evitar hydration mismatch, porque `<NumberFlow>` renderiza um custom element (`<number-flow>`) que difere do HTML do servidor.

```tsx
"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

export function AnimatedNumber({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <NumberFlow value={value} /> : <span>{value}</span>;
}
```

- No servidor e no primeiro render do client: renderiza `<span>` com o valor
- Após montar: troca para `<NumberFlow>` que anima transições de valor
- **Não usar prefetch** para dados que devem animar de 0 ao valor real — o prefetch popula o cache no servidor, fazendo o `<span>` renderizar o valor real, enquanto o client renderiza 0 no primeiro render (hydration mismatch)

## Padrão de dados com tRPC

### Com Suspense (dados que aparecem de uma vez)

```tsx
// page.tsx (server component)
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Page() {
  prefetch(trpc.dominio.query.queryOptions());
  return (
    <HydrateClient>
      <ClientComponent /> {/* usa useSuspenseQuery */}
    </HydrateClient>
  );
}
```

### Sem Suspense (dados que animam de 0)

```tsx
// page.tsx (server component) — SEM prefetch
import { HydrateClient } from "@/trpc/server";

export default async function Page() {
  return (
    <HydrateClient>
      <FooterStats /> {/* usa useQuery, valor inicial 0, NumberFlow anima */}
    </HydrateClient>
  );
}
```

## Layout

- `src/app/layout.tsx` envolve children com `TRPCReactProvider` para disponibilizar tRPC em toda a árvore
- Ordem: `<body>` → `TRPCReactProvider` → `Navbar` + `{children}`
