# Alucinações Detectadas — 2026-08-15_iniciar

## Registro 1: Stack declarada não verificada
- **Agente / Fonte**: `AGENTS.md` (contexto histórico)
- **Tipo**: Inferência não validada / possível informação defasada
- **Descrição**: O documento declara stack React 18 + Vite + Tailwind, Node 24 + Express 4.21 + Sequelize 6, PostgreSQL + pg. Na raiz do projeto não foram encontrados `package.json`, `vite.config.js`, `src/`, `server/`, `migrations/` ou arquivos típicos dessa stack. A estrutura observada contém apenas `.opencode/`, `AGENTS.md` e `docs/` com arquivos numerados sobre terminal/eros.
- **Severidade**: 🟠 Média-Alta
- **Impacto**: Pode induzir agentes de implementação a gerar código na stack errada.
- **Ação recomendada**: Executar `detectar-stack` e atualizar `AGENTS.md` com tecnologias reais.

## Registro 2: Expectativa de contexto salvo
- **Agente / Fonte**: skill `ler-contexto-projeto`
- **Tipo**: Presunção de estado
- **Descrição**: A skill pressupõe existência de `.opencode/context/project-summary.md`, `current-tasks.md`, `decisions-log.md`, `progress.md` e `/docs/management/*`. Todos estão ausentes.
- **Severidade**: 🟡 Média
- **Impacto**: O resumo e as sugestões de próximos passos ficam sem base.
- **Ação recomendada**: Criar arquivos de contexto vivos antes de próxima inicialização.

## Resumo
- Total de alucinações / inferências não verificadas: **2**
- Críticas: **0**
- Altas: **1**
- Médias: **1**
