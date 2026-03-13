# tRPC — Spec

## Contexto

O DevRoast atualmente usa dados mockados nas páginas (homepage, leaderboard, roast result). Já temos o banco Postgres com Drizzle ORM configurado (`src/db/`). Precisamos de uma camada de API typesafe para conectar o frontend ao banco. Como é um projeto full-stack Next.js, queremos evitar REST/GraphQL e usar **tRPC** para ter tipagem end-to-end sem code generation.

---

## Alternativas avaliadas

### Opção A: Server Actions diretas (sem camada de API)

- Usar `"use server"` para mutations e server components para queries
- Zero dependências extras
- Sem cache layer, sem retry, sem loading states padronizados
- Difícil de reutilizar lógica entre server components e client components
- Sem batching de requests

### Opção B: Route Handlers (REST-like)

- `app/api/roast/route.ts`, `app/api/leaderboard/route.ts` etc.
- Familiar, mas sem tipagem end-to-end
- Requer validação manual de input/output ou lib extra (zod + types manuais)
- Sem integração nativa com React Query

### Opção C: tRPC + TanStack React Query ⭐ Recomendada

- Tipagem end-to-end automática (router → client, zero code generation)
- Integração oficial com React Server Components (prefetch no server, hydrate no client)
- TanStack React Query embutido: cache, staleTime, retry, mutations com optimistic updates
- Validação de input com Zod (já temos no projeto)
- Batching de requests via `httpBatchLink`
- Comunidade ativa, docs atualizados para Next.js App Router

### Opção D: Server Actions + TanStack React Query

- Combina server actions com React Query para cache/state
- Funciona, mas é um padrão não-convencional e requer wrappers manuais
- Perde batching e tipagem automática de rotas

---

## Decisão: Opção C (tRPC + TanStack React Query)

Seguindo a doc oficial de RSC do tRPC v11. Usa `createTRPCOptionsProxy` para prefetch em server components e `createTRPCContext` + `useTRPC` para client components.

---

## Especificação de implementação

### Dependências

```
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query server-only client-only
```

> `zod` já está instalado. `server-only` e `client-only` garantem que imports não vazem entre ambientes.

### Estrutura de arquivos

```
src/
└── trpc/
    ├── init.ts            # initTRPC, procedure base, createTRPCContext
    ├── routers/
    │   ├── _app.ts        # appRouter (merge de todos os routers)
    │   ├── roast.ts       # procedures de roast (create, getById)
    │   └── leaderboard.ts # procedures de leaderboard (getTop, getStats)
    ├── query-client.ts    # factory do QueryClient compartilhado
    ├── client.tsx         # TRPCProvider + useTRPC (client components)
    └── server.ts          # trpc proxy + prefetch + HydrateClient (server components)
```

### 1. Backend — `src/trpc/init.ts`

```ts
import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { db } from "@/db";

export const createTRPCContext = cache(async () => {
  return { db };
});

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

- Sem autenticação (app é anônimo) — apenas `publicProcedure`
- Contexto injetado com `db` do Drizzle
- `cache()` do React garante um único contexto por request

### 2. Routers

#### `src/trpc/routers/roast.ts`

| Procedure         | Tipo     | Input                    | Retorno                       |
| ----------------- | -------- | ------------------------ | ----------------------------- |
| `roast.getById`   | `query`  | `{ id: string }` (uuid) | `Roast & { issues: Issue[] }` |
| `roast.create`    | `mutation`| código, language, brutalMode | `{ id: string }` (uuid criado) |

#### `src/trpc/routers/leaderboard.ts`

| Procedure              | Tipo    | Input                        | Retorno                          |
| ---------------------- | ------- | ---------------------------- | -------------------------------- |
| `leaderboard.getTop`   | `query` | `{ limit?: number }` (default 10) | `Roast[]` ordenado por score ASC |
| `leaderboard.getStats` | `query` | nenhum                       | `Stats` (total roasts, avg score)|

#### `src/trpc/routers/_app.ts`

```ts
import { router } from "../init";
import { roastRouter } from "./roast";
import { leaderboardRouter } from "./leaderboard";

