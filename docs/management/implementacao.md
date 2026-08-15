# 📋 Plano de Implementação — Eros Status Terminal (ESS) v3.0

## Objetivo
Materializar o Eros Status Terminal (ESS) v3.0 como um Stage funcional para Chub Venus AI, utilizando a estrutura oficial de Stages em TypeScript (`@chub-ai/stages-ts`, `StageBase`) e portando toda a lógica, parser, middleware, componentes e estética cyberpunk documentados em `/docs`.

## Fase Atual
Revisão — Iteração 1: REPROVADO. Correções de backend/testes (C1, C3, A1/A2, A4, A5, M4-M8) aplicadas por @dev-backend. Correções de DevOps/metadata (C2, M6) aplicadas por @devops. Aguardando correções de frontend (A3, M1, M2) por @dev-frontend antes de reativar equipe-revisao para iteração 2.

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
15. **Toggles de config conectados** — `ErosTerminal.tsx` propaga mudanças de NTR/auditor/imgAuditor via `onConfigChange`; `App.tsx` mantém estado `config` (A1/A2).
16. **Débito técnico A4 registrado** — `@chub-ai/stages-ts ^0.3.7` não atualizado nesta iteração; documentado em `docs/architecture/tech-debt.md`.
17. **Suite de testes Vitest validada** — `npm run test` passa com 17 testes em `parser.test.ts`, `middleware.test.ts` e `audit.test.ts`.

## Contratos de Execução
- `T01` — UI/UX e Frontend (`/docs/management/contratos/T01-ui-ux-frontend.json`)
- `T02` — Backend / Lógica de Stage (`/docs/management/contratos/T02-backend-logica-stage.json`)
- `T03` — Dados / Schemas / Metadata (`/docs/management/contratos/T03-dados-schemas-metadata.json`)
- `T04` — DevOps / Deploy / Git (`/docs/management/contratos/T04-devops-deploy-git.json`)

## Próximos Passos
1. @dev-frontend corrige A3 (CSS inline inválido), A1/A2 complementares de UI, M1 (cores hardcoded), M2 (teste OpenRouter simulado).
2. Re-executar `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` após integração das correções de frontend.
3. @arquiteto-geral coordena reativação da skill `equipe-revisao` para iteração 2.
4. Com aprovação do usuário, fazer push de `dev` para `origin/dev` e validar deploy de teste no Chub.
5. Após validação de staging, promover `dev` → `main` mediante solicitação explícita do usuário.

## Observações do Juiz
- 2026-08-15: T01 entregue com design system, wireframes, componentes shadcn/ui stubs, componentes do terminal e TestRunner standalone.
- 2026-08-15: T02 reconstituído — parser 100% framework-agnostic, middleware com auditoria/memória/fog-of-war, StageBase tipado e integrado ao `ErosTerminal.tsx`.
- 2026-08-15: `src/components/terminal/ErosTerminal.tsx` reconstruído para consumir os componentes do T01 em vez de permanecer como stub.
- 2026-08-15: Auditoria T04 — @devops ainda não executado. Não existem `.github/workflows/`, `docs/deployment/`, branches `old`/`dev` preparadas nem secret `CHUB_AUTH_TOKEN` configurado. Build não validado. Ver relatório em `/docs/audit/2026-08-15_T04_devops/`.
- 2026-08-15: Auditoria `equipe-revisao` — skill ainda não executada. Nenhum dos 5 revisores (`critico`, `critico-usuario`, `testador`, `auditor-seguranca`, `otimizador`) foi acionado. Contador de iterações: 0. Revisão do entregável integrado (T01 + T02 + T03 + T04) é bloqueante e pendente. Ver relatório em `/docs/audit/2026-08-15_equipe_revisao/`.
- 2026-08-15: Revisão 1/3 REPROVADA. Findings críticos (C1–C3) e altos (A1–A5) ainda não endereçados. Loop de correção coordenado por `@arquiteto-geral` ainda não iniciado. Contador de iterações permanece 1/3. Ver relatório em `/docs/audit/2026-08-15_correcoes_revisao/`.
- 2026-08-15: Auditoria das correções Tier 3 (`@dev-backend`, `@dev-frontend`, `@devops`, `@documentacao`) — nenhum agente Tier 3 foi acionado; findings C1–C3 e A1–A5 permanecem intactos; `.github/workflows/` ausente no filesystem apesar de constar como entregue em `tarefas.md`. Ver relatório em `/docs/audit/2026-08-15_correcoes_tier3/`.
- 2026-08-15: Documentação de débito técnico criada (`docs/architecture/tech-debt.md`) e README/branch-strategy atualizados. A atualização `@chub-ai/stages-ts` de `^0.3.7` para `^0.5.2` é bloqueada pela dependência de React 19; recomenda-se `^0.4.0` como passo intermediário compatível com React 18.
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
