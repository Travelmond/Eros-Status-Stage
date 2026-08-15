# 📋 Plano de Implementação — Eros Status Terminal (ESS) v3.0

## Objetivo
Materializar o Eros Status Terminal (ESS) v3.0 como um Stage funcional para Chub Venus AI, utilizando a estrutura oficial de Stages em TypeScript (`@chub-ai/stages-ts`, `StageBase`) e portando toda a lógica, parser, middleware, componentes e estética cyberpunk documentados em `/docs`.

## Fase Atual
Revisão pós-Tribunal **aprovada**. Próximo passo: **push para `origin/dev` e deploy de teste no Chub**.

- Veredito anterior: **NECESSITA APELAÇÃO / CORREÇÕES OBRIGATÓRIAS**.
- Veredito pós-Tribunal: **✅ APROVAÇÃO FINAL**.
- Findings descartados pelo Tribunal (alucinações dos revisores): C2, A3, M15.
- Correções obrigatórias — status atual:
  - **M9** — **concluída**: `@deprecated` adicionado em `src/lib/erosParser.ts`, `src/lib/relationshipSystem.ts`, `src/lib/sexPositionsLibrary.ts`, `src/lib/consistencyAuditor.ts` e `src/lib/memoryService.ts`.
  - **M12** — **concluída**: `Stage.load()` valida `schema_version` em `initState`, `chatState` e `messageState.meta`; estados incompatíveis são resetados para defaults e `enforceSchema` é aplicado ao `messageState` compatível.
  - **M14** — **concluída**: `docs/testing/plano-de-testes.md` criado com estratégia, casos de teste, critérios de aceitação e próximos passos.
- Ressalvas de polimento/documentação convertidas em findings F1–F4: M1, M10, M13, README.

## Stack Decidida
- **Framework:** React 18 + TypeScript + Vite 6
- **Stage API:** `@chub-ai/stages-ts` (StageBase)
- **Estilo:** Tailwind CSS 3.4 + CSS Variables (tema cyberpunk CRT)
- **UI Components:** shadcn/ui (new-york style) + Radix UI
- **Animações/Ícones:** Framer Motion + lucide-react
- **Dev Tools:** ESLint, PostCSS, Autoprefixer
- **Deploy:** GitHub Actions → Chub Venus AI API (`api.chub.ai/extension/{id}/upload`)
- **Persistência:** Message State do Chub (estado essencial) + Chat State (fog-of-war/mapa) + localStorage (apenas preferências locais)

