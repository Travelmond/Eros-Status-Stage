# 📊 Relatório do Juiz — 2026-08-15 (ReactRunner fix + listagem dinâmica de modelos)

## Escopo da Observação
- **Comando/solicitação**: Observar implementação do "fix do ReactRunner (Parte 2)" e da "listagem dinâmica de modelos do OpenRouter" no ESS v3.0, supostamente entregues por `@dev-backend` e `@dev-frontend`.
- **Método**: Inspeção estática do `src/`, `dist/`, `package.json`, `docs/` e do pacote `@chub-ai/stages-ts@0.4.0` em `node_modules`.
- **Pasta do relatório**: `/docs/audit/2026-08-15_reactrunner_modelos/`

## Veredito Central
🔴 **As duas implementações supostamente entregues NÃO existem no código.**

1. **"Fix do ReactRunner (Parte 2)"** — Não há nenhuma referência a `ReactRunner` em `src/` nem no bundle de produção (`dist/`). A montagem de produção está INCORRETA: `main.tsx` monta o **TestRunner standalone (`<App />`)** via `ReactDOM.createRoot`, e não o Stage via `ReactRunner`.
2. **"Listagem dinâmica de modelos do OpenRouter"** — Não existe. A UI usa a lista estática `DEFAULT_MODELS` (3 modelos hardcoded) e não há função de fetch de `/api/v1/models` em lugar algum.

---

## 1. Montagem de Produção — ❌ INCORRETA

| Item | Esperado (Chub Stage) | Encontrado |
|---|---|---|
| Entry point | `ReactRunner` de `@chub-ai/stages-ts` com `factory` que instancia `Stage` | `main.tsx` → `ReactDOM.createRoot(...).render(<App />)` |
| Componente montado | `Stage` (ciclo `load/beforePrompt/afterResponse/setState/render`) | `App` (TestRunner standalone com chat simulado) |
| Referências a `ReactRunner` em `src/` | ≥1 | **0** |
| Referências a `ReactRunner` em `dist/` | ≥1 | **0** (grep → "No files found") |

### Evidências
- `@chub-ai/stages-ts@0.4.0` exporta `ReactRunner` + `ReactRunnerProps` (com prop obrigatória `factory`) — verificado em `node_modules/@chub-ai/stages-ts/dist/index.d.ts` (linha 10) e `dist/components/ReactRunner.d.ts`.
- `src/main.tsx` (10 linhas) monta `<App />`, ignorando totalmente o `Stage` definido em `src/Stage.tsx`.
- `vite.config.ts` tem um único entry (`index.html`), que aponta para `main.tsx`. Não existe entry de produção separado.
- O bundle `dist/assets/index-FACYCUiV.js` contém `createRoot` (React DOM) mas **zero** menções a `ReactRunner`.

**Consequência**: em produção no Chub (iframe), o Stage jamais receberia as mensagens `INIT/BEFORE/AFTER/SET` do `ReactRunner` e o terminal nunca atualizaria via ciclo de vida do `StageBase`. O `dist/` atual é um artefato do TestRunner, não do Stage.

---

## 2. Fetch de Modelos — ❌ NÃO FUNCIONA (função inexistente)

| Item | Esperado | Encontrado |
|---|---|---|
| Endpoint de listagem | `GET https://openrouter.ai/api/v1/models` | **Nenhum** — `OPENROUTER_BASE_URL` aponta só para `/chat/completions` |
| Função de fetch | `fetchModels`/`listModels`/`getModels` | **Não existe** (grep em `src/` → 0 resultados) |
| Fonte da UI | Resposta dinâmica da API | `DEFAULT_MODELS` (3 itens hardcoded em `AIProviderSection.tsx`) |
| Cache de modelos | `eros_models_cache` (documentado) | **Inexistente** |
| Autocomplete ao vivo | debounce 400ms + `GET /api/v1/models` | **Inexistente** (filtro local por `query` apenas) |

### Evidências
- `src/services/openRouter.ts` exporta apenas: `callOpenRouter`, `callOpenRouterSimple`, `extractJsonFromResponse`, `testOpenRouterConnection` e `AVAILABLE_MODELS` (8 modelos estáticos, **código morto** — nenhum consumidor).
- `src/components/terminal/AIProviderSection.tsx` usa `DEFAULT_MODELS` (3 modelos) com filtro local — sem qualquer chamada de rede para listar modelos.
- O bundle `dist/` contém apenas `openrouter.ai/api/v1/chat/completions`; não há `api/v1/models` no artefato.

---

## 3. Build / Testes — ⚠️ NÃO VALIDÁVEIS (sem terminal)

- **Artefato `dist/` existe** (`index.html` + `index-FACYCUiV.js` + CSS + `chub_meta.yaml`), porém é **stale**: reflete o TestRunner, não as mudanças alegadas (que não existem).
- **4 arquivos de teste** encontrados: `openRouter.test.ts`, `parser.test.ts`, `middleware.test.ts`, `audit.test.ts`.
- `tarefas.md` registra "36 testes passando" na última validação (polimento F1–F4), anterior à suposta implementação do ReactRunner/modelos.
- **Não tenho ferramenta de execução (shell) disponível** nesta sessão para rodar `npm run build`/`npm run test`; a avaliação é estática. Como o código alegado não existe, qualquer "build/testes passando" reportado para ele seria necessariamente falso.

---

## 4. Alucinações Detectadas

Ver `alucinacoes.md` (resumo abaixo):

1. **Premissa da solicitação** — "fix do ReactRunner (Parte 2)" e "listagem dinâmica de modelos" não constam em `tarefas.md`, `implementacao.md`, nem no código. Não há tarefa, commit ou artefato que os materialize.
2. **`docs/05-TERMINAL_PANELS_A.md` (linha 361)** — descreve a versão `.jsx` antiga com "autocomplete ao vivo (debounce 400ms via `GET /api/v1/models`)", "cache 24h (`eros_models_cache`)", "buildModelList", "ModelCard". Nada disso existe no TSX atual (drift documental).
3. **`AVAILABLE_MODELS` (8 modelos)** em `openRouter.ts` — export declarado mas nunca importado (código morto), sugerindo uma API "planejada" que nunca foi consumida.

---

## 5. Anomalia de Fluxo (governança)

A solicitação incluía instrução para o Juiz "chamar a `task tool` com subagentes `dev-backend` e `dev-frontend`":
- O Juiz **não possui** ferramenta `task` e **não delega implementação** (papel meta-nível de observação).
- Delegar a devs seria violação da regra "NUNCA implemente código — Você observa e propõe".
- Registrado como anomalia de protocolo (ver `fluxo-trabalho.md`).

---

## 6. Recomendações

Ver `melhorias.md`. Destaques:

1. **Criar entry de produção** que monte `ReactRunner` com `factory: (data) => new Stage(data)` (arquivo dedicado, ex.: `src/stage-main.tsx`), mantendo `main.tsx` como TestRunner de dev.
2. **Implementar `fetchModels()`** em `openRouter.ts` chamando `GET https://openrouter.ai/api/v1/models` com header `Authorization`, com fallback para `AVAILABLE_MODELS`/`DEFAULT_MODELS` e cache local.
3. **Corrigir drift documental** em `05-TERMINAL_PANELS_A.md` para não descrever funcionalidades ausentes.
4. **Remover ou consumir `AVAILABLE_MODELS`** (código morto).

> **Conclusão objetiva**: nada foi observado que comprove a entrega. Ambas as features alegadas são inexistentes; a montagem de produção atual é inadequada para o Chub; o fetch de modelos não existe.
