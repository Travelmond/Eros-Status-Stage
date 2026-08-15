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

## Tarefas em Andamento
- [ ] Correções dos findings críticos/altos pós-revisão 1/3 — @arquiteto-geral coordenando Tier 3 — 2026-08-15
  - Backend/testes (C1, C3, A1/A2 backend, A4, A5, M4-M8) concluídos por @dev-backend.
  - DevOps/metadata (C2, M6) concluídos por @devops.
  - Frontend (A3, A1/A2 UI, M1, M2) pendentes por @dev-frontend.
  - Relatório: `/docs/testing/revisao-2026-08-15_00-00.md`

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

## Tarefas Pendentes
- [ ] Corrigir inline styles inválidos (A3) — @dev-frontend
- [ ] Conectar toggles de NTR/auditor no ConfigPanel UI (A1, A2 frontend) — @dev-frontend
- [ ] Corrigir cores hardcoded (M1) — @dev-frontend
- [ ] Corrigir teste de conexão OpenRouter simulado (M2) — @dev-frontend
- [ ] Deploy para stage de teste via push em `dev` — @devops (Contrato T04) — aguardando aprovação/credenciais do usuário
- [ ] Revisão de segurança (API key, localStorage, iframe) — @auditor-seguranca
- [ ] Revisão de UX como usuário humano — @critico-usuario
- [ ] Revisão geral de código e lógica de negócio — @critico
- [ ] Otimização de performance — @otimizador
- [ ] Documentação final e DER — @documentacao
- [ ] Validação do usuário e promoção para `main` — @orquestrador

## Bloqueios
- ⛔ Push para `origin/dev` depende de aprovação explícita do usuário e dos secrets `CHUB_AUTH_TOKEN` e `CHUB_EXTENSION_ID_DEV` configurados no GitHub.
- ⛔ Promoção `dev` → `main` e deploy estável só devem ocorrer após aprovação do usuário e revisão obrigatória.