export const appRouter = router({
  roast: roastRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
```

### 3. Query Client — `src/trpc/query-client.ts`

```ts
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}
```

- `staleTime: 30s` evita refetch imediato no client após SSR
- `shouldDehydrateQuery` inclui queries pending para streaming de promises

### 4. Client — `src/trpc/client.tsx`

- `"use client"` no topo
- Exporta `TRPCProvider` e `useTRPC` via `createTRPCContext<AppRouter>()`
- `TRPCReactProvider` wraps `QueryClientProvider` + `TRPCProvider`
- Usa `httpBatchLink` apontando para `/api/trpc`
- URL resolve dinâmico: `VERCEL_URL` em prod, `localhost:3000` em dev

### 5. Server — `src/trpc/server.ts`

- `import "server-only"`
- Exporta `trpc` via `createTRPCOptionsProxy` com `router` + `ctx` diretamente (sem HTTP, chamada direta)
- Exporta `getQueryClient` com `cache(makeQueryClient)` para estabilidade por request
- Exporta helpers `prefetch()` e `HydrateClient` para uso nas pages

### 6. API Route — `src/app/api/trpc/[trpc]/route.ts`

Route handler do Next.js que expõe o tRPC via HTTP para client components:

```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 7. Integração no Layout — `src/app/layout.tsx`

Envolver `{children}` com `TRPCReactProvider`:

```tsx
import { TRPCReactProvider } from "@/trpc/client";

// dentro do body:
<TRPCReactProvider>
  <Navbar />
  {children}
</TRPCReactProvider>
```

### 8. Uso nas pages

#### Server Component (prefetch + hydrate)

```tsx
// src/app/leaderboard/page.tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { LeaderboardClient } from "./leaderboard-client";

export default async function LeaderboardPage() {
  prefetch(trpc.leaderboard.getTop.queryOptions({ limit: 10 }));
  prefetch(trpc.leaderboard.getStats.queryOptions());

  return (
    <HydrateClient>
      <LeaderboardClient />
    </HydrateClient>
  );
}
```

#### Client Component (consume)

```tsx
// src/app/leaderboard/leaderboard-client.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function LeaderboardClient() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.leaderboard.getTop.queryOptions({ limit: 10 }));
  // ...
}
```

---

## Decisões

1. **Chamada direta no server** — `createTRPCOptionsProxy` com `router` + `ctx` (sem HTTP roundtrip). Client components usam `/api/trpc` via `httpBatchLink`.
2. **Sem autenticação** — app é anônimo, apenas `publicProcedure`.
3. **Sem data transformer** — não usamos superjson. Datas vêm como strings do banco e serão tratadas no frontend.
4. **`staleTime: 30s`** — padrão para todas as queries. Ajustar por procedure se necessário.
5. **Namespace `src/trpc/`** — separado de `src/db/` para manter responsabilidades claras.
6. **`server-only` / `client-only`** — imports guard para prevenir vazamento de código entre ambientes.
7. **Routers por domínio** — `roast` e `leaderboard` como sub-routers do `appRouter`.

---

## To-dos

### 1. Dependências

- [ ] Instalar `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `server-only`, `client-only`

### 2. Infraestrutura tRPC

- [ ] Criar `src/trpc/init.ts` com `initTRPC`, `createTRPCContext`, `router`, `publicProcedure`
- [ ] Criar `src/trpc/query-client.ts` com factory do `QueryClient`
- [ ] Criar `src/trpc/client.tsx` com `TRPCProvider`, `useTRPC`, `TRPCReactProvider`
- [ ] Criar `src/trpc/server.ts` com `trpc` proxy, `getQueryClient`, `prefetch`, `HydrateClient`
- [ ] Criar `src/app/api/trpc/[trpc]/route.ts` (fetch adapter)

### 3. Routers

- [ ] Criar `src/trpc/routers/_app.ts` com `appRouter`
- [ ] Criar `src/trpc/routers/roast.ts` com `getById` e `create`
- [ ] Criar `src/trpc/routers/leaderboard.ts` com `getTop` e `getStats`

### 4. Integração

- [ ] Envolver layout com `TRPCReactProvider`
- [ ] Migrar `src/app/leaderboard/page.tsx` de dados mock para prefetch tRPC
- [ ] Migrar `src/app/roast/[id]/page.tsx` de dados mock para prefetch tRPC
- [ ] Migrar `src/app/page.tsx` (leaderboard preview + stats) para tRPC
