# Drizzle ORM + Postgres — Spec

## Contexto

O DevRoast precisa persistir dados de roasts submetidos e alimentar o shame leaderboard. Atualmente tudo é estático/mock. Esta spec define o schema do banco, enums, e o plano de implantação usando **Drizzle ORM** com **PostgreSQL** via **Docker Compose**.

---

## Stack de dados

| Camada         | Tecnologia                        |
| -------------- | --------------------------------- |
| ORM            | Drizzle ORM (`drizzle-orm`)       |
| Driver         | `postgres` (postgres.js)          |
| Migrations     | Drizzle Kit (`drizzle-kit`)       |
| Banco          | PostgreSQL 17 (Docker Compose)    |
| Validação      | Zod (inferência de tipos Drizzle) |

---

## Enums (PostgreSQL native)

### `severity`

Usado nos issue cards da análise. Mapeado ao componente `Badge`.

| Valor      | Cor no design        |
| ---------- | -------------------- |
| `critical` | `$accent-red`        |
| `warning`  | `$accent-amber`      |
| `good`     | `$accent-green`      |

### `verdict`

Veredito geral do roast, exibido como badge no Score Hero.

| Valor                | Faixa de score |
| -------------------- | -------------- |
| `disaster`           | 0 – 1.9        |
| `needs_serious_help` | 2.0 – 3.9      |
| `not_great`          | 4.0 – 5.9      |
| `acceptable`         | 6.0 – 7.9      |
| `clean_code`         | 8.0 – 10       |

---

## Tabelas

### `roasts`

Tabela principal — cada submissão de código para roast.

| Coluna        | Tipo                     | Descrição                                                     |
| ------------- | ------------------------ | ------------------------------------------------------------- |
| `id`          | `uuid` PK (gen random)   | Identificador único do roast                                  |
| `code`        | `text` NOT NULL          | Código fonte submetido pelo usuário                           |
| `language`    | `varchar(50)` NOT NULL   | Linguagem detectada ou selecionada (ex: `javascript`, `python`) |
| `line_count`  | `integer` NOT NULL       | Quantidade de linhas do código submetido                      |
| `brutal_mode` | `boolean` NOT NULL       | Se o modo brutal estava ativado                               |
| `score`       | `real` NOT NULL          | Nota de 0.0 a 10.0                                           |
| `verdict`     | `verdict` enum NOT NULL  | Veredito geral baseado no score                               |
| `roast_text`  | `text` NOT NULL          | Frase de roast gerada pela IA (exibida como quote)            |
| `diff`        | `text`                   | Diff unificado sugerido pela IA (pode ser null se não houver) |
| `created_at`  | `timestamp` DEFAULT now  | Data de criação                                               |

**Dados derivados do design:**
- `score` → `ScoreRing` (Screen 2), coluna "score" do leaderboard (Screen 3)
- `verdict` → `Badge` com texto como "needs_serious_help" (Screen 2)
- `roast_text` → Quote no Score Hero (Screen 2), quote no OG Image (Screen 4)
- `language` + `line_count` → meta info no roast (ex: "lang: javascript · 7 lines")
- `code` → Code Preview (Screen 2), Code Block nos entries do leaderboard (Screen 3)
- `diff` → Diff Section com `DiffLine` (Screen 2)

### `issues`

Issues individuais encontrados no código — exibidos como cards na Analysis Section.

| Coluna        | Tipo                      | Descrição                                                  |
| ------------- | ------------------------- | ---------------------------------------------------------- |
| `id`          | `uuid` PK (gen random)    | Identificador único do issue                               |
| `roast_id`    | `uuid` FK → `roasts.id`   | Referência ao roast pai                                    |
| `severity`    | `severity` enum NOT NULL  | Severidade: `critical`, `warning`, `good`                  |
| `title`       | `varchar(200)` NOT NULL   | Título curto do issue (ex: "using var instead of const/let") |
| `description` | `text` NOT NULL           | Explicação detalhada do problema                            |

**Dados derivados do design:**
- `severity` → dot colorido + label no `AnalysisCard` header
- `title` → `AnalysisCardTitle`
- `description` → `AnalysisCardDescription`
- Grid de 2 colunas, até 4+ cards por roast

---

## Relacionamentos

```
roasts (1) ──────< (N) issues
```

- Um roast tem **muitos** issues (ON DELETE CASCADE)
- Issues não existem sem roast

### `stats`

Tabela singleton para cache de estatísticas globais (footer: "2,847 codes roasted · avg score: 4.2/10").

