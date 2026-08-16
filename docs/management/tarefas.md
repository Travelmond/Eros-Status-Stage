# ✅ Checklist de Tarefas — Eros Status Terminal (ESS) v3.0

## Tarefas Concluídas
- [x] Manifesto de intenção criado — @agente-de-intencao — 2026-08-15
- [x] Pesquisa oficial do Chub Venus AI consolidada — @pesquisador — 2026-08-15
- [x] Levantamento completo da documentação local `/docs` — @planejador-primario — 2026-08-15
- [x] Definição de escopo, stack, persistência, configurações e deploy — @planejador-primario — 2026-08-15
- [x] Plano executivo e estrutura de pastas finalizados — @planejador-primario — 2026-08-15
- [x] Contratos de execução JSON gerados — @tradutor-tiers — 2026-08-15
  - Contrato `T01` — UI/UX e Frontend: `/docs/management/contratos/T01-ui-ux-frontend.json`
  - Contrato `T02` — Backend / Lógica de Stage: `/docs/management/contratos/T02-backend-logica-stage.json`
  - Contrato `T03` — Dados / Schemas / Metadata: `/docs/management/contratos/T03-dados-schemas-metadata.json`
  - Contrato `T04` — DevOps / Deploy / Git: `/docs/management/contratos/T04-devops-deploy-git.json`
  - Diagrama de dependências: `/docs/management/contratos/dependencias.md`
- [x] T03 — Dados / Schemas / Metadata implementado — @arquiteto-banco-de-dados — 2026-08-15
  - Arquivos criados: `src/types/chub.ts`, `src/types/eros-status.ts`, `src/types/config.ts`, `src/types/index.ts`, `src/core/state.ts`, `public/chub_meta.yaml`, `docs/architecture/state-mapping.md`
  - Estado mapeado para `messageState` (essencial), `chatState` (global/fog-of-war), `initState` (seed) e `localStorage` (apenas preferências)
  - API key do OpenRouter marcada como `secret: true` no `config_schema`
- [x] T02 — Backend / Lógica de Stage implementado — @arquiteto-backend — 2026-08-15
  - Arquivos criados: `src/core/parser.ts`, `src/core/middleware.ts`, `src/core/audit.ts`, `src/systems/memory.ts`, `src/systems/relationships.ts`, `src/systems/sexPositions.ts`, `src/services/openRouter.ts`, `src/services/characterState.ts`, `src/utils/index.ts`, `src/Stage.tsx`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/components/terminal/ErosTerminal.tsx` (stub), `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `eslint.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `README.md`, `components.json`
  - Parser 100% framework-agnostic; middleware integra auditoria/memória; StageBase implementado com tipagem correta
  - Estado crítico em `messageState`; fog-of-war/mapa/memória em `chatState`; API key nunca persistida

## Tarefas Concluídas
- [x] T02 — Backend / Lógica de Stage reconstituído e integrado — @arquiteto-backend — 2026-08-15
  - Arquivos criados/atualizados: `src/core/parser.ts`, `src/core/middleware.ts`, `src/core/audit.ts`, `src/systems/memory.ts`, `src/systems/relationships.ts`, `src/systems/sexPositions.ts`, `src/services/openRouter.ts`, `src/services/characterState.ts`, `src/utils/index.ts`, `src/Stage.tsx`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/components/terminal/ErosTerminal.tsx` (reconstruído), `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `eslint.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `README.md`, `components.json`
  - Parser 100% framework-agnostic; middleware integra auditoria, memória, fog-of-war e gating NTR; StageBase implementado com tipagem correta
  - Estado crítico em `messageState`; fog-of-war/mapa/memória em `chatState`; API key nunca persistida

