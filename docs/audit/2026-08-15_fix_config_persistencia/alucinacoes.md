# 🧠 Alucinações Detectadas — fix config merge/persistência

## Resultado: nenhuma alucinação detectada.

Nesta rodada de observação, o código sob revisão está consistente com os
comentários de segurança e contratos:

- `types/config.ts:26-30` declara `openRouterApiKey` com a regra "NUNCA persista
  em localStorage/chat state" — e a implementação **respeita** essa regra nos 3
  pontos verificados (App sanitiza, Stage não persiste, openRouter não toca storage).
- Não há funcionalidade inexistente invocada, mocks errados, nem uso de API
  fictícia do OpenRouter (endpoints reais: `chat/completions` e `/models`).
- Sem falsos positivos: os avisos `console.warn` existentes (schema mismatch)
  referem-se a caminhos legítimos e não indicam defeito.

## Vigilância recomendada
- Manter `openRouterApiKey` fora de qualquer `chatState`/`messageState` futuro
  (risco de vazamento persistente via Chub). Regra já respeitada hoje.
