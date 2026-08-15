# 🧠 Alucinações Detectadas — Revisão Pós-Tribunal (ESS v3.0)

## Alucinações dos Revisores (Iteração 3)

### C2 — Risco de colisão de ID no deploy dev
- **Agente:** `critico`
- **Finding:** `.github/workflows/deploy-dev.yml` usaria `CHUB_EXTENSION_ID` de produção, permitindo que pushes em `dev` sobrescrevessem a extensão estável.
- **Verificação factual:** o workflow usa `secrets.CHUB_EXTENSION_ID_DEV` e falha se o secret estiver vazio. Não há fallback para `CHUB_EXTENSION_ID`.
- **Tipo:** alucinação de estado/percepção baseada em snapshot desatualizado.
- **Severidade:** Alta (foi classificado como Crítico).

### A3 — Regressão de CSS inline inválido
- **Agentes:** `critico-usuario`, `otimizador`
- **Finding:** padrões `var(--color)NN` e classes Tailwind arbitrárias com `color-mix(...)` sem underscore teriam retornado.
- **Verificação factual:** `grep -R "var(--color)[0-9]" src/` retorna zero ocorrências. Não há evidência de regressão.
- **Tipo:** alucinação de regressão/falso positivo.
- **Severidade:** Alta.

### M15 — Documentação descrevendo workflows inexistentes
- **Agentes:** `critico`, `otimizador`
- **Finding:** documentação descreveria workflows de deploy que não existem.
- **Verificação factual:** `.github/workflows/deploy-dev.yml` e `.github/workflows/deploy.yml` existem e têm conteúdo válido.
- **Tipo:** alucinação de ausência.
- **Severidade:** Média.

---

## Distorções do Tribunal

### C2 reformulado como "workflows ausentes"
- **Fonte:** `veredito.md`, `tribunal-01.md`, `comparativo.md`
- **Problema:** o Tribunal descreve C2 como se os revisores tivessem alegado ausência de workflows, quando na verdade alegaram risco de colisão de ID.
- **Impacto:** a conclusão (C2 inválido) está correta, mas a fundamentação pode confundir a execução futura.

### M10 reformulado como problema de AuditPanel
- **Fonte:** `veredito.md`
- **Problema:** o Tribunal descreve M10 como "AuditPanel não reage imediatamente a toggles", quando o finding original tratava de sincronização inconsistente de `openRouterModel`/`openRouterApiKey` entre `AIProviderSection`, `AIConfigPanel` e `ConfigPanel`.
- **Impacto:** risco de correção direcionada ao componente errado.

---

## Risco de Reincidência na Revisão Pós-Tribunal

| Finding | Risco de reincidência | Mitigação |
|---|---|---|
| C2 | Médio | Instruir revisores a inspecionar `deploy-dev.yml` antes de reprovar |
| A3 | Médio | Exigir `grep` com evidência factual |
| M15 | Baixo | Workflows estão documentados e existem |
| M1, M10, M13 | Baixo a Médio | Classificados como ressalvas pelo Tribunal |

---

## Recomendação

Antes de acionar a revisão pós-Tribunal, o `@coordenador-revisao` deve receber instrução explícita:

> "C2, A3 e M15 foram descartados pelo Tribunal como alucinações. Não reabrir sem evidência factual nova (logs, diffs, grep). Foco da revisão: M9, M12 e M14."
