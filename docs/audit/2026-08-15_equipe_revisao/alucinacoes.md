# 🧠 Alucinações Detectadas — Observação `equipe-revisao`

## Resumo
- **Alucinações confirmadas nos findings da skill:** 0.
- **Motivo:** a skill `equipe-revisao` não foi executada; nenhum finding foi produzido pelos revisores.

## Riscos Latentes Não Auditados
Sem a execução da skill, os seguintes riscos de alucinação permanecem sem validação:

1. **Persistência de estado crítico**  
   - Implementações T01/T02 utilizam `localStorage`. A skill deveria confirmar se apenas preferências locais são persistidas, conforme decisão de arquitetura.

2. **Mock de tipos do Chub**  
   - `src/types/chub.ts` re-exporta tipos de `@chub-ai/stages-ts`. A revisão deveria validar se os tipos espelham corretamente a API real do StageBase.

3. **Endpoint de deploy**  
   - O contrato T04 cita `api.chub.ai/extension/{id}/upload`. A `equipe-revisao` deveria auditar se esse endpoint e payload estão corretos.

4. **API key no config_schema**  
   - `openRouterApiKey` está marcada como `secret: true`. A revisão de segurança deveria confirmar que não há vazamento no bundle ou em logs.

## Recomendação
Acionar a `equipe-revisao` para converter riscos latentes em findings auditáveis e mensuráveis.
