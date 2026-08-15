# 🔧 Soluções e Recomendações — Revisão Pós-Tribunal (ESS v3.0)

## Ações Imediatas

1. **Acionar `@coordenador-revisao` com `skill equipe-revisao`**
   - Foco: validar M9, M12 e M14.
   - Instrução obrigatória: descartar C2, A3 e M15 sem reabertura sem evidência factual.

2. **Executar validação local antes da revisão**
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
   - `npm run test`
   - Publicar logs em `/docs/testing/validacao-pos-tribunal.md`.

3. **Corrigir imprecisões no veredito do Tribunal**
   - Em `docs/audit/tribunal/2026-08-15_iteracao3/veredito.md`:
     - C2 = risco de colisão de ID (não ausência de workflows).
     - M10 = sincronização OpenRouter (não AuditPanel).

## Melhorias Estruturais

| Melhoria | Impacto estimado |
|---|---|
| Gatilho automático do Orquestrador para `equipe-revisao` quando correções pós-Tribunal estiverem prontas | Reduz 1 rodada de atraso (~1.000 tokens de observação) |
| Envio literal dos findings ao Tribunal (sem reformulação) | Reduz distorções (~10% de tokens de reconciliação) |
| Geração obrigatória de `relatorio-evolutivo.md` após veredito | Conformidade com protocolo |
| Checklist factual para revisores (grep, build, test) | Reduz alucinações em 30-50% |
| Registro de contador zerado após aprovação pós-Tribunal | Rastreabilidade |

## Redução de Risco de Novo Tribunal

- Se a revisão pós-Tribunal reprovar, o Tribunal será reconvocado e poderá emitir BLOQUEIO FINAL.
- Para minimizar esse risco:
  - Limitar escopo da revisão pós-Tribunal a M9, M12, M14.
  - Exigir evidência factual para qualquer novo finding Crítico/Alto.
  - Documentar ressalvas M1, M10, M13 como débito técnico aceito, se aplicável.

## Comunicação ao Orquestrador

> "Correções pós-Tribunal concluídas e verificadas. Pode acionar `@coordenador-revisao` + `skill equipe-revisao` para revisão final. Instruir revisores a descartar C2, A3, M15 e focar em M9, M12, M14."
