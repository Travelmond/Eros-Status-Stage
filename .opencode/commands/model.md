---
description: Executa a PHASE of modeling architectural for a feature.
agent: architect
---

## Fluxo of modeling architectural
Você está atuando como @engineering-software-architect. Este comando executa APENAS a PHASE of modeling — sem escrever Code of production — for a feature: **$ARGUMENTS**. Use quando a spec já foi approved by @product-manager e você precisa of the arquitetura antes of delegar for os devs.

Execute os passos abaixo OBRIGATORIAMENTE in ordem:

1. **Leitura of Contexto:**
   - Read a spec approved in `docs/specs/$ARGUMENTS-spec.md`.
   - Confirme que o status é `✅ Approved`. Se não estiver approved, Notify o usuário e pare.
   - Read a arquitetura atual in `docs/specification-Completa-QRGen-API.md` for evitar conflitos.

2. **ADR (Architecture Decision Record):**
   - Se a feature introduz a decision architectural nova (ex: novo serviço, nova estratégia of cache, novo padrão of autenticação), documente:
     ```text
     ## ADR-[número]: [título]
     **decision:** [o que foi decidido]
     **Justificativa:** [por que — baseado in data, não in preferência]
     **Alternativas Rejeitadas:** [o que foi considerado e por que foi descartado]
     **Consequências:** [trade-offs aceitos]
     ```
   - Se não houver decision nova, pule esta etapa e informe.

3. **ERD Delta (apenas o que muda):**
   - Gere diagrama Mermaid with as tabelas NOVAS ou ALTERADAS apenas (não o ERD completo).
   - Inclua o SQL of migration correspondente, numerado sequencialmente (ex: `004_add_...sql`).

4. **Diagrama of sequence:**
   - Gere o fluxo principal (happy path) with todos os Participants (Frontend, API, DB, serviços externos).
   - Gere by menos 2 unhappy paths críticos no mesmo diagrama ou in diagrama separado.

5. **Diagrama of Componentes:**
   - Mostre a relação entre os novos componentes e os existentes.
   - Use Mermaid `graph LR` ou `graph TB`.

6. **Contrato of API:**
   - Liste todos os endpoints novos no formato:
     ```text
     MÉTODO  /caminho/of the/endpoint
     Auth: Bearer JWT (sim/não)
     Request: { campo: tipo, ... }
     Response 200: { campo: tipo, ... }
     Response of erro: [Code]: [motivo]
     ```

7. **Wireframe Textual (If any screen nova):**
   - Represente o layout in ASCII art.
   - Inclua estados: vazio, carregando, with data, with erro.

8. **Saída Final:**
   - Salve tudo in `docs/specs/$ARGUMENTS-arch.md`.
   - Exiba o painel:
     ```text
     ## 🏗️ modeling CONCLUÍDA — $ARGUMENTS
     ✅ ADR: [gerado / não necessário]
     ✅ ERD Delta: [N tabelas afetadas]
     ✅ Diagrama of sequence: [gerado]
     ✅ Diagrama of Componentes: [gerado]
     ✅ Contrato of API: [N endpoints]
     ✅ Wireframe: [gerado / não necessário]

     Próximo passo: /codar-backend $ARGUMENTS e /codar-frontend $ARGUMENTS
     ```

## Proibições
- ❌ Escrever Code Python ou JavaScript of production
- ❌ Sugerir change of stack ou tecnologia sem ADR Approved
- ❌ Modelar sem ter a spec with status ✅ Approved
- ❌ Deixar a diagrama of sequence sem tratar ao menos 2 unhappy paths