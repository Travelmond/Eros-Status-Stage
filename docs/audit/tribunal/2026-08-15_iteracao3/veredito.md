# Veredito do Tribunal Supremo

**Projeto auditado:** Eros Stage Terminal (ESS) v3.0  
**Iteração:** 3ª revisão sem aprovação total  
**Data do veredito:** 2026-08-15  
**Status do Tribunal:** Convocado pelo Juiz

---

## Veredito Final

# ⚖️ NECESSITA APELAÇÃO / CORREÇÕES OBRIGATÓRIAS

O estado atual **não é ACEITÁVEL sem correções**, mas também **não justifica BLOQUEIO FINAL**.

---

## Justificativa consolidada

### 1. Findings factuaismente falsos configuram alucinação de revisores
- **C2** alega ausência de workflows de deploy. Verificação factual demonstra que `.github/workflows/deploy-dev.yml` e `.github/workflows/deploy.yml` existem e têm conteúdo válido.
- **A3** alega persistência de padrão CSS inválido `var(--neon-${color})15`. Verificação via `grep` retornou **zero ocorrências**.
- **M15** repete a premissa falsa de C2, alegando que a documentação descreve workflows inexistentes.

Esses findings são inconsistentes com a realidade do filesystem e do código. Configuram, no mínimo, erro de percepção baseado em snapshots desatualizados (alucinação de revisores).

### 2. Findings reais não justificam bloqueio total
Os seguintes findings são verdadeiros, mas constituem dívidas técnicas, não falhas funcionais:

- **M9** — `src/lib/*.ts` sem marcação `@deprecated`.
- **M12** — `Stage.load()` sem validação de schema; é defesa adicional, não bug ativo.
- **M14** — ausência de `docs/testing/plano-de-testes.md`.

Esses itens devem ser corrigidos antes do merge, mas isoladamente não justificam bloqueio final do projeto.

### 3. Findings médios devem ser tratados como ressalvas
- M1: cores hardcoded residuais.
- M10: AuditPanel não reage imediatamente a toggles.
- M13: NotificationToast não deduplica toasts.
- README desatualizado sobre testes.

São itens de polimento e qualidade. Podem ser endereçados em correção ou registrados como débito técnico, sem bloquear o merge.

### 4. Métricas objetivas são favoráveis
- `npm run typecheck`: ✅ passou
- `npm run lint`: ✅ passou
- `npm run build`: ✅ passou
- `npm run test`: ✅ 34 testes passando

As métricas objetivas indicam que o sistema está funcional e estável sob os critérios automatizados disponíveis.

---

## Decisões por finding

| ID | Decisão do Tribunal |
|---|---|
| C2 | Descartado — finding falso |
| A3 | Descartado — finding falso |
| M9 | Obrigatório corrigir antes de merge |
| M12 | Reclassificado para Médio; corrigir antes de merge |
| M14 | Obrigatório corrigir antes de merge |
| M15 | Descartado — finding falso |
| M1, M10, M13, README | Ressalvas — polimento/documentação |

---

## Próximos passos

1. **Orquestrador** deve corrigir:
   - Adicionar `@deprecated` aos re-exports em `src/lib/*.ts` (M9).
   - Adicionar validação de schema em `Stage.load()` ou documentar risco aceito (M12).
   - Criar `docs/testing/plano-de-testes.md` (M14).

2. **Revisores Tier 4** devem:
   - Revalidar factualmente todos os findings antes de reprovar.
   - Descartar C2, A3 e M15 definitivamente.

3. **Após correções**, reativar `skill equipe-revisao`.
   - Se 3ª iteração após esta apelação também falhar, o Tribunal será reconvocado e poderá emitir BLOQUEIO FINAL.

---

## Resumo dos sub-tribunais

| Sub-Tribunal | Conclusão principal |
|---|---|
| @tribunal-01 | Base lógica da reprovação está contaminada por premissas falsas (C2, A3, M15) |
| @tribunal-02 | 40% dos findings críticos/altos são factuaismente falsos; há padrão de checklist desatualizado |
| @tribunal-03 | Vieses de confirmação, inflação de severidade e pessimismo distorcem a avaliação |
| @tribunal-04 | Bloqueio total é desproporcional; o caminho simples é corrigir dívidas técnicas reais |
| @tribunal-05 | Governança do Tribunal foi respeitada; revisores não cumpriram obrigação de factualidade |

---

## Nota final

O Tribunal reconhece que há dívidas técnicas reais a serem sanadas. Contudo, a presença de findings factuaismente incorretos entre os itens de maior severidade impede um veredito de INACEITÁVEL fundamentado apenas nas evidências verdadeiras. Por isso, concede ao Orquestrador a oportunidade de apelação mediante correções obrigatórias.

**Assinado:** Tribunal Supremo  
**Estado após veredito:** Retorna ao estado dormente até nova convocação.
