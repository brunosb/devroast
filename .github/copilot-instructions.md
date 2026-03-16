# DevRoast — Copilot Instructions

## Projeto

App web que faz "roast" (avaliação brutal e bem-humorada) de código colado pelo usuário usando IA, com score de 0 a 10 e leaderboard de vergonha.

- **Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS v4, Biome 2
- **API/Backend**: tRPC v11 + TanStack React Query + Zod
- **Banco**: Drizzle ORM + PostgreSQL (Docker Compose)
- **Estrutura**: `src/` directory — pages em `src/app/`, componentes UI em `src/components/ui/`, tRPC em `src/trpc/`, banco em `src/db/`

## Padrões

- **Named exports** sempre, nunca default (exceto pages do Next.js)
- **Composição > props**: componentes complexos usam sub-componentes (`CardRoot`, `CardTitle`, etc.) ao invés de muitas props
- **tailwind-variants** (`tv`) para variantes; `className` passado direto na chamada `tv()`, não via `twMerge`
- **tailwind-merge** para merge de className em componentes sem `tv`
- **Cores semânticas** do tema (`bg-primary`, `text-foreground`, `border-border`), nunca hex fixo para cores do tema
- **`font-mono`** (JetBrains Mono) para UI terminal-style; `font-sans` é global no body
- **`enabled:hover:`** em botões para não aplicar hover no estado disabled
- **Biome** para lint e format (2-space indent); imports organizados automaticamente
- **Conventional Commits** para mensagens de commit
- **Server Components por padrão**; extrair partes `"use client"` para arquivos separados
- **`server-only`** e **`client-only`** para garantir isolamento de ambiente
- **`@number-flow/react`** para números animados — usar guard de montagem (`mounted` state) para evitar hydration mismatch
