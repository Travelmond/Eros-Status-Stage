# 🔧 Melhorias Propostas — 2026-08-15 (ReactRunner + modelos)

## 1. Montagem de produção via `ReactRunner` (🔴 bloqueante)

**Problema**: `main.tsx` monta o TestRunner `<App />`; o Stage nunca roda.

**Solução**:
- Criar entry de produção dedicado (ex.: `src/stage-main.tsx`) que faça:
  ```tsx
  import { ReactRunner } from '@chub-ai/stages-ts';
  import Stage from './Stage';
  import type { InitialData } from './types/chub';

  // ReactRunner monta o Stage e gerencia INIT/BEFORE/AFTER/SET via postMessage.
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <ReactRunner factory={(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) => new Stage(data)} />,
  );
  ```
- Ajustar `vite.config.ts` (ou `index.html` de produção) para apontar para esse entry.
- Manter `main.tsx`/`App.tsx` apenas como TestRunner de desenvolvimento local.

**Impacto**: torna o Stage funcional no Chub (a falha mais crítica do projeto).

---

## 2. Implementar fetch de modelos do OpenRouter (🟠 alto)

**Problema**: listagem estática `DEFAULT_MODELS`/`AVAILABLE_MODELS`; nenhum fetch.

**Solução**:
- Adicionar em `src/services/openRouter.ts`:
  ```ts
  export const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';
  export interface FetchedModel { id: string; name: string; context_length?: number; pricing?: { prompt: number; completion: number }; }
  export async function fetchModels(apiKey: string): Promise<FetchedModel[]> { /* GET com Authorization: Bearer */ }
  ```
- `AIProviderSection.tsx`: buscar modelos ao montar / botão "Refresh", com:
  - fallback para `DEFAULT_MODELS` em caso de erro;
  - cache local com TTL (ex.: 24h) — alinhado à doc antiga;
  - estado `loading/error`.

**Impacto**: concretiza a "listagem dinâmica" prometida e elimina a divergência de listas hardcoded.

---

## 3. Corrigir drift documental (🟡 médio)

- Atualizar `docs/05-TERMINAL_PANELS_A.md` para refletir o TSX atual (ou remover menções a autocomplete/cache/`ModelCard` inexistentes).
- Adicionar em `tarefas.md`/`implementacao.md` as tarefas REAIS pendentes (ReactRunner + fetch de modelos), que hoje não constam.

---

## 4. Remover/consumir código morto (🟡 baixo)

- `AVAILABLE_MODELS` (8 modelos) em `openRouter.ts`: ou remover, ou tornar a fonte de fallback do `fetchModels` (evitando a lista duplicada de 3 em `AIProviderSection`).

---

## 5. Validar build/testes com terminal (🟡 baixo — pendente de capacidade)

- Executar `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test` após as correções 1–2.
- Nota: o Juiz não dispôs de shell nesta sessão; a validação é estática.

---

## Resumo de impacto

| # | Solução | Impacto | Esforço |
|---|---|---|---|
| 1 | `ReactRunner` no entry de produção | Destrava o Stage inteiro no Chub | Médio |
| 2 | `fetchModels()` + cache | Torna real a listagem dinâmica | Médio |
| 3 | Sincronizar docs | Elimina alucinação documental | Baixo |
| 4 | Remover `AVAILABLE_MODELS` morto | Reduz superfície confusa | Baixo |
| 5 | Validar build/testes | Garantia de regressão | Baixo |
