# 💰 Análise de Tokens — 2026-08-15

## Resumo
| Métrica | Valor |
|---|---|
| Tokens totais estimados | ~12.500 |
| Tokens desperdiçados | ~1.500 |
| Percentual de desperdício | ~12% |
| Agente mais custoso | planejador-primario (~4.500) |

## Detalhamento por Agente
| Agente | Tokens | % do Total | Observação |
|---|---|---|---|
| orquestrador | 800 | 6% | Gatekeeper eficiente |
| agente-de-intencao | 2.200 | 18% | Manifesto bem enxuto |
| planejador-primario | 4.500 | 36% | Reprocessou contexto completo |
| tradutor-tiers | 1.800 | 14% | Conversão para JSON |
| arquiteto-geral | 3.200 | 26% | Recebeu apenas contratos |

## Pontos de Desperdício
1. **Planejador reprocessou manifesto** — poderia usar resumo estruturado.
2. **Respostas "C" geraram especulação** — arquiteto-geral teve que inferir detalhes.
3. **Confirmação implícita do usuário** — reduziria risco de retrabalho futuro.

## Projeção de Economia
- Com cache de manifesto: -15% (~1.875 tokens)
- Com validação de respostas vagas: -8% (~1.000 tokens)
- Total potencial de economia: ~23% (~2.875 tokens)
