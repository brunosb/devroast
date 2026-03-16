# tRPC — Padrões

## Stack

- **tRPC v11** + **TanStack React Query** + **Zod** para validação
- Pacotes: `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`

## Estrutura de arquivos

```
src/trpc/
├── init.ts              # initTRPC, context, exports de router e publicProcedure
├── client.tsx           # "use client" — TRPCProvider, useTRPC, TRPCReactProvider
├── server.tsx           # "server-only" — proxy para server components (trpc, prefetch, HydrateClient)
├── query-client.ts      # factory do QueryClient (staleTime, dehydrate config)
└── routers/
    ├── _app.ts          # root router (mergeRouters)
    └── <dominio>.ts     # um router por domínio (leaderboard, roast, etc.)
```

## Regras

### Inicialização (`init.ts`)

- `createTRPCContext` usa `cache()` do React para singleton por request
- Context injeta `db` (Drizzle) — sem auth (app anônimo)
- Exportar apenas `router` e `publicProcedure`

### Client (`client.tsx`)

- Arquivo `"use client"` — contém o provider React e o hook `useTRPC`
- `httpBatchLink` apontando para `/api/trpc`
- URL dinâmica: `VERCEL_URL` em produção, `localhost:3000` em dev
- `TRPCReactProvider` envolve o app no layout root (`src/app/layout.tsx`)

### Server (`server.tsx`)

- Arquivo `.tsx` (contém JSX: `HydrationBoundary`) — **não usar `.ts`**
- `import "server-only"` para garantir que não vaza para o client bundle
- Usa `createTRPCOptionsProxy` com chamada direta ao router (sem HTTP)
- Exporta `trpc`, `prefetch`, `HydrateClient`, `getQueryClient`

### Routers (`routers/`)

- Um arquivo por domínio: `leaderboard.ts`, `roast.ts`, etc.
- Root router em `_app.ts` faz merge de todos os sub-routers
- Tipo `AppRouter` exportado de `_app.ts` para inferência no client

### API Route

- `src/app/api/trpc/[trpc]/route.ts` — usa `fetchRequestHandler`
- Apenas para client components; server components chamam o router direto

## Padrão de uso em Server Components

```tsx
// src/app/alguma-page.tsx (server component)
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Page() {
  prefetch(trpc.dominio.query.queryOptions());

  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

## Padrão de uso em Client Components

```tsx
// componente.tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Componente() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.dominio.query.queryOptions());
  // ...
}
```

## Quando NÃO usar prefetch

- Quando o dado deve animar de 0 ao valor real com `NumberFlow` — prefetch popula o cache no servidor, causando hydration mismatch
- Nesse caso, usar `useQuery` (sem Suspense) e deixar o valor iniciar em 0 no client
