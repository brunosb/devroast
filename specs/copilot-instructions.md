# Specs — Formato

Specs são documentos de planejamento criados **antes** da implementação de uma feature.
Arquivo: `specs/<nome-da-feature>.md`

## Estrutura

```markdown
# Título da Feature — Spec

## Contexto
Por que essa feature existe, qual problema resolve, estado atual.

## Pesquisa (opcional)
Análise de como outros projetos resolvem o mesmo problema.

## Alternativas avaliadas
Opções consideradas com prós/contras. Marcar a recomendada com ⭐.

## Decisão
Qual alternativa foi escolhida e justificativa breve.

## Especificação de implementação
Detalhes técnicos: componentes, estrutura visual (ASCII), fluxo,
props/API, tabelas, relacionamentos — o que for relevante.

## Decisões
Lista de decisões-chave tomadas durante o planejamento (numerada).

## To-dos
Checklist de implementação agrupado por fase ([ ] para cada item).
```

## Regras

- Escrever em **português**
- Ser objetivo — incluir só seções relevantes para a feature
- Referenciar componentes e arquivos existentes do projeto quando aplicável
- Relacionar dados do schema com componentes de UI quando houver mapeamento
- To-dos devem ser acionáveis e específicos, não genéricos