## Tarefas Concluídas (esta rodada)
- [x] T01 — UI/UX e Frontend entregue — @arquiteto-ui-ux — 2026-08-15
  - Arquivos criados: `tailwind.config.js`, `postcss.config.js`, `components.json`, `src/index.css`, `src/utils/cn.ts`, `src/hooks/use-mobile.ts`, `src/utils/index.ts`
  - Componentes shadcn/ui stubs: button, card, badge, input, textarea, switch, slider, progress, tabs, scroll-area, separator, tooltip, select, toast/toaster/use-toast
  - Componentes do terminal: `ErosTerminal`, `TerminalHeader`, `TerminalFooter`, `CharacterPanel`, `EmotionPanel`, `ProgressionsPanel`, `StatusPanel`, `RelationshipPanel`, `InventoryPanel`, `LocationPanel`, `MiniMapPanel`, `NPCPanel`, `GoalsPanel`, `ModulesPanel`, `SexPanel`, `ReactionPanel`, `NTRPanel`, `BodyDescPanel`, `BodyDescCharPanel`, `ImagePromptPanel`, `RawOutputPanel`, `ConfigPanel`, `AIConfigPanel`, `AIProviderSection`, `AuditPanel`, `CorrectionAlert`, `NTRModal`, `ASCIIPositionViewer`, `NotificationToast`, `NeonProgressBar`
  - Entry points: `src/App.tsx` (TestRunner standalone), `src/main.tsx`
  - Design docs: `docs/design/wireframes.md`
  - Stubs de libs para compilação: `src/lib/erosParser.ts`, `src/lib/sexPositionsLibrary.ts`, `src/lib/relationshipSystem.ts`, `src/lib/consistencyAuditor.ts`, `src/lib/memoryService.ts`
- [x] T04 — DevOps / Deploy / Git executado — @devops — 2026-08-15
  - Build validado: `npm install`, `npm run typecheck`, `npm run lint`, `npm run build` passaram
  - Workflows criados: `.github/workflows/deploy-dev.yml`, `.github/workflows/deploy.yml`
  - Estratégia de branches configurada: `old`, `dev`, `main`
  - Documentação criada: `docs/deployment/github-actions.md`, `docs/deployment/branch-strategy.md`
  - `.gitignore` configurado
  - Correções de TypeScript/ESLint aplicadas para build limpo
  - Commit semântico realizado na branch `dev`
- [x] Revisão obrigatória — Iteração 1 — `equipe-revisao` — 2026-08-15
  - Status: REPROVADO (críticos e altos pendentes)
  - Relatório: `/docs/testing/revisao-2026-08-15_00-00.md`
- [x] Documentação de débito técnico e atualização de README/branch-strategy — @documentacao — 2026-08-15
  - Criado `docs/architecture/tech-debt.md` com análise da atualização `@chub-ai/stages-ts` e débitos M1/M7/M8
  - Atualizado `docs/deployment/branch-strategy.md` com estratégia `old`/`dev`/`main` e secrets obrigatórios
  - Atualizado `README.md` com instruções de instalação/execução, aviso de `localStorage` no iframe e ausência de testes
- [x] Revisão obrigatória — Iteração 2 — `equipe-revisao` — 2026-08-15
  - Status: REPROVADO (findings A4 e A6 altos; M9-M15 médios)
  - Relatório: `/docs/testing/revisao-2026-08-15_iteracao2.md`

## Tarefas em Andamento
- [ ] Correções pós-revisão — Iteração 2 → 3 — @arquiteto-geral — 2026-08-15
  - Prioridade alta: A4 (`@chub-ai/stages-ts ^0.4.0`) e A6 (extração real no `AIConfigPanel`).
  - Médios: M9-M15 conforme atribuições do relatório.
  - Relatório base: `/docs/testing/revisao-2026-08-15_iteracao2.md`
  - Status parcial (Juiz 2026-08-15): `package.json` atualizado para `^0.4.0`; `AIConfigPanel.tsx` reescrito para extração real; `ErosTerminal.tsx` ainda não propaga `config`/`onConfigChange` para `AIConfigPanel`; `tech-debt.md` desatualizado; M10/M12/M13/M14 pendentes; M9/M15 parciais; M11 resolvido. Ver `/docs/audit/2026-08-15_correcoes_iter3/`.

## Tarefas Concluídas
- [x] Adicionar suite de testes (C1) — @dev-backend — 2026-08-15
  - Scripts `test`/`test:watch`/`test:ui`/`coverage` adicionados ao `package.json`
  - `vitest`, `@vitest/ui`, `jsdom` adicionados como devDependencies
  - `vite.config.ts` configurado com globals/jsdom
  - Testes criados: `src/core/parser.test.ts`, `src/core/middleware.test.ts`, `src/core/audit.test.ts` (17 testes passando)
- [x] Remover persistência crítica em localStorage (C3) — @dev-backend — 2026-08-15
  - `Stage.tsx` reescrito: sem `saveCharacterCache`/`loadCharacterCache`, `runtimeConfig` + `onConfigChange`, `load()` retorna apenas estados recebidos
  - `characterState.ts`: funções de cache marcadas como `@deprecated`; adicionados `setPreference`/`getPreference` com debounce 300ms e `QuotaExceededError`
