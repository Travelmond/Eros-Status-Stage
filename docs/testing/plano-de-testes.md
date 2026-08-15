# Plano de Testes — Eros Status Terminal (ESS) v3.0

## 1. Resumo

Este documento define a estratégia, os casos de teste e os critérios de aceitação da suite automatizada do **Eros Status Terminal v3.0**. O objetivo é garantir a robustez do parser de marcadores ESS, da camada de middleware (validação, gating e persistência), do auditor de consistência, da integração com OpenRouter e do ciclo de vida do StageBase, antes de qualquer deploy no Chub Venus AI.

A suite atual é executada com **Vitest** e roda em ambiente `jsdom` para testes unitários/integração, sem necessidade de servidor ou credenciais externas.

---

## 2. Estratégia

| Nível | Ferramenta | Escopo | Frequência |
|---|---|---|---|
| **Unitários** | Vitest | Funções puras do núcleo (`parser.ts`, `middleware.ts`, `audit.ts`, `openRouter.ts`) | A cada alteração de código (`test:watch`) |
| **Integração parser → middleware** | Vitest | Fluxo completo de parse + processamento de estado + auditoria | CI e antes de merge |
| **Integração OpenRouter** | Vitest + `vi.fn()` mock de `fetch` | Validação de parâmetros, timeout, erros HTTP, teste de conexão | CI e antes de merge |
| **Manuais no TestRunner** | `App.tsx` (Vite dev) | Cenários de UI: mudança de abas, toggles de módulos, extração via AI, memória | Durante desenvolvimento e validação de staging |
| **E2E no Chub** | Chub Venus AI staging | Comportamento real dentro do iframe, persistência messageState/chatState | Após deploy de teste |

### Scripts disponíveis

```bash
npm run test         # executa a suite uma vez (CI)
npm run test:watch   # modo observação
npm run test:ui      # interface visual do Vitest
npm run coverage     # relatório de cobertura
```

---

## 3. Casos de Teste

### 3.1 Parser (`src/core/parser.test.ts`)

| ID | Descrição | Entrada | Resultado esperado |
|---|---|---|---|
| P.01 | Texto vazio retorna `null` | `''` ou espaços | `null` |
| P.02 | Bloco JSON é parseado | `` ```json\n{"system": {"day": 3}}\n``` `` | Objeto com `system.day === 3` |
| P.03 | Emoji percentuais viram progressões | `[💕 75%] [🔥 60%] [😳 40%]` | `affection=75`, `libido=60`, `embarrassment=40` |
| P.04 | Marcadores do sex module | `[SEX_MODULE]`, `Position: missionary`, `Pace: passionate`, `Intensity: 78` | `sexModule.active === true`, `phase === 'sex'`, `position === 'missionary'`, `pace === 'passionate'`, `sensory_metrics.intensity === 78` |
| P.05 | Texto sem marcadores ESS | Narrativa livre | `null` |
| P.06 | `aiInstructions` extraídas | `AI Instructions: focus on dialogue, keep it flirty` | Array `['focus on dialogue', 'keep it flirty']` |

### 3.2 Middleware (`src/core/middleware.test.ts`)

| ID | Descrição | Cenário | Resultado esperado |
|---|---|---|---|
| M.01 | Preservação de estado | `previous` com nome/mood/progressão; `parsed` vazio | Estado anterior intacto no `messageState` |
| M.02 | NTR gate fechado | `parsed.ntrModule.active === true` com `ntrEnabled: false` | `ntrModule` zerado, `invalidations` contém `NTR_MODULE_BLOCKED (toggle=OFF)` |
| M.03 | NTR gate aberto | `ntrEnabled: true` | `ntrModule` preservado |
| M.04 | Coerção de progressões | `affection: 150`, `arousal: -10` | `affection: 100`, `arousal: 0`; `invalidations` indica os campos |
| M.05 | Incremento de turnos | `previousChatState.globalMeta.totalTurns: 5` | `chatState.globalMeta.totalTurns: 6` |
| M.06 | Bloqueio de retrocesso de tempo | `previous.time: 14:00`, `parsed.time: 10:00` | Horário preservado e invalidado |
| M.07 | Sex gate fechado | `sexModule.active === true`, `enableSexModule: false` | Módulo zerado, tab switch bloqueado |
| M.08 | Sex gate aberto | `enableSexModule: true` | Módulo e tab preservados |
| M.09 | Reaction gate fechado | `reactionModule.active === true`, `enableReactionModule: false` | Módulo zerado, tab switch bloqueado |
| M.10 | Reaction gate aberto | `enableReactionModule: true` | Módulo e tab preservados |
| M.11 | Persistência de `correctedIds` | `previous.audit.correctedIds: ['corr-1']` | IDs mantidos no `messageState` resultante |
| M.12 | Persistência de `ignoredIds` | `previous.audit.ignoredIds: ['ign-1']` | IDs mantidos por múltiplos turnos |
| M.13 | Arrays vazios quando não há ids | `previous.audit` sem ids | `correctedIds === []`, `ignoredIds === []` |
| M.14 | Gating combinado sex/reaction via config | Ambos desativados na config | Ambos bloqueados simultaneamente |