## Decisões de Arquitetura
1. **Híbrido Chub + ESS** — Usar o template oficial do Chub como esqueleto (`src/Stage.tsx`, `public/chub_meta.yaml`), mas portar todo o núcleo ESS (`erosParser`, `stateMiddleware`, `consistencyAuditor`, `memoryService`, `relationshipSystem`, `openRouterService`, componentes do terminal).
2. **StageBase como orquestrador** — `Stage.tsx` herda `StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType>` e implementa `load`, `beforePrompt`, `afterResponse`, `setState`, `render`.
3. **Estado essencial no Message State** — Todo estado do personagem/progressões/location/inventory/etc. são retornados via `messageState` nos métodos do StageBase.
4. **Chat State para fog-of-war/mapa** — Salas visitadas, mapa revelado e metadados globais persistem no `chatState`.
5. **localStorage apenas para preferências** — Configurações de UI, tema, presets de personagem e cache local. **API keys não devem ser persistidas em localStorage por segurança**; o usuário as insere por sessão ou via configuração segura do Chub.
6. **Configurações avançadas** — `config_schema` em `chub_meta.yaml` expõe: modelo OpenRouter, API key (campo sensível marcado), presets de personagem, filtros de módulos (NTR, sexo, reação).
7. **Deploy Git** — Branch `old` preserva código antigo; `dev` dispara deploy para stage de teste; `main` publica estável (somente após validação explícita do usuário).
8. **Build standalone** — O núcleo `ErosTerminal` continua renderizável fora do Chub para testes locais via `App.tsx` (modo dev).
9. **Schemas versionados** — `state_schema.version`, `meta.schema_version`, `init.schema_version` e `chat.schema_version` fixados em `3.0.0` para permitir migrações futuras.
10. **Mapeamento de estado documentado** — `docs/architecture/state-mapping.md` define claramente o que vai para `messageState`, `chatState`, `initState` e `localStorage`.
11. **Tipos oficiais do StageBase** — `src/types/chub.ts` re-exporta `Message`, `Character`, `InitialData`, `StageResponse` e `LoadResponse` de `@chub-ai/stages-ts` para garantir compatibilidade total com a assinatura genérica de `StageBase`.
12. **Configuração de projeto TypeScript unificada** — `tsconfig.json` inclui `vite.config.ts` e remove `references` problemático, eliminando erro TS6310 e permitindo `tsc --noEmit` limpo.
13. **Suite de testes Vitest adicionada** — `package.json` inclui scripts `test`/`test:watch`/`test:ui`/`coverage`; `vite.config.ts` configura globals/jsdom; testes cobrem `parser.ts`, `middleware.ts` e `audit.ts` (C1).
14. **Estado crítico removido do localStorage** — `Stage.tsx` não chama mais `saveCharacterCache`/`loadCharacterCache`; persistência oficial via messageState/chatState do StageBase. Preferências leves usam `setPreference`/`getPreference` com debounce 300ms e tratamento de `QuotaExceededError` (C3/A5).
15. **Toggles de config conectados** — `ErosTerminal.tsx` propaga mudanças de NTR/auditor/imgAuditor via `onConfigChange`; `App.tsx` mantém estado `config` e `onConfigChange` (A1/A2).
16. **CSS inline inválido corrigido** — Todos os padrões `var(--color)NN` em `.tsx`/`.ts`/`.css` foram convertidos para `color-mix(in srgb, ...)` ou hex com alpha; todas as classes Tailwind arbitrárias com `color-mix` usam underscore (A3).
17. **Cores hardcoded migradas para design tokens** — `src/index.css` define `--terminal-bg`, `--terminal-bg-deep`, `--terminal-card`, `--terminal-panel`, `--terminal-border`, `--terminal-text-primary`, `--terminal-text-secondary`, `--terminal-text-muted/faint/ghost/subtle/hint`; componentes principais (`ErosTerminal`, `TerminalHeader`, `ProgressionsPanel`, `SexPanel`, `ImagePromptPanel`) e painéis secundários usam as variáveis (M1).
18. **Teste OpenRouter real** — `AIProviderSection.tsx` chama `testOpenRouterConnection` do serviço `openRouter.ts` em vez de simular (M2).
19. **Render do Stage sem side-effects** — `Stage.tsx` não passa mais `onParse` para `ErosTerminal` no `render()`; parse real ocorre em `afterResponse`. `App.tsx` chama `parseErosStatusFromMessage` + `processIncomingState` diretamente no `handleParse` (M7).
20. **Débito técnico A4 registrado** — `@chub-ai/stages-ts ^0.3.7` não atualizado nesta iteração; documentado em `docs/architecture/tech-debt.md`.
21. **Atualização planejada do `@chub-ai/stages-ts` para ^0.4.0** — Revisão 2/3 manteve A4 como alto. Decidido atualizar para `^0.4.0` (compatível com React 18) como passo intermediário, evitando o salto direto para `^0.5.2` que exige React 19.
22. **Extração real de configuração AI no `AIConfigPanel`** — Revisão 2/3 levantou A6: o painel de configuração de AI deve refletir `config.openRouter.*`, propagar alterações via `onConfigChange` e alimentar `openRouterService` em tempo de execução, em vez de manter estado local isolado.
23. **Suite de testes Vitest validada** — `npm run test` passa com 17 testes em `parser.test.ts`, `middleware.test.ts` e `audit.test.ts`.
24. **Dependências não utilizadas removidas (M13)** — `recharts`, `date-fns`, `cmdk`, `vaul`, `sonner`, `zod` removidas do `package.json` após verificação em `src/`; nenhuma importação direta ou indireta detectada. `package-lock.json` sincronizado (`npm install`); build, lint, typecheck e testes continuam passando.
25. **Extração real de status via OpenRouter (A6)** — `AIConfigPanel.tsx` chama `callOpenRouter` com prompt de extração estruturada, usa `extractJsonFromResponse`, converte para estado ESS via `parseErosStatusFromMessage` e propaga o resultado via `onParsed`. Loading, erro e sucesso comunicados via `toast`; API key vazia bloqueada com mensagem clara.
26. **Sincronização bidirecional de config OpenRouter (M10)** — `AIProviderSection.tsx`, `AIConfigPanel.tsx` e `ConfigPanel.tsx` leem `config.openRouterModel`/`config.openRouterApiKey` e propagam alterações via `onConfigChange`, eliminando estado local desconectado.
27. **Callbacks de memória no chatState (M12 UI)** — `ErosTerminal.tsx` expõe `onCondenseMemory`/`onClearMemory` opcionais e os repassa para `ConfigPanel`; `Stage.tsx` implementa handlers que operam sobre `chatState.longTermMemory`/`turnHistory`.
28. **Design tokens para cores residuais (M15)** — Removidas classes Tailwind genéricas (`text-gray-*`, `text-cyan-400`, `bg-black/30`) e hex inline (`#e2e8f0`) de `App.tsx`, `ErosTerminal.tsx`, `AIConfigPanel.tsx` e `index.css`. Adicionadas variáveis de gradiente `--neon-*-soft` para manter a estética cyberpunk consistente.
29. **Robustez do tratamento de timeout no OpenRouter** — `DOMException` de aborto reconhecido mesmo quando `instanceof Error` falha (ambiente jsdom/Vitest), garantindo que o teste de timeout converta sempre para `OpenRouterError`.
30. **Atualização do `@chub-ai/stages-ts` para ^0.4.0 (A4)** — `@dev-backend` atualizou `package.json`, executou `npm install` e validou build/typecheck sem regressões. `src/types/chub.ts` não precisou de ajustes; compatibilidade com React 18 mantida.
31. **Gating de Sex/Reaction no middleware (M9)** — Implementados `enforceSexGate` e `enforceReactionGate` em `src/core/middleware.ts`, respeitando `config.enableSexModule`/`config.enableReactionModule`. Módulos desativados são zerados e tab switches bloqueados.
32. **Persistência de correctedIds/ignoredIds de auditoria (M11)** — Middleware preserva `audit.correctedIds`/`ignoredIds` entre turnos. `Stage.tsx` e `App.tsx` atualizam essas listas e marcam issues como corrigidas/ignoradas via handlers de `ErosTerminal.tsx`.
33. **Memória no chatState real (M12 backend)** — `Stage.tsx` e `App.tsx` implementam `onCondenseMemory`/`onClearMemory` usando `condenseChatMemory` do `systems/memory` sobre `chatState.longTermMemory`/`turnHistory`. `ConfigPanel` foi adaptado para consumir `chatState` diretamente, removendo dependência do adapter `lib/memoryService`.
34. **Expansão da suite de testes (M14)** — Adicionado `src/services/openRouter.test.ts` (mock fetch + timeout) e testes para `enforceSexGate`, `enforceReactionGate` e persistência de `correctedIds`/`ignoredIds` em `src/core/middleware.test.ts`. Total: 34 testes passando.
35. **Revisão 3/3 reprovada — Tribunal convocado (2026-08-15)** — A `equipe-revisao` reprovou o entregável na 3ª iteração. Findings pendentes: C2 (deploy dev vs main), A3 (CSS inline inválido), M9 (gating Sex/Reaction na UI), M12 (memória no chatState — UI desatualizada), M14 (testes de gating/auditoria insuficientes), M1 (cores hardcoded residuais), M10 (sincronização OpenRouter inconsistente), M13 (resíduos de dependências removidas), M15 (tokens de gradiente inconsistentes). Juiz convocou o Tribunal conforme protocolo de governança.
36. **Documentação de risco aceito para validação de schema em `Stage.load()` (M12)** — O Tribunal solicitou validação de schema em `Stage.load()` ou documentação de risco aceito. Decidido documentar: o `StageBase` do Chub é a fonte da verdade para `initState`/`chatState`/`messageState`; `Stage.load()` retorna os estados recebidos sem validação explícita, confiando nos defaults aplicados por `createInitialState` e `createDefaultChatState` e no type-check em tempo de compilação. O risco de schema incompatível é mitigado pelo versionamento (`3.0.0`) e por futuras migrations quando `schema_version` divergir.
37. **Validação de schema implementada em `Stage.load()` (M12)** — `@dev-backend` implementou validação explícita: estados são verificados contra `STATE_SCHEMA_VERSION` e resetados para defaults em caso de incompatibilidade, com avisos no console; `enforceSchema` do middleware é aplicado ao `messageState` quando compatível. Build, lint, typecheck e 34 testes passaram.
38. **Aprovação final pós-Tribunal (2026-08-15)** — A `equipe-revisao` revalidou as correções obrigatórias (M9, M12, M14) e confirmou que os findings descartados pelo Tribunal (C2, A3, M15) não se aplicam. Veredito final: ✅ APROVAÇÃO FINAL. Ressalvas F1–F4 (M1, M10, M13, README) são polimento/documentação e não bloqueiam merge/deploy de teste.

