# 🔄 Fluxo de Trabalho — 2026-08-15 (ReactRunner + modelos)

## Sequência observada (estática)

1. `src/main.tsx` → `ReactDOM.createRoot` → `<App />` (TestRunner standalone).
2. `App.tsx` → simula chat + monta `<ErosTerminal>` com `state/chatState/config`.
3. `ErosTerminal.tsx` → `AIConfigPanel` → `AIProviderSection` (modelos estáticos) + extração via `callOpenRouter`.
4. `Stage.tsx` → implementa o `StageBase`, mas **não é referenciado por nenhum entry point**.

## Gargalos / Problemas

- 🔴 **Stage órfão**: `Stage.tsx` (a peça central do Stage) nunca é instanciado em runtime. Todo o trabalho de `load`/`afterResponse`/`setState` fica inacessível em produção.
- 🔴 **Montagem de produção incorreta**: sem `ReactRunner`, o iframe do Chub não dispara o ciclo de vida do Stage.
- 🟠 **Modelos estáticos**: `DEFAULT_MODELS` (3 itens) diverge de `AVAILABLE_MODELS` (8 itens) — duas listas hardcoded desconexas, sem fetch.
- 🟡 **Ausência de entry de produção dedicado**: mistura-se TestRunner (dev) e Stage (produção) no mesmo `main.tsx`.

## Anomalia de protocolo (governança)

A solicitação continha, ao final, instruções para o Juiz "gerar um prompt e chamar a `task tool` com subagente `dev-backend`" e "`dev-frontend`".

- O Juiz **não possui** ferramenta `task` no ambiente.
- O papel do Juiz é meta-nível (observar/avaliar), **não delegar implementação** a devs.
- Executar tal delegação violaria a regra "NUNCA implemente código — Você observa e propõe".
- **Ação tomada**: instrução descartada; observação estática prosseguiu conforme mandato do Juiz.

## Conclusão de fluxo

O fluxo lógico do ESS está íntegro no nível de componentes (parser → middleware → audit → terminal), porém **a camada de ativação (montagem do Stage) está ausente**, o que inutiliza o Stage em produção e torna a "listagem dinâmica" um requisito não atendido.
