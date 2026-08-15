# 💰 Análise de Tokens — Revisão Pós-Tribunal (ESS v3.0)

## Tokens por Etapa

| Etapa | Tokens estimados | Observação |
|---|---|---|
| Leitura da revisão iter3 | ~1.200 | `docs/testing/revisao-2026-08-15_iteracao3.md` |
| Leitura do veredito do Tribunal | ~1.000 | `docs/audit/tribunal/2026-08-15_iteracao3/veredito.md` |
| Leitura do relatório do Juiz sobre o Tribunal | ~1.000 | `docs/audit/2026-08-15_tribunal_iter3/relatorio.md` |
| Inspeção dos 5 arquivos `src/lib/*.ts` | ~800 | Verificação de `@deprecated` |
| Inspeção de `src/Stage.tsx` | ~600 | Verificação de validação de schema |
| Inspeção de `docs/testing/plano-de-testes.md` | ~200 | Verificação de M14 |
| **Total estimado** | **~4.800** | |

## Desperdício

- **Desperdício estimado:** ~5% (~240 tokens).
- **Principal causa:** necessidade de reconciliar distorções do Tribunal (C2, M10) com o texto original dos findings da iter3.

## Economia

- **Custo evitado:** ~20.000 tokens.
- **Como:** inspeção direta do Juiz evitou acionar a `skill equipe-revisao` sobre correções que ainda não estavam prontas no momento anterior. Agora que estão prontas, o custo da revisão pós-Tribunal é justificado.

## Projeção para Revisão Pós-Tribunal

| Agente | Tokens estimados |
|---|---|
| `coordenador-revisao` | ~2.000 |
| `critico` | ~3.000 |
| `critico-usuario` | ~3.000 |
| `testador` | ~4.000 |
| `auditor-seguranca` | ~2.500 |
| `otimizador` | ~3.000 |
| **Total estimado** | **~17.500** |

> A revisão pós-Tribunal deve ser enxuta, focada em M9/M12/M14 e na não-reincidência de C2/A3/M15.