- [x] Resolver writes excessivos em localStorage (A5) — @dev-backend — 2026-08-15
  - Resolvido via `setPreference`/`getPreference` com debounce
- [x] Conectar toggles de NTR/auditor backend (A1, A2) — @dev-backend — 2026-08-15
  - `ErosTerminal.tsx` recebe `onConfigChange` e propaga `enableNTR`, `auditorEnabled`, `imgAuditorEnabled`
  - `App.tsx` mantém estado `config` e passa `onConfigChange={setConfig}`
- [x] Documentar débito técnico @chub-ai/stages-ts (A4) — @dev-backend — 2026-08-15
  - `docs/architecture/tech-debt.md` criado
- [x] Aplicar correções médias M4-M8 — @dev-backend — 2026-08-15
  - M4: `aiInstructions` tipado em `ErosStatusState` e retornado por `parser.ts`; removido `as unknown` em `ErosTerminal.tsx`
  - M5: `AbortController` com timeout 30s em `openRouter.ts`
  - M7: `onParse` do Stage documentado como reuso de `afterResponse` para TestRunner
  - M8: `memoryService.ts` documentado como adapter standalone sem persistência
- [x] Corrigir deploy dev vs main (C2) — @devops — 2026-08-15
  - `.github/workflows/deploy-dev.yml` usa `secrets.CHUB_EXTENSION_ID_DEV` com validação explícita
  - `.github/workflows/deploy.yml` mantém `CHUB_EXTENSION_ID: 'eros-status-stage-b47cccbfa255'`
  - `docs/deployment/github-actions.md` documenta `CHUB_AUTH_TOKEN` e `CHUB_EXTENSION_ID_DEV`
- [x] Adicionar required e metadados ao `chub_meta.yaml` (M6) — @devops — 2026-08-15
  - Adicionados `description` e `author` no topo do arquivo
  - Adicionada lista `required` em `state_schema.message` com os campos principais
- [x] Corrigir inline styles inválidos (A3) — @dev-frontend — 2026-08-15
  - Todos os padrões `var(--color)NN` em `src/**/*.tsx`, `src/**/*.ts`, `src/**/*.css` convertidos para `color-mix(in srgb, ...)`
  - Classes Tailwind arbitrárias com `color-mix` ajustadas para usar `_` no lugar de espaços
  - Validação: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` passaram
- [x] Conectar toggles de NTR/auditor no ConfigPanel UI (A1, A2 frontend) — @dev-frontend — 2026-08-15
  - `ErosTerminal.tsx` recebe `onConfigChange?: (patch: Partial<ConfigType>) => void`
  - Toggle NTR reflete `config?.enableNTR` e chama `onConfigChange({ enableNTR: ... })`
  - `ConfigPanel` recebe callbacks reais para `onToggleAuditor` e `onToggleImgAuditor`
  - `App.tsx` mantém estado `config` e passa `onConfigChange={setConfig}`
- [x] Corrigir cores hardcoded (M1) — @dev-frontend — 2026-08-15
  - Adicionadas variáveis em `src/index.css`: `--terminal-bg`, `--terminal-bg-deep`, `--terminal-card`, `--terminal-panel`, `--terminal-border`, `--terminal-text-*`
  - Componentes principais (`ErosTerminal`, `TerminalHeader`, `ProgressionsPanel`, `SexPanel`, `ImagePromptPanel`) e painéis secundários migrados para as variáveis
- [x] Corrigir teste de conexão OpenRouter simulado (M2) — @dev-frontend — 2026-08-15
  - `AIProviderSection.tsx` importa e chama `testOpenRouterConnection` de `src/services/openRouter.ts`
  - Estados `idle/testing/ok/error` refletem resultado real da chamada
- [x] Remover side-effect de `render()` no Stage (M7 complementar) — @dev-frontend — 2026-08-15
  - `Stage.tsx` não passa mais `onParse` para `ErosTerminal` no `render()`
  - `App.tsx` chama `parseErosStatusFromMessage` + `processIncomingState` diretamente no `handleParse`
- [x] Remover dependências não utilizadas (M13) — @devops — 2026-08-15
  - Dependências removidas do `package.json`: `recharts`, `date-fns`, `cmdk`, `vaul`, `sonner`, `zod`
  - Verificação em `src/` confirmou nenhuma importação direta ou indireta das libs removidas
  - `npm install` executado; `package-lock.json` atualizado (38 pacotes removidos)
  - Validação: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` passaram
  - Correções auxiliares para build limpo: importação de `deepClone` em `src/core/middleware.ts` e uso de `handleModelSelect` em `src/components/terminal/AIProviderSection.tsx`
