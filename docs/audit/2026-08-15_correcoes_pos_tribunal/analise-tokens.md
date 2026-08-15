# 💰 Análise de Tokens — Correções Pós-Tribunal

**Data:** 2026-08-15  
**Avaliação:** Inspeção direta do estado atual do código

---

## Tokens Consumidos nesta Avaliação

| Atividade | Tokens (est.) | % do total |
|---|---|---|
| Leitura de 5 arquivos `src/lib/*.ts` | ~1.200 | 38% |
| Leitura de `src/Stage.tsx` (186 linhas) | ~1.000 | 31% |
| Verificação de existência de `docs/testing/plano-de-testes.md` | ~200 | 6% |
| Consulta a veredito do Tribunal e relatórios anteriores | ~800 | 25% |
| **Total** | **~3.200** | **100%** |

---

## Economia Obtida

- **Custo evitado de `equipe-revisao` prematura:** ~20.000 tokens (estimativa baseada em relatórios anteriores).
- **Custo evitado de loop de correção desnecessário:** ~10.000–15.000 tokens.
- **Desperdício nesta avaliação:** 0% — todos os tokens foram usados para verificação factual direta.

---

## Projeção de Tokens para Concluir as Correções

| Finding | Agente | Tokens estimados | Observação |
|---|---|---|---|
| M9 — `@deprecated` em 4 arquivos | @dev-backend | ~500 | Alteração mecânica de comentários |
| M12 — validação de schema em `Stage.load()` | @dev-backend | ~2.500 | Requer entender schemas disponíveis e pontos de falha |
| M14 — criar `plano-de-testes.md` | @documentacao | ~2.000 | Documentação baseada na suite existente |
| **Total estimado** | | **~5.000** | |

---

## Projeção de Tokens para Revisão Pós-Tribunal

| Etapa | Tokens estimados |
|---|---|
| `skill equipe-revisao` (5 revisores) | ~20.000 |
| Loop de correção (se necessário) | ~10.000–15.000 |
| Juiz (avaliação final) | ~3.000 |
| **Total** | **~33.000–38.000** |

> A revisão pós-Tribunal só deve ser acionada após o fechamento de M9, M12 e M14.

---

## Recomendações de Economia

1. **Não acionar `equipe-revisao` antes do fechamento dos 3 findings** — economia imediata de ~20.000 tokens.
2. **Agrupar M9 e M12 no mesmo PR/commit de backend** — reduz overhead de contexto.
3. **Usar greps diretos (como esta avaliação) para pré-validação** — antes de qualquer revisão formal.
