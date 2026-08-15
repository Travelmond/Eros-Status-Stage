# 💰 Análise de Tokens — Tribunal Iter 3 (ESS v3.0)

**Data:** 2026-08-15  
**Pasta:** `/docs/audit/2026-08-15_tribunal_iter3/`

---

## Tokens Gastos

| Atividade | Tokens (est.) | Observação |
|---|---|---|
| Leitura dos 5 sub-tribunais + veredito + comparativo | ~3.000 | 5 arquivos de análise + consolidados |
| Leitura do relatório de revisão iter3 | ~1.000 | `/docs/testing/revisao-2026-08-15_iteracao3.md` |
| Greps factuais (C2, A3, M1, M9, M10, M13, M14) | ~2.000 | Verificação de workflow, CSS, lib, cores, AuditPanel, Toast, plano de testes |
| Elaboração dos relatórios do Juiz | ~1.500 | Síntese e recomendações |
| **Total** | **~7.500** | |

---

## Distribuição por Agente (estimada)

| Agente | Tokens (est.) | Observação |
|---|---|---|
| tribunal-01..05 (conjunto) | ~3.500 | Análises dos sub-tribunais |
| tribunal (consolidação) | ~1.000 | veredito.md + comparativo.md |
| juiz | ~7.500 | Esta auditoria |

---

## Desperdício

- **Desperdício estimado: ~10%** (~750 tokens).
- **Causa:** tokens extras gastos para reconciliar distorções do Tribunal (C2 descrito como “workflows ausentes”, M10 descrito como “AuditPanel”) com o texto original do relatório iter3.
- **Potencial de economia:** se o Tribunal citasse os findings literalmente, a verificação factual seria mais curta.

---

## Economia Possível

1. **Template de dados crus padronizado** — Juiz envia tabela literal dos findings. Impacto: ~20% de redução na reconciliação.
2. **Geração obrigatória de `relatorio-evolutivo.md`** — evita dupla verificação manual. Impacto: ~10%.
3. **Sub-tribunais devem limitar-se a análise, não reformulação** — reduz distorções. Impacto: ~15%.