### 3.3 Auditor (`src/core/audit.test.ts`)

| ID | Descrição | Cenário | Resultado esperado |
|---|---|---|---|
| A.01 | Salto de localização | `currentRoom` muda de `Bedroom/Home` para `Lake/Forest` sem transição | Issue `category === 'location'`, `field === 'location.currentRoom'`, `severity === 'warning'` |
| A.02 | Item perdido | `Phone` removido do inventário | Issue `category === 'inventory'` com menção ao item |
| A.03 | Contradição narrativa | `mood: 'Angry'` com `affection: 80` | Issue `category === 'narrative'`, `field === 'character.mood'` |
| A.04 | Estado consistente | Progressão suave, mesma sala, mesmo inventário | Nenhuma issue de localização/inventário/narrativa |

### 3.4 OpenRouter (`src/services/openRouter.test.ts`)

| ID | Descrição | Cenário | Resultado esperado |
|---|---|---|---|
| O.01 | Validação de API key vazia | `apiKey: ''` | Rejeita com mensagem "Chave API e obrigatoria." |
| O.02 | Validação de modelo vazio | `model: ''` | Rejeita com mensagem "Modelo e obrigatorio." |
| O.03 | Validação de mensagem vazia | `userMessage: '   '` | Rejeita com mensagem "Mensagem do usuario esta vazia." |
| O.04 | Mock de fetch bem-sucedido | `fetch` retorna choices com content | Retorna content e `AbortSignal` presente |
| O.05 | Erro HTTP | Status `402` com `error.message` | Lança `OpenRouterError` com a mensagem do backend |
| O.06 | Timeout | `fetch` não resolve dentro de `DEFAULT_TIMEOUT_MS` | Lança `OpenRouterError` com `/timeout/i` |
| O.07 | Wrapper simples | `callOpenRouterSimple` | Passa argumentos corretamente e retorna resposta |
| O.08 | Teste de conexão OK | `testOpenRouterConnection` com fetch OK | `{ ok: true }` |
| O.09 | Teste de conexão falha | `testOpenRouterConnection` com fetch rejeitado | `{ ok: false, message }` |

### 3.5 StageBase / `Stage.tsx` e TestRunner `App.tsx`

Estes cenários são validados manualmente no TestRunner (`npm run dev`) e devem ser cobertos por testes automatizados futuros:

| ID | Descrição | Verificação |
|---|---|---|
| S.01 | `load()` retorna estados iniciais | `success: true`, `initState`, `chatState`, `messageState` presentes |
| S.02 | `beforePrompt()` injeta diretrizes do stage | `stageDirections` contém contexto de estado, memória e snippet da mensagem do usuário |
| S.03 | `afterResponse()` parseia e processa resposta da IA | `messageState` e `chatState` atualizados; `systemMessage` emitido se houver notificações |
| S.04 | `setState()` persiste estado sem mutação | Estado interno atualizado via `deepClone` |
| S.05 | `render()` não executa parse | `ErosTerminal` recebe apenas props; nenhuma chamada a `parseErosStatusFromMessage` no render |
| S.06 | `App.tsx` simula o ciclo de mensagens | Botões de cenários atualizam o terminal; parse manual reflete no estado e no log |
| S.07 | Callbacks de memória | `onCondenseMemory` e `onClearMemory` alteram `chatState.longTermMemory`/`turnHistory` |
| S.08 | Callbacks de auditoria | `onCorrectAudit` / `onIgnoreAudit` atualizam `audit.correctedIds`/`ignoredIds` |

---

## 4. Critérios de Aceitação

- [ ] Todos os testes automatizados passam: `npm run test` (34 testes no momento da escrita).
- [ ] Build limpo: `npm run build` sem erros.
- [ ] Lint limpo: `npm run lint` sem erros.
- [ ] Type-check limpo: `npm run typecheck` sem erros.
- [ ] Nenhum estado crítico depende de `localStorage` nos testes de integração.
- [ ] Testes de OpenRouter não realizam chamadas reais à API (100% mockado).
- [ ] Testes de gating cobrem NTR, Sex e Reaction para ambos os estados do toggle.

---

## 5. Próximos Passos

1. Aumentar cobertura de `Stage.tsx` com testes de componente utilizando `@testing-library/react` + mock do `StageBase`.
2. Adicionar testes visuais de regressão para os painéis do terminal (ex.: mudança de abas sugeridas pelo `ui_commands.suggested_tab`).
3. Executar **testes E2E no Chub Venus AI** após o deploy de teste da branch `dev`:
   - Verificar persistência de `messageState` entre mensagens.
   - Validar gating real de módulos NSFW dentro do iframe.
   - Confirmar que `config_schema` com `secret: true` oculta a API key.
4. Avaliar adoção de `@vitest/coverage-v8` para relatórios de cobertura contínuos no CI.

---

## 6. Histórico de Alterações

| Data | Versão | Alteração | Responsável |
|---|---|---|---|
| 2026-08-15 | 1.0 | Criação do plano de testes pós-veredito do Tribunal | @documentacao |
