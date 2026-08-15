# 💰 Análise de Tokens — Correções Iter2 → Iter3

## Tokens Estimados por Atividade

| Atividade | Tokens (est.) | Observação |
|---|---|---|
| Leitura relatório de revisão iter2 | ~1.800 | `/docs/testing/revisao-2026-08-15_iteracao2.md` (142 linhas) |
| Leitura `implementacao.md`, `tarefas.md`, `tech-debt.md` | ~2.200 | Estados contraditórios exigiram re-leitura |
| Inspeção de 15+ arquivos-fonte | ~4.000 | `AIConfigPanel.tsx`, `ErosTerminal.tsx`, `Stage.tsx`, `NeonProgressBar.tsx`, `AuditPanel.tsx`, `ConfigPanel.tsx`, `NotificationToast.tsx`, `src/lib/*.ts`, `package.json`, `chub_meta.yaml`, docs de deploy |
| Greps direcionados | ~1.000 | Validação de `@deprecated`, `requestAnimationFrame`, schema validation, wiring `onConfigChange` |
| Redação dos relatórios | ~500 | 5 arquivos em `/docs/audit/2026-08-15_correcoes_iter3/` |
| **Total estimado** | **~9.500** | |

## Desperdício Identificado

| Causa | Tokens desperdiçados (est.) | % do total |
|---|---|---|
| Reconciliação docs vs. código (A4) | ~1.800 | 19% |
| Inspeção cruzada A6 (`AIConfigPanel` vs. `ErosTerminal`) | ~1.500 | 16% |
| Verificação de M11 obsoleto | ~800 | 8% |
| Procura por `plano-de-testes.md` inexistente | ~400 | 4% |
| **Total desperdício** | **~4.500** | **~47%** |

## Fontes de Economia

1. **Sincronização obrigatória pós-correção:** se `sync-context` tivesse atualizado `tech-debt.md` após a mudança de `package.json`, economizaria ~1.800 tokens de reconciliação.
2. **Revisão cruzada pelo `@arquiteto-geral`:** verificar se o componente pai passa as novas props economizaria ~1.500 tokens de inspeção duplicada.
3. **Execução de build/typecheck com log:** evitaria re-verificação manual de compatibilidade de tipos (~1.000 tokens).
4. **Condição de guarda para `equipe-revisao`:** não reativar a revisão até todos os findings estarem fechados evita rodada extra de revisores (~5.000–8.000 tokens).

## Recomendação

Estabelecer que toda correção de Tier 3 deva:
- Atualizar o arquivo de gerenciamento correspondente (`tech-debt.md`, `tarefas.md` ou `implementacao.md`).
- Incluir evidência de build/typecheck/testes quando afetar dependências ou tipos.
- Ser validada pelo `@arquiteto-geral` antes de reativação da `equipe-revisao`.
