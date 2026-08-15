# 📋 Plano de Implementação — Eros Status Terminal (ESS) v3.0

## Objetivo
Materializar o Eros Status Terminal (ESS) v3.0 como um Stage funcional para Chub Venus AI, utilizando a estrutura oficial de Stages em TypeScript (`@chub-ai/stages-ts`, `StageBase`) e portando toda a lógica, parser, middleware, componentes e estética cyberpunk documentados em `/docs`.

## Fase Atual
T02 — Backend / Lógica de Stage reconstituído e integrado ao T01/T03. T01 — UI/UX e Frontend já existia; o `ErosTerminal.tsx` foi reconstruído para usar os componentes reais do T01. T03 — Dados / Schemas / Metadata concluído. Próxima etapa: validação de build (`npm install` / `typecheck` / `lint`) e revisão obrigatória da `equipe-revisao`.

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

## Contratos de Execução
- `T01` — UI/UX e Frontend (`/docs/management/contratos/T01-ui-ux-frontend.json`)
- `T02` — Backend / Lógica de Stage (`/docs/management/contratos/T02-backend-logica-stage.json`)
- `T03` — Dados / Schemas / Metadata (`/docs/management/contratos/T03-dados-schemas-metadata.json`)
- `T04` — DevOps / Deploy / Git (`/docs/management/contratos/T04-devops-deploy-git.json`)

## Próximos Passos
1. Validar build local: `npm install`, `npm run typecheck`, `npm run lint`.
2. `equipe-revisao` auditar obrigatoriamente o entregável integrado (T01 + T02 + T03).
3. Tier 3 corrigir eventuais issues apontadas pelos revisores.
4. @arquiteto-geral validar interface entre T01/T02 e os schemas de T03.
5. @devops iniciar T04 — configurar GitHub Actions e estratégia de branches.
6. Após aprovação da revisão, promover para deploy em stage de teste.

## Observações do Juiz
- 2026-08-15: T01 entregue com design system, wireframes, componentes shadcn/ui stubs, componentes do terminal e TestRunner standalone.
- 2026-08-15: T02 reconstituído — parser 100% framework-agnostic, middleware com auditoria/memória/fog-of-war, StageBase tipado e integrado ao `ErosTerminal.tsx`.
- 2026-08-15: `src/components/terminal/ErosTerminal.tsx` reconstruído para consumir os componentes do T01 em vez de permanecer como stub.
- 2026-08-15: Auditoria T04 — @devops ainda não executado. Não existem `.github/workflows/`, `docs/deployment/`, branches `old`/`dev` preparadas nem secret `CHUB_AUTH_TOKEN` configurado. Build não validado. Ver relatório em `/docs/audit/2026-08-15_T04_devops/`.
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