- [x] Aplicar correções de frontend — Iteração 2 → 3 — @dev-frontend — 2026-08-15
  - **A6 — Extração real no AIConfigPanel**: `AIConfigPanel.tsx` chama `callOpenRouter` com prompt de extração, usa `extractJsonFromResponse`, parseia com `parseErosStatusFromMessage`, mostra loading/erro/sucesso via `toast`, e valida API key vazia.
  - **M10 — Sincronizar config OpenRouter**: `AIProviderSection.tsx`, `AIConfigPanel.tsx` e `ConfigPanel.tsx` propagam `openRouterModel`/`openRouterApiKey` via `onConfigChange`; campos inicializados a partir de `config`.
  - **M12 — Memória no chatState (UI)**: `ErosTerminal.tsx` recebe `onCondenseMemory`/`onClearMemory` e os repassa para `ConfigPanel`; `Stage.tsx` já conecta handlers ao `chatState`.
  - **M15 — Cores hardcoded residuais**: removidos `text-gray-*`, `text-cyan-400`, `bg-black/30`, `#e2e8f0` de `App.tsx`, `ErosTerminal.tsx`, `AIConfigPanel.tsx` e `index.css`; novas variáveis de gradiente neon (`--neon-*-soft`) adicionadas.
  - Correções auxiliares para testes limpos: `DOMException` no tratamento de timeout de `openRouter.ts`; imports de `enforceSexGate`/`enforceReactionGate` restaurados em `middleware.test.ts`.
  - Validação: `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` passaram (34 testes).
- [x] Aplicar correções de backend — Iteração 2 → 3 — @dev-backend — 2026-08-15
  - **A4 — Atualizar `@chub-ai/stages-ts`**: `package.json` atualizado para `^0.4.0`; `npm install` executado; build/typecheck sem regressões.
  - **M9 — Gating Sex/Reaction**: implementados `enforceSexGate` e `enforceReactionGate` em `src/core/middleware.ts` com flags `config.enableSexModule`/`config.enableReactionModule`.
  - **M11 — Persistir correctedIds/ignoredIds**: middleware preserva ids entre turnos; `Stage.tsx` e `App.tsx` atualizam `audit.correctedIds`/`ignoredIds` e marcam issues.
  - **M12 — Memória no chatState real (backend)**: `Stage.tsx` e `App.tsx` implementam `onCondenseMemory`/`onClearMemory` usando `chatState.longTermMemory`/`turnHistory`; `ConfigPanel` consome `chatState` diretamente.
  - **M14 — Expandir testes**: adicionado `src/services/openRouter.test.ts` e testes para gates sex/reaction e persistência de audit ids.
  - Validação: `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` passaram (34 testes).

## Tarefas Concluídas
- [x] Revisão obrigatória — Iteração 3/3 — `equipe-revisao` — 2026-08-15
  - Status: REPROVADO (findings C2, A3, M9, M12, M14, M1, M10, M13, M15)
  - Relatório: `/docs/testing/revisao-2026-08-15_iteracao3.md`
  - Ação: Tribunal convocado pelo Juiz

## Tarefas Concluídas
- [x] Tribunal — veredito sobre 3ª iteração — @juiz / `tribunal` — 2026-08-15
  - Veredito: **NECESSITA APELAÇÃO / CORREÇÕES OBRIGATÓRIAS**
  - Findings descartados (alucinações dos revisores): C2, A3, M15
  - Correções obrigatórias antes de merge: M9 (`@deprecated` em `src/lib/*.ts`), M12 (validação de schema em `Stage.load()`), M14 (`docs/testing/plano-de-testes.md`)
  - Ressalvas: M1, M10, M13, README
  - Relatório: `/docs/audit/2026-08-15_tribunal_iter3/`