| Coluna        | Tipo                     | Descrição                              |
| ------------- | ------------------------ | -------------------------------------- |
| `id`          | `integer` PK DEFAULT 1   | Sempre 1 (singleton)                   |
| `total_roasts`| `integer` NOT NULL DEFAULT 0 | Total de roasts submetidos          |
| `avg_score`   | `real` NOT NULL DEFAULT 0 | Score médio geral                      |
| `updated_at`  | `timestamp` DEFAULT now  | Última atualização dos stats           |

> Atualizada via trigger ou na própria server action ao criar um roast.

---

## Índices

Nenhum índice extra criado. PKs já são indexados automaticamente. Índices em FKs e outras colunas serão criados sob demanda se necessário por performance.

---

## Docker Compose

Arquivo `docker-compose.yml` na raiz do projeto:

- **Serviço**: `postgres`
- **Imagem**: `postgres:17-alpine`
- **Porta**: `5432:5432`
- **Volume**: `devroast_pgdata` (persistência)
- **Variáveis de ambiente**: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` configurados via `.env`

### Variáveis de ambiente (`.env`)

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
POSTGRES_USER=devroast
POSTGRES_PASSWORD=devroast
POSTGRES_DB=devroast
```

> `.env` deve estar no `.gitignore`. Criar `.env.example` como template.

---

## Estrutura de arquivos

```
devroast/
├── docker-compose.yml
├── drizzle.config.ts              # Config do Drizzle Kit
├── .env                           # Vars locais (gitignored)
├── .env.example                   # Template
└── src/
    └── db/
        ├── index.ts               # Conexão + export do db client
        ├── schema.ts              # Enums + tabelas (Drizzle schema)
        └── migrations/            # Geradas pelo drizzle-kit
```

---

## To-dos de implantação

### 1. Infraestrutura

- [ ] Criar `docker-compose.yml` com serviço Postgres 17
- [ ] Criar `.env` e `.env.example` com `DATABASE_URL` e variáveis do Postgres
- [ ] Adicionar `.env` ao `.gitignore` (se não estiver)

### 2. Dependências

- [ ] Instalar `drizzle-orm` e `postgres` (driver)
- [ ] Instalar `drizzle-kit` como devDependency
- [ ] Instalar `zod` para validação e inferência de tipos

### 3. Configuração do Drizzle

- [ ] Criar `drizzle.config.ts` apontando para `src/db/schema.ts` e `src/db/migrations`
- [ ] Criar `src/db/index.ts` com conexão usando `postgres` driver e export do `db`
- [ ] Adicionar scripts no `package.json`:
  - `db:generate` → `drizzle-kit generate`
  - `db:migrate` → `drizzle-kit migrate`
  - `db:studio` → `drizzle-kit studio`

### 4. Schema

- [ ] Criar `src/db/schema.ts` com:
  - Enum `severity` (`critical`, `warning`, `good`)
  - Enum `verdict` (`disaster`, `needs_serious_help`, `not_great`, `acceptable`, `clean_code`)
  - Tabela `roasts` com todas as colunas definidas acima
  - Tabela `issues` com FK para `roasts` e ON DELETE CASCADE
  - Sem Drizzle relations (queries com joins SQL)
  - Exports de tipos inferidos (`Roast`, `NewRoast`, `Issue`, `NewIssue`)
  - Tabela `stats` (singleton) com `total_roasts` e `avg_score`

### 5. Migrations & validação

- [ ] Subir Postgres com `docker compose up -d`
- [ ] Rodar `npm run db:generate` para gerar a migration inicial
- [ ] Rodar `npm run db:migrate` para aplicar
- [ ] Validar no `drizzle-kit studio` que tabelas e enums foram criados

---

## Decisões

1. **Leaderboard anônimo** — sem campo de autor. Entries não exibem nome.
2. **UUID na URL** — sem slug. URLs de share serão `/roast/{uuid}`.
3. **Sem rate limiting no banco** — não será necessário tabela/campo para isso.
4. **Tabela de stats separada** — `stats` com contadores pré-calculados (total de roasts, score médio) para evitar queries agregadas a cada request.
5. **`casing: 'snake_case'`** — configurado tanto no `drizzle.config.ts` quanto no `drizzle()` client. Schema usa camelCase no TS, mapeado automaticamente para snake_case no banco.
6. **Sem Drizzle relations** — queries usam joins SQL explícitos via `db.select()` + `innerJoin`/`leftJoin`, sem `db.query`.
7. **Índices mínimos** — sem índices extras além dos PKs automáticos. Criar sob demanda.
