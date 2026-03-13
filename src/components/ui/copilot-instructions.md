# UI Components — Padrões de Criação

## Estrutura

- Cada componente UI fica em `src/components/ui/<nome>.tsx`
- Sempre usar **named exports**, nunca default exports
- Exportar: o componente, as variants, e o tipo das props

## Estilização

- Usar **Tailwind CSS** para todas as classes
- Usar **tailwind-variants** (`tv`) para definir variantes do componente
- O `className` externo deve ser passado como propriedade da chamada `tv()`, junto com `variant` e `size` — o `tailwind-variants` faz o merge automaticamente. **Não usar `twMerge` manualmente.**

```tsx
// ✅ Correto — className como prop da variant
className={buttonVariants({ variant, size, className })}

// ❌ Errado — twMerge manual
className={twMerge(buttonVariants({ variant, size }), className)}
```

## Tipagem

- Extender as propriedades nativas do elemento HTML com `ComponentProps<"elemento">`
- Combinar com `VariantProps<typeof componentVariants>` para incluir as variantes no tipo

```tsx
type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;
```

## Fontes

- **Não usar** classes `font-primary` ou `font-secondary` — usar as utilitárias padrão do Tailwind
- `font-sans` → fonte padrão do sistema (ui-sans-serif, system-ui, sans-serif) — usada no body via layout
- `font-mono` → JetBrains Mono (configurada no `globals.css` via `@theme { --font-mono }`)
- O body já aplica `font-sans antialiased` globalmente, então texto normal não precisa de classe de fonte

## Classes Tailwind Canônicas

- Sempre usar a forma canônica das classes Tailwind. Exemplos:
  - ✅ `text-white` em vez de ❌ `text-(--color-white)`
  - ✅ `text-black` em vez de ❌ `text-(--color-black)`
  - ✅ `bg-transparent` em vez de ❌ `bg-(--color-transparent)`
- **Nunca usar valores hex fixos para cores do tema.** Usar as utilitárias semânticas do tema definidas no `globals.css`:
  - `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-foreground`, `border-border`, etc.
- Usar valores hex arbitrários (`text-[#...]`) apenas para cores que não existem no tema

## Cores do Tema (utilitárias Tailwind)

Todas definidas em `globals.css` via `@theme` + `@layer base`, com suporte a light/dark:

| Utilitária Tailwind      | Light     | Dark      | Uso                     |
| ------------------------ | --------- | --------- | ----------------------- |
| `background`             | `#F2F3F0` | `#0A0A0A` | Fundo da página         |
| `foreground`             | `#111111` | `#FAFAFA` | Texto principal         |
| `primary`                | `#FF8400` | `#FF8400` | Ações principais        |
| `primary-foreground`     | `#111111` | `#111111` | Texto sobre primary     |
| `secondary`              | `#E7E8E5` | `#2E2E2E` | Ações secundárias       |
| `secondary-foreground`   | `#111111` | `#FFFFFF` | Texto sobre secondary   |
| `accent`                 | `#F2F3F0` | `#10B981` | Destaques               |
| `accent-foreground`      | `#111111` | `#0A0A0A` | Texto sobre accent      |
| `destructive`            | `#D93C15` | `#FF5C33` | Ações destrutivas       |
| `destructive-foreground` | `#FFFFFF` | `#111111` | Texto sobre destructive |
| `muted`                  | `#F2F3F0` | `#2E2E2E` | Fundos atenuados        |
| `muted-foreground`       | `#666666` | `#B8B9B6` | Texto atenuado          |
| `border`                 | `#CBCCC9` | `#2E2E2E` | Bordas                  |
| `input`                  | `#CBCCC9` | `#2E2E2E` | Bordas de input         |
| `ring`                   | `#666666` | `#666666` | Focus ring              |
| `card`                   | `#FFFFFF` | `#1A1A1A` | Fundo de cards          |
| `card-foreground`        | `#111111` | `#FFFFFF` | Texto em cards          |

Exemplos de uso:

```tsx
// ✅ Correto — usar utilitárias semânticas do tema
"bg-primary text-primary-foreground";
"bg-secondary text-secondary-foreground";
"border border-border";
"text-muted-foreground";

// ❌ Errado — hex fixos para cores do tema
"bg-[#FF8400] text-[#111111]";
"border-[#2A2A2A]";
```