## Tarefas Concluídas
- [x] Correções pós-Tribunal — @dev-backend + @documentacao — 2026-08-15
  - **M9**: `@deprecated` adicionado em `src/lib/erosParser.ts`, `src/lib/relationshipSystem.ts`, `src/lib/sexPositionsLibrary.ts`, `src/lib/consistencyAuditor.ts` e `src/lib/memoryService.ts`.
  - **M12**: validação de schema implementada em `Stage.load()`: verifica `schema_version === '3.0.0'` em `initState`, `chatState` e `messageState.meta`; estados incompatíveis são resetados para defaults com aviso no console; `enforceSchema` aplicado ao `messageState` compatível.
  - **M14**: `docs/testing/plano-de-testes.md` criado com estratégia, casos de teste, critérios de aceitação e próximos passos.
  - Validação: arquivos verificados no filesystem; `Stage.tsx` valida `schema_version` conforme esperado.

## Tarefas Concluídas
- [x] Revisão obrigatória pós-Tribunal — `equipe-revisao` — @coordenador-revisao — 2026-08-15
  - Status: ✅ APROVAÇÃO FINAL
  - Veredito: correções obrigatórias M9, M12 e M14 validadas; findings C2, A3, M15 descartados.
  - Ressalvas F1–F4 registradas como polimento/documentação.
  - Relatório: `/docs/testing/revisao-2026-08-15_pos_tribunal.md`

## Tarefas Concluídas
- [x] Sincronização de branches no remoto + push para `dev` — @devops — 2026-08-15
  - Backup criado: `dev-backup` → `692c571` (snapshot pré-force-push, imutável).
  - Push forçado: `dev` → `2b114f8` (`chore: sincroniza conteúdo local ESS v3.0 antes do push`).
  - `main` remota não existia (nada a apagar); `old-v1` (`038a33b`) e `old-v2` (`f87dcb9`) intactas.
  - Docs atualizados: `docs/deployment/branch-strategy.md` (inclui `dev-backup`) e `docs/management/*`.

## Tarefas Concluídas
- [x] Polir F1 — cores hex em helpers visuais — @dev-frontend — 2026-08-15
  - Criado `src/theme/colors.ts` com tokens `NEON.*` (referenciando `var(--neon-*)`) + `NEUTRAL_FALLBACK`.
  - `getSexPhaseColor`/`getMenstrualPhaseInfo` movidos de `src/core/parser.ts` para `src/theme/colors.ts` (agora derivam dos tokens `--neon-*`).
  - `parser.ts` não exporta mais funções de cor e ficou sem hex residual; `lib/erosParser.ts` re-exporta do novo módulo com `@deprecated`.
  - `SexPanel.tsx` e `ASCIIPositionViewer.tsx` importam de `@/theme/colors`.
- [x] Polir F3 — estado local duplicado em AIProviderSection/AIConfigPanel — @dev-frontend — 2026-08-15
  - `AIProviderSection.tsx`: fonte de verdade = `config.openRouterModel`/`config.openRouterApiKey`; removidos props `apiKey`/`selectedModel`/`onApiKeyChange`/`onModelChange`; estado transitório de input sincronizado via `useEffect`.
  - `AIConfigPanel.tsx`: removido estado local `model`/`apiKey`; lê de `config` diretamente.
- [x] Polir F4 — round-trip JSON no AIConfigPanel — @dev-frontend — 2026-08-15
  - Novo `parseErosStatusFromJson()` em `src/core/parser.ts` (parse direto do objeto, sem `JSON.stringify` + re-parse).
  - `parseJsonBlock` passou a cobrir `goals`/`aiInstructions`/`audit`.
  - `AIConfigPanel` propaga `Partial<ErosStatusState>` via `onParsed` (assinatura ajustada); `ErosTerminal.tsx` ganha `onApplyState`; `App.tsx`/`Stage.tsx` aplicam o estado sem re-parse.
  - Testes: +2 (`parseErosStatusFromJson`) → 36 testes passando.
- [x] Polir F2 — remover `lodash` de `package.json` (não usado) — @devops — 2026-08-15
  - `lodash` e `@types/lodash` removidos de `package.json` + `package-lock.json`.
  - Zero referências a `lodash` no código (`grep -rn lodash src/` → vazio).
- [x] Validação final do polimento F1–F4 — @devops — 2026-08-15
  - `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` (36 testes) passaram.
  - Commit do polimento na branch `dev` (sem push, aguardando autorização do usuário).

