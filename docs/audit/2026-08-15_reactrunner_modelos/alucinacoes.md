# 🧠 Alucinações Detectadas — 2026-08-15 (ReactRunner + modelos)

## 1. Alucinação de entrega (severidade: 🔴 CRÍTICA)

**Afirmação implícita**: `@dev-backend` e `@dev-frontend` implementaram o "fix do ReactRunner (Parte 2)" e a "listagem dinâmica de modelos do OpenRouter".

**Realidade**:
- Zero referências a `ReactRunner` em `src/` e `dist/`.
- Zero funções de fetch de modelos (`fetchModels`/`listModels`/`getModels`).
- Zero chamadas a `GET /api/v1/models`.
- Nenhum registro em `docs/management/tarefas.md` ou `docs/management/implementacao.md`.

**Tipo**: funcionalidade inexistente reportada como entregue.

---

## 2. Drift documental (severidade: 🟠 ALTA)

**Fonte**: `docs/05-TERMINAL_PANELS_A.md`, linha 361.

**O que afirma**: a antiga `AIProviderSection.jsx` continha:
- autocomplete ao vivo (debounce 400ms via `GET /api/v1/models`);
- grid de modelos com cache 24h (`eros_models_cache`);
- `buildModelList`, `ModelCard` (card expansível).

**Realidade no TSX atual**: nenhum desses recursos existe. `AIProviderSection.tsx` tem `DEFAULT_MODELS` estático (3 modelos) e filtro local por texto.

**Tipo**: documentação descreve código que não existe mais (ou nunca foi portado).

---

## 3. Código morto como "API planejada" (severidade: 🟡 MÉDIA)

**Fonte**: `src/services/openRouter.ts`, linha 22 — `export const AVAILABLE_MODELS` (8 modelos hardcoded).

**Realidade**: `grep AVAILABLE_MODELS src/` retorna **1** ocorrência — a própria definição. Nenhum componente importa/consome. É um export órfão que sugere uma intenção de "listagem" nunca concretizada.

**Tipo**: artefato de implementação incompleta, não erro de runtime.

---

## 4. Não-alucinações (para registro — correto no código)

Para contraste e honestidade:
- `AIConfigPanel.tsx` chama `callOpenRouter` + `extractJsonFromResponse` + `parseErosStatusFromJson` — existe e está correto (extração real, sem round-trip stringify/parse).
- `parseErosStatusFromJson` existe em `src/core/parser.ts` (linha 183) e é testado em `parser.test.ts`.
- `Stage.tsx` implementa corretamente `load/beforePrompt/afterResponse/setState/render` estendendo `StageBase` — o problema é apenas que **nada o monta em produção**.

---

## Resumo

| # | Alucinação | Agente/fonte | Severidade | Status |
|---|---|---|---|---|
| 1 | "ReactRunner fix" e "listagem dinâmica" entregues | premessa da tarefa | 🔴 Crítico | NÃO existe no código |
| 2 | Autocomplete ao vivo + cache de modelos | `05-TERMINAL_PANELS_A.md` | 🟠 Alto | Não implementado no TSX |
| 3 | `AVAILABLE_MODELS` como listagem consumida | `openRouter.ts` | 🟡 Médio | Código morto |
