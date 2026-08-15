:# 🧠 Alucinações — Tribunal Iter 3 (ESS v3.0)

**Data:** 2026-08-15  
**Pasta:** `/docs/audit/2026-08-15_tribunal_iter3/`

---

## Alucinações dos Revisores (Iteração 3/3)

| ID | Alegação | Verificação Factual | Severidade |
|---|---|---|---|
| **C2** | Workflow `deploy-dev.yml` usa ID de produção / falta validação de `CHUB_EXTENSION_ID_DEV` | Workflow usa `CHUB_EXTENSION_ID_DEV` e falha se vazio. Não usa ID de produção. | 🔴 Crítico (falso) |
| **A3** | Regressão de padrão CSS `var(--color)NN` | `grep -R "var(--[a-z-]+)[0-9]" src/` retornou 0 ocorrências. | 🔴 Crítico (falso) |
| **M15** | Documentação de deploy descreve workflows inexistentes | `.github/workflows/deploy-dev.yml` e `deploy.yml` existem. | 🟡 Médio (falso) |

---

## Distorções / Alucinações do Próprio Tribunal

| ID | Onde ocorreu | Alegação do Tribunal | Realidade | Severidade |
|---|---|---|---|---|
| **C2** | `tribunal-01.md`, `veredito.md`, `comparativo.md` | “Workflows de deploy ausentes” | O finding original era risco de colisão de ID, não ausência de arquivos. | 🟠 Alto (distorção) |
| **M10** | `veredito.md` | “AuditPanel não reage imediatamente a toggles” | O finding original era sincronização inconsistente de `openRouterModel`/`openRouterApiKey` entre painéis de config. | 🟠 Alto (distorção) |

---

## Findings Reais Confirmados

| ID | Descrição | Verificação | Status no Tribunal |
|---|---|---|---|
| M9 | `src/lib/*.ts` sem `@deprecated` | Arquivos são re-exports sem anotação `@deprecated`. | ✅ Corretamente identificado como dívida técnica real. |
| M12 | `Stage.load()` não valida `initialData` com schema | `load()` retorna estados recebidos sem validação. | ✅ Corretamente identificado; severidade reclassificada para Médio. |
| M14 | `docs/testing/plano-de-testes.md` ausente | Arquivo não existe. | ✅ Corretamente identificado como dívida técnica real. |
| M1 | Cores hardcoded residuais | `text-gray-*`, `#ffffff60`, `bg-black/30` encontrados. | ✅ Real, mas não verificado pelo Tribunal antes de classificar como ressalva. |
| M13 | `NotificationToast` sem deduplicação/debounce | Não há lógica de deduplicação. | ✅ Real, mas não verificado pelo Tribunal antes de classificar como ressalva. |

---

## Nota

O Tribunal cumpriu seu papel ao identificar as alucinações dos revisores. No entanto, seus próprios documentos contêm distorções que, embora não alterem o veredito final, devem ser corrigidas para evitar execução equivocada das correções.
