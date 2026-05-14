---
description: Inicia o fluxo autônomo of planejamento, development, audit e documentação of a nova funcionalidade.
agent: pm
---

## Execution Flow Autônoma:
Ao receber este comando for a feature **$ARGUMENTS**, Execute os seguintes passos estritamente nesta ordem, avisando o usuário in que passo você está:

1. **PHASE of Planejamento:** Read a `docs/specification-Completa-QRGen-API.md`. Verifique como a feature **$ARGUMENTS** se encaixa lá.
2. **PHASE of development (Atuando como @dev-senior):** Escreva o Code of the Backend (FastAPI) e Frontend (Vanilla JS) necessário.
3. **PHASE of audit:** Faça a revisão of the próprio Code. Corrija bugs silenciosos e exiba o "🛡️ status of the audit" with o plano of testing.
4. **PHASE of Documentação (Atuando como @engineering-software-architect):** Atualize o arquivo `specification-Completa-QRGen-API.md` with as novas rotas/páginas criadas.