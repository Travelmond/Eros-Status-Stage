# 💰 Análise de Tokens — Correções Tier 3 pós-Revisão 1/3

## Consumo Observado (esta avaliação)
| Atividade | Tokens (est.) | % do total |
|---|---|---|
| Leitura de relatório de revisão anterior (`2026-08-15_correcoes_revisao/`) | ~1.200 | 25% |
| Leitura de `implementacao.md`, `tarefas.md`, relatório de revisão | ~1.000 | 21% |
| Greps em `Stage.tsx`, `ErosTerminal.tsx`, `ConfigPanel.tsx`, `package.json` | ~1.500 | 31% |
| Verificação de existência de `.github/workflows/` | ~300 | 6% |
| Geração dos relatórios de auditoria | ~800 | 17% |
| **Total** | **~4.800** | **100%** |

## Consumo Esperado (correções Tier 3)
| Agente | Tarefa | Tokens estimados |
|---|---|---|
| @dev-backend | C1 (testes) + C3/A4/A5 (localStorage/stages-ts) | ~8.000 |
| @dev-frontend | A1/A2/A3 (NTR wiring, callbacks, CSS) | ~5.500 |
| @devops | C2 (workflows separados dev/main) | ~3.000 |
| @documentacao | README + docs de deploy/testes | ~2.000 |
| @dev-banco-de-dados | M6 (`state_schema.message.required`) | ~1.000 |
| **Total estimado** | | **~19.500** |

## Desperdício Identificado
- **~4.800 tokens** gastos para constatar ausência de ação corretiva — redundante com relatório anterior (`2026-08-15_correcoes_revisao/`).
- Causa raiz: Orquestrador não acionou `@arquiteto-geral` após a reprovação, forçando nova observação do Juiz sobre o mesmo estado.

## Otimizações Propostas
1. **Gatilho automático do `@arquiteto-geral`** após reprovação da `equipe-revisao` — economia de ~4.800 tokens por rodada de observação ociosa.
2. **Checklist pré-correção** em `tarefas.md` — evita re-leitura dos mesmos findings.
3. **Consolidação de greps** em um único comando automatizado — reduz ~30% dos tokens de verificação.
