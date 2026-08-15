---
description: "Gera documentação completa do projeto em /docs: DER, arquitetura, wireframes, diagramas, README."
agent: documentacao

subtask: true

---

## Processo

1. **Identificar tipo de documentação necessária**
   - Se argumento fornecido, usar como tipo
   - Se não, gerar documentação completa

2. **Gerar documentos por categoria:**

   ### `/docs/requirements/`
   - `DER.md` — Documento de Especificação de Requisitos
   - `proposal.md` — Proposta
   - `briefing.md` — Briefing
   - `scope.md` — Escopo

   ### `/docs/architecture/`
   - `software-architecture.md` — Documento de Arquitetura
   - `class-diagrams.md` — Diagramas UML de Classe (Mermaid)
   - `sequence-diagrams.md` — Diagramas de Sequência (Mermaid)
   - `erd.md` — Diagrama Entidade-Relacionamento (Mermaid)
   - `component-diagrams.md` — Diagramas de Componentes (Mermaid)

   ### `/docs/design/`
   - `wireframes.md` — Wireframes (ASCII)
   - `mockups.md` — Mockups
   - `user-flows.md` — Fluxos de Usuário (Mermaid)
   - `component-states.md` — Estados de Componentes

   ### `/docs/testing/`
   - `test-plan.md` — Plano de Testes
   - `test-cases.md` — Casos de Teste

   ### `/docs/deployment/`
   - `deployment-guide.md` — Guia de Deploy
   - `ci-cd-pipeline.md` — Pipeline CI/CD

3. **Atualizar README.md na raiz do projeto**

4. **Salvar todos os documentos em Markdown + Mermaid**