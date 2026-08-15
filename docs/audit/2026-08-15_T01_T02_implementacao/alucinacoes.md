# 🧠 Alucinações Detectadas — T01/T02 Implementação

## Status
Nenhuma alucinação confirmada neste ciclo, pois não houve geração de código.

## Riscos de Alucinação Futura
| Área | Risco | Severidade |
|---|---|---|
| T01 — Componentes | Criar dependência de `react-router-dom` em algum painel (violando hard rule) | Alta |
| T01 — Tokens | Hardcode cores Tailwind sem usar CSS variables (violando hard rule) | Média |
| T01 — localStorage | Persistir estado crítico ou API key em `localStorage` (violando hard rule) | Alta |
| T02 — Parser | Incluir import de React/StageBase dentro de `parser.ts` (violando hard rule) | Alta |
| T02 — StageBase | Esquecer algum método obrigatório (`load`, `beforePrompt`, `afterResponse`, `setState`, `render`) | Alta |
| T02 — OpenRouter | Implementar chamada com `axios` em vez de `fetch` nativo (violando hard rule) | Média |
| T02 — Estado | Confundir `messageState` com `chatState` (ex: colocar progressão do personagem no chatState) | Alta |

## Recomendação
Ativar `critico` e `auditor-seguranca` imediatamente após a primeira entrega de código de T01/T02 para interceptar as alucinações acima antes que se propaguem.
