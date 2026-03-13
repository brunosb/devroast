# Editor com Syntax Highlight — Spec

## Contexto

Atualmente a homepage tem um `<textarea>` simples para o usuário colar código. Queremos transformá-lo em um editor com syntax highlighting em tempo real, auto-detecção de linguagem, e opção de seleção manual.

---

## Pesquisa: como o ray-so faz

O [ray-so](https://github.com/raycast/ray-so) usa a técnica **textarea overlay**:

1. Um `<textarea>` transparente fica por cima (z-index: 2) de um `<div>` com o código highlighted
2. O textarea tem `-webkit-text-fill-color: transparent` (texto invisível) e `caret-color` visível (cursor aparece)
3. Ambos ocupam a mesma grid cell (`grid-area: 1 / 1 / 2 / 2`) com font/padding/line-height idênticos
4. O highlight é feito com **shiki** (client-side, usando WASM) — `codeToHtml()` gera HTML com spans coloridos
5. O HTML highlighted é inserido via `dangerouslySetInnerHTML`
6. Linguagens carregadas lazy via dynamic import (`() => import("shiki/langs/xxx.mjs")`)
7. **Não tem auto-detecção** — o usuário seleciona a linguagem via dropdown

### Pontos positivos

- Experiência fluida: o usuário digita/cola normalmente no textarea
- Cursor e seleção nativos do browser (sem reimplementar)
- Leve comparado a CodeMirror/Monaco

### Pontos negativos

- Sincronizar scroll entre textarea e div highlighted pode dar edge cases
- `-webkit-text-fill-color` não é standard (mas funciona em todos browsers modernos)

---

## Alternativas avaliadas

### Opção A: Textarea Overlay + Shiki (abordagem ray-so) ⭐ Recomendada

- **Já temos shiki** no projeto (usado no `CodeBlock`)
- Leve, sem dependências extras pesadas
- Perfeito para o caso de uso: o usuário **cola** código, não precisa de autocompletar ou LSP
- Shiki usa grammars TextMate (mesmas do VS Code), qualidade superior de highlight

### Opção B: highlight.js

- Tem `highlightAuto()` com auto-detecção de linguagem built-in
- Mais leve que shiki para bundle initial
- Qualidade de highlight inferior ao shiki (regex-based vs TextMate grammars)
- Teria que adicionar outra dependência duplicando funcionalidade do shiki que já temos
- Possível usar **apenas para auto-detecção** e shiki para o highlight em si

### Opção C: CodeMirror 6

- Editor completo com undo/redo, seleção, keybindings etc.
- Overkill para nosso caso (só colar código, não editar extensivamente)
- Bundle significativamente maior (~150KB+)
- Mais complexo de integrar e estilizar com nosso tema

### Opção D: Monaco Editor

- Basicamente o VS Code no browser
- Extremamente pesado (~2MB+)
- Totalmente overkill para paste-and-roast

---

## Decisão: Opção A (Textarea Overlay + Shiki)

Mesma abordagem do ray-so. Já temos shiki e o tema vesper configurado.

### Auto-detecção de linguagem

O shiki não tem auto-detecção built-in. Opções para resolver:

1. **highlight.js apenas para detecção** — usar `highlightAuto()` do highlight.js só para descobrir a linguagem, e shiki para renderizar. Adiciona ~35KB (common subset), mas a detecção é boa.
2. **Heurísticas simples** — regex patterns para detectar linguagens comuns (ex: `import/export` → JS/TS, `def/class:` → Python, `func/package` → Go). Leve mas limitado.
3. **Sem auto-detecção** — só seleção manual (como ray-so faz). Mais simples mas pior UX para nosso caso.

**Decisão**: usar highlight.js apenas para detecção (`highlightAuto`) + shiki para render.

---

## Especificação de implementação

### Componente: `CodeEditor`

- **Localização**: `src/components/code-editor.tsx`
- **Tipo**: Client component (`"use client"`)
- **Composição**: seguir pattern de sub-componentes (`CodeEditorRoot`, `CodeEditorHeader`, `CodeEditorContent`)

### Estrutura visual

```
┌─────────────────────────────────────────────┐
│ 🔴 🟡 🟢   [language selector ▾]           │  ← Header (traffic lights + dropdown)
├─────────────────────────────────────────────┤
│                                             │
│  <textarea> (invisível, z-index: 2)         │  ← Overlay: input real do usuário
│  <div> (highlighted code, z-index: 1)       │  ← Render: HTML do shiki
│                                             │
└─────────────────────────────────────────────┘
```

### Fluxo

1. Usuário cola/digita texto no `<textarea>`
2. `onChange` atualiza o state `code`
3. **Auto-detecção** roda (debounced, ~300ms) e atualiza `detectedLanguage`
4. Shiki gera HTML highlighted com a linguagem detectada (ou selecionada manualmente)
5. O HTML é renderizado no `<div>` overlay abaixo do textarea
6. Se o usuário selecionar linguagem manualmente no dropdown, trava a auto-detecção

### Linguagens suportadas (subset inicial)

JavaScript, TypeScript, Python, Java, Go, Rust, C, C++, C#, Ruby, PHP, Swift, Kotlin, SQL, HTML, CSS, JSON, YAML, Bash, Markdown

### Props / API

```tsx
type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;             // linguagem forçada (desabilita auto-detect)
  onLanguageChange?: (lang: string) => void;
  placeholder?: string;
  className?: string;
};
```

---

## Decisões confirmadas

- **Auto-detecção**: highlight.js `highlightAuto()` para detectar a linguagem, shiki para renderizar
- **Linguagens**: subset de ~20 linguagens confirmado como suficiente
- **Limites**: sem limite de linhas ou caracteres
- **Indentação**: Tab insere espaços (2 espaços, consistente com Biome config)
- **Nome do arquivo no header**: dinâmico conforme a linguagem detectada (ex: `paste_here.py`, `paste_here.go`)

## To-dos

- [ ] Definir se o shiki highlighter deve ser inicializado uma única vez (singleton/context) ou por instância do editor
- [ ] Definir subset de linguagens para carregar eager vs lazy
- [ ] Implementar componente `CodeEditor` com textarea overlay
- [ ] Implementar dropdown de seleção manual de linguagem no header
- [ ] Implementar auto-detecção de linguagem (highlight.js `highlightAuto`)
- [ ] Suporte a Tab para indentação (insere 2 espaços)
- [ ] Integrar na homepage substituindo o textarea atual
- [ ] Testar sincronização de scroll textarea ↔ div highlighted