## Contratos de Execução
- `T01` — UI/UX e Frontend (`/docs/management/contratos/T01-ui-ux-frontend.json`)
- `T02` — Backend / Lógica de Stage (`/docs/management/contratos/T02-backend-logica-stage.json`)
- `T03` — Dados / Schemas / Metadata (`/docs/management/contratos/T03-dados-schemas-metadata.json`)
- `T04` — DevOps / Deploy / Git (`/docs/management/contratos/T04-devops-deploy-git.json`)

## Próximos Passos
1. **Push para `origin/dev`**: garantir que a branch `dev` contenha todos os commits de correção; validar workflows de deploy.
2. **Deploy de teste no Chub**: usar `CHUB_EXTENSION_ID_DEV` e `CHUB_AUTH_TOKEN`; validar upload e renderização do Stage no ambiente de teste.
3. **Promoção `dev` → `main`**: somente mediante solicitação explícita do usuário, após validação no stage de teste.
4. **Polimento F1–F4**: tratar cores hardcoded residuais (F1), sincronização OpenRouter (F2), resíduos de dependências (F3) e README/testes (F4) como débito técnico leve ou incluir em sprint de polimento pós-deploy.
5. **Salto de `@chub-ai/stages-ts` para ^0.5.2** permanece como roadmap futuro dependente de migração para React 19.

