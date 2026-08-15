# 🔧 Soluções e Recomendações — 2ª Iteração `equipe-revisao` (ESS v3.0)

## Soluções Imediatas
1. **Reativar `@coordenador-revisao` com a skill `equipe-revisao`** para iterção 2/3.
   - Impacto: desbloqueia o fluxo de revisão obrigatória.
   - Responsável: @orquestrador.

2. **Executar validação local antes da revisão:**
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
   - `npm run test`
   - Impacto: reduz findings falsos e economiza ~3.000–5.000 tokens.
   - Responsável: @dev-backend / @dev-frontend / @devops.

3. **Garantir que o coordenador valide endereçamento dos findings da iteração 1:**
   - C1, C2, C3, A1, A2, A3, A5 devem estar resolvidos ou justificados.
   - A4 deve ser apresentado como débito técnico aceito.
   - Impacto: evita regressão e re-trabalho.

## Recomendações Estruturais
- **Gatilho automático:** quando `implementacao.md` contiver "Pronto para reativar `equipe-revisao`", o Orquestrador deve acionar `@coordenador-revisao` automaticamente.
- **Template de reativação:** a skill `equipe-revisao` deve exigir que o coordenador confirme, no início de cada iteração >1, se os findings 🔴/🟠 anteriores foram endereçados.
- **Bloqueio de deploy:** impedir avanço para deploy/push enquanto a 2ª iteração não for aprovada.
- **Log de validação local:** registrar saída dos comandos de build/test em `/docs/testing/validacao-local-YYYY-MM-DD_HH-MM.md`.