## Tarefas Concluídas
- [x] Montagem correta do Stage + busca dinâmica de modelos OpenRouter + teste de integração — @dev-backend — 2026-08-15
  - `src/main.tsx` reescrito: seleciona `App` (TestRunner, dev OU `?test`) vs `ReactRunner` (produção); `StrictMode` só no `App`.
  - `src/services/openRouter.ts`: `OPENROUTER_MODELS_URL`, `OpenRouterModelInfo`, `fetchOpenRouterModels()` (retorna `[]` em erro) + cache em memória (`resetOpenRouterModelsCache`); `AVAILABLE_MODELS` mantido como fallback offline.
  - `src/services/openRouter.test.ts`: testes de `fetchOpenRouterModels` (lista em `{ data: [...] }`, `[]` em fetch reject / `!ok` / sem `data`).
  - `src/Stage.test.tsx`: teste de integração do ciclo de vida (load/beforePrompt/afterResponse/setState/render) sem o Chub.
  - `src/vite-env.d.ts` criado (`vite/client`); `sass-embedded` adicionado como devDependency (build do `ReactRunner` puxa `index.scss` da lib).
   - Validação: `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` passaram (45 testes).
- [x] Painel de IA lista TODOS os modelos OpenRouter dinamicamente — @dev-frontend — 2026-08-15
   - `AIProviderSection.tsx` consome `fetchOpenRouterModels` + `OpenRouterModelInfo` (monta a lista dinâmica no `mount`, com `loading` "Loading models...", `error` discreto e fallback offline `AVAILABLE_MODELS` convertido para `OpenRouterModelInfo`).
   - Input de busca filtra por `name`/`id` (case-insensitive); cartões exibem `name`, `description`, `context_length` (`128k`) e preço por milhão (`$0.15/M in · $0.60/M out` — `pricing` por token × 1_000_000).
   - Seleção propaga `onConfigChange({ openRouterModel: id })`; opção "Use custom model: {texto}" quando o texto não casa com nenhum modelo (aliases/novos modelos).
   - Fonte de verdade segue `config.openRouterModel` (sem estado duplicado); "Test Connection" usa modelo selecionado + API key.
   - Acessibilidade: `role="status"`/`aria-live` no loading, `role="alert"` no erro, `aria-pressed`/`htmlFor`/`aria-label` nos cartões/inputs.
   - Validação: `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` passaram (45 testes).

## Tarefas Concluídas
- [x] Validação + commit do fix ReactRunner + listagem dinâmica de modelos — @devops — 2026-08-15
  - `npm install` ✅ (8 vulns reportadas, não bloqueantes), `npm run typecheck` ✅, `npm run lint` ✅, `npm run build` ✅, `npm run test` ✅ (45 testes / 5 arquivos).
  - Commit `613df57` na branch `dev` (20 arquivos, 1.701+/80−): `feat: montagem do Stage via ReactRunner + listagem dinâmica de modelos OpenRouter`.
  - **Sem push** — aguardando autorização do usuário.
  - Nenhum segredo no diff (apenas placeholder `sk-or-v1-...`).

## Tarefas Pendentes
- [ ] Push para `origin/dev` — @devops — aguardando autorização do usuário
- [ ] Rodar o projeto localmente (`npm run dev`) para validação — @devops
- [ ] Deploy de teste no Chub — @devops — após validação (`CHUB_EXTENSION_ID_DEV` + `CHUB_AUTH_TOKEN`)
- [ ] Criar nova `main` + promoção `dev` → `main` e deploy estável — @orquestrador — somente mediante solicitação explícita do usuário
- [ ] Documentação final e DER — @documentacao

> **Nota (2026-08-15):** os findings F1–F4 foram **redefinidos pelo usuário** (antes: M1/M10/M13/README). Novos significados: F1 = cores hex em `parser.ts`; F2 = `lodash` não usado; F3 = estado local duplicado em AIProviderSection/AIConfigPanel; F4 = round-trip JSON→string→parse no AIConfigPanel.

## Bloqueios
- ⛔ Criação da `main` + promoção/deploy estável só ocorrem mediante solicitação explícita do usuário, após validação no stage de teste.
- ⛔ Deploy de teste no Chub depende dos secrets `CHUB_AUTH_TOKEN` e `CHUB_EXTENSION_ID_DEV` configurados em Settings → Secrets and variables → Actions.
