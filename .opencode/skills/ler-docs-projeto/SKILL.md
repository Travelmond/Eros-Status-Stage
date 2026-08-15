---
name: ler-docs-projeto
description: "Lê a documentação /docs do projeto atual, organizada por categoria (requirements, architecture, design, testing, deployment)."
license: MIT

compatibility: opencode

---

# Skill: Ler Docs do Projeto

## Objetivo

Ler e compreender a documentação completa do projeto atual, organizada em `/docs` por categoria.

## Quando Usar

- Quando se precisa entender o estado da documentação do projeto
- Quando se precisa referenciar requisitos ou arquitetura durante implementação
- Como parte da skill `ler-contexto-projeto`

## Processo

1. **Verificar existência de `/docs`**
   - Se não existe → reportar que não há documentação
   - Se existe → prosseguir

2. **Ler por categoria:**

   ### `/docs/requirements/`
   - `DER.md` — Documento de Especificação de Requisitos
   - `proposal.md` — Proposta
   - `briefing.md` — Briefing
   - `scope.md` — Escopo

   ### `/docs/architecture/`
   - `software-architecture.md` — Documento de Arquitetura
   - `class-diagrams.md` — Diagramas UML de Classe
   - `sequence-diagrams.md` — Diagramas de Sequência
   - `erd.md` — Diagrama Entidade-Relacionamento
   - `component-diagrams.md` — Diagramas de Componentes

   ### `/docs/design/`
   - `wireframes.md` — Wireframes
   - `mockups.md` — Mockups
   - `user-flows.md` — Fluxos de Usuário
   - `component-states.md` — Estados de Componentes

   ### `/docs/testing/`
   - `test-plan.md` — Plano de Testes
   - `test-cases.md` — Casos de Teste
   - `test-results.md` — Resultados de Testes

   ### `/docs/deployment/`
   - `deployment-guide.md` — Guia de Deploy
   - `ci-cd-pipeline.md` — Pipeline CI/CD

3. **Sintetizar informações**
   - Resumir o que está documentado
   - Identificar o que está faltando
   - Identificar contradições

4. **Retornar resumo**
   - Status da documentação por categoria
   - Pontos de atenção
   - Recomendações

## Output Esperado

- Documentação lida por categoria
- Resumo do que está documentado
- Identificação de lacunas
- Recomendações de atualização