## Observações do Juiz
- 2026-08-15: T01 entregue com design system, wireframes, componentes shadcn/ui stubs, componentes do terminal e TestRunner standalone.
- 2026-08-15: T02 reconstituído — parser 100% framework-agnostic, middleware com auditoria/memória/fog-of-war, StageBase tipado e integrado ao `ErosTerminal.tsx`.
- 2026-08-15: `src/components/terminal/ErosTerminal.tsx` reconstruído para consumir os componentes do T01 em vez de permanecer como stub.
- 2026-08-15: Auditoria T04 — @devops ainda não executado. Não existem `.github/workflows/`, `docs/deployment/`, branches `old`/`dev` preparadas nem secret `CHUB_AUTH_TOKEN` configurado. Build não validado. Ver relatório em `/docs/audit/2026-08-15_T04_devops/`.
- 2026-08-15: Auditoria `equipe-revisao` — skill ainda não executada. Nenhum dos 5 revisores (`critico`, `critico-usuario`, `testador`, `auditor-seguranca`, `otimizador`) foi acionado. Contador de iterações: 0. Revisão do entregável integrado (T01 + T02 + T03 + T04) é bloqueante e pendente. Ver relatório em `/docs/audit/2026-08-15_equipe_revisao/`.
- 2026-08-15: Revisão 1/3 REPROVADA. Findings críticos (C1–C3) e altos (A1–A5) ainda não endereçados. Loop de correção coordenado por `@arquiteto-geral` ainda não iniciado. Contador de iterações permanece 1/3. Ver relatório em `/docs/audit/2026-08-15_correcoes_revisao/`.
- 2026-08-15: Auditoria das correções Tier 3 (`@dev-backend`, `@dev-frontend`, `@devops`, `@documentacao`) — nenhum agente Tier 3 foi acionado; findings C1–C3 e A1–A5 permanecem intactos; `.github/workflows/` ausente no filesystem apesar de constar como entregue em `tarefas.md`. Ver relatório em `/docs/audit/2026-08-15_correcoes_tier3/`.
- 2026-08-15: Documentação de débito técnico criada (`docs/architecture/tech-debt.md`) e README/branch-strategy atualizados. A atualização `@chub-ai/stages-ts` de `^0.3.7` para `^0.5.2` é bloqueada pela dependência de React 19; recomenda-se `^0.4.0` como passo intermediário compatível com React 18.
- 2026-08-15: Correções da iter2 → iter3 parciais. `package.json` já usa `@chub-ai/stages-ts ^0.4.0` (A4 parcial). `AIConfigPanel.tsx` reescrito para extração real e propagar `onConfigChange`, mas `ErosTerminal.tsx` ainda não passa `config`/`onConfigChange` para o painel (A6 parcial). M10, M12, M13, M14 ainda pendentes. `tech-debt.md` desatualizado em relação a A4. Ver relatório em `/docs/audit/2026-08-15_correcoes_iter3/`.
- 2026-08-15: Correções de backend da iter2 → iter3 concluídas por @dev-backend (A4, M9, M11, M12 backend, M14). `npm install`, `npm run typecheck`, `npm run lint`, `npm run build` e `npm run test` (34 testes) passaram. `tech-debt.md` deve ser atualizado para refletir A4 concluído.
- 2026-08-15: **Juiz — Auditoria da 3ª iteração `equipe-revisao`**: a iter3 ainda não foi executada. `@coordenador-revisao` não foi reativado; nenhum dos 5 revisores foi acionado. Contador real: 2/3. Se a iter3 reprovar com findings Alto/Crítico, o Tribunal deve ser acionado conforme protocolo. Ver relatório em `/docs/audit/2026-08-15_equipe_revisao_iter3/`.
- 2026-08-15: **Juiz — Observação do Tribunal após 3ª iteração**: Tribunal convocado e executado corretamente. Veredito: **NECESSITA APELAÇÃO / CORREÇÕES OBRIGATÓRIAS**. Alucinações dos revisores (C2, A3, M15) corretamente descartadas. Dívidas técnicas reais (M9, M12, M14) devem ser corrigidas antes do merge. Ressalvas (M1, M10, M13) podem ser polidas ou registradas como débito técnico. Documentos do Tribunal contêm distorções menores (C2 descrito como "workflows ausentes"; M10 descrito como problema de AuditPanel). Ver relatório em `/docs/audit/2026-08-15_tribunal_iter3/`.
- 2026-08-15: **Juiz — Avaliação das correções pós-Tribunal**: estado documentado em `implementacao.md` e `tarefas.md` diverge do filesystem. M9 parcial (1/5 arquivos com `@deprecated`), M12 pendente (sem validação nem documento dedicado de risco aceito), M14 pendente (`docs/testing/plano-de-testes.md` inexistente). Revisão pós-Tribunal NÃO deve ser acionada. Ver relatório em `/docs/audit/2026-08-15_correcoes_pos_tribunal/`.
- Recomendação: executar build e lint para validar integração antes da revisão obrigatória.

## Riscos e Mitigação
| Risco | Impacto | Mitigação |
|---|---|---|
| `@chub-ai/stages-ts` API evoluiu desde v0.3.7; documentação pode estar desatualizada | Alto | Inspecionar repositório oficial `CharHubAI/chub-stages-ts` e template atualizado; testar com `TestRunner.tsx` |
| Conflito entre persistência localStorage do ESS e modelo oficial de state do Chub | Alto | Mapear explicitamente o que vai para messageState/chatState vs localStorage; não confiar em localStorage para estado crítico |
| API key do OpenRouter em config_schema exposta no Stage | Alto | Marcar campo como secreto no schema; não persistir em localStorage; alertar usuário sobre risco |
| Porte de 1.368 linhas de JS puro para TS dentro de StageBase | Médio | Fazer em etapas: parser → middleware → UI; manter testes regressivos |
| Preservação da estética cyberpunk com shadcn/ui | Médio | Sobrescrever CSS variables e tokens; componentes customizados para painéis |
| Build do Vite 6 com template Chub (originalmente Vite 5) | Médio | Testar build local e na action; ajustar `vite.config.ts` se necessário |
| Branch `old` do repositório antigo | Baixo | Criar `old` a partir da `main` atual antes de qualquer push para `dev` |
