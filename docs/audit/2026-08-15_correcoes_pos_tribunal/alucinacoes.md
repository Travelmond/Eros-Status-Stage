# 🧠 Alucinações Detectadas — Correções Pós-Tribunal

**Data:** 2026-08-15

---

## Alucinações nas Correções

**Nenhuma alucinação detectada nesta rodada.**

Motivo: não houve execução de agentes de implementação ou revisão. A avaliação foi uma inspeção direta do filesystem. Portanto, não há afirmações falsas de agentes sobre código implementado.

---

## Alucinações Persistentes do Ciclo Anterior

| ID | Agente original | Natureza da alucinação | Status atual |
|---|---|---|---|
| C2 | Revisores (Tier 4) | Alegou risco de colisão de ID / workflows ausentes | ✅ Continua descartado pelo Tribunal |
| A3 | Revisores (Tier 4) | Alegou `var(--neon-${color})15` no código | ✅ Continua descartado; grep retorna 0 ocorrências |
| M15 | Revisores (Tier 4) | Alegou documentação de workflows inexistentes | ✅ Continua descartado |

---

## Distorções do Tribunal Não Corrigidas

| Documento | Distorção | Impacto nas correções |
|---|---|---|
| `veredito.md` | Descreve M10 como "AuditPanel não reage a toggles" | Nenhum impacto direto sobre M9/M12/M14, mas pode confundir correções futuras de M10 |
| `tribunal-01.md`, `comparativo.md` | Caracterizam C2 como "workflows ausentes" | Nenhum impacto sobre correções obrigatórias |

> Nota: estas distorções foram reportadas no relatório anterior do Juiz (`/docs/audit/2026-08-15_tribunal_iter3/`) e não afetam os critérios M9/M12/M14.

---

## Risco de Alucinação na Próxima Revisão

- **Alto risco de reincidência sobre C2/A3/M15** se os revisores não verificarem factualmente o filesystem.
- **Médio risco sobre M9** se o revisor não verificar **todos** os arquivos `src/lib/*.ts` (um deles já tem `@deprecated`, o que pode mascarar os 4 pendentes).
- **Baixo risco sobre M12/M14** — são verificações binárias (existe validação / existe arquivo).

---

## Recomendações

1. Ao reativar `equipe-revisao`, instruir explicitamente os revisores a **verificar todos os arquivos `src/lib/*.ts`**, não apenas amostras.
2. Exigir que C2, A3 e M15 sejam descartados automaticamente na próxima rodada, salvo nova evidência factual.
3. Documentar no veredito a descrição correta de M10 para evitar correções desviadas.
