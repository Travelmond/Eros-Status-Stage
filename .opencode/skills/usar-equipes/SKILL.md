---
name: usar-equipes
description: "Instruções para quando e como coordenar equipes de agentes para tarefas complexas. Use quando a tarefa requer nova arquitetura ou múltiplas camadas."
license: MIT

compatibility: opencode

---

# Skill: Usar Equipes

## Objetivo

Determinar quando uma tarefa é complexa o suficiente para requerer coordenação de equipes, e como orquestrar múltiplos agentes em paralelo.

## Quando Usar

Use esta skill quando o Orquestrador recebe uma tarefa complexa que requer planejamento e coordenação de múltiplas equipes.

### Critérios de Tarefa Complexa
- Envolve múltiplos arquivos/camadas
- Require nova arquitetura
- É uma feature grande ou novo sistema
- Tem dependências entre frontend, backend e banco
- Precisa de planejamento detalhado
- Requer perguntas ao usuário

## Processo

1. **Ativar planejamento**
   - Invocar `@planejador-primario`
   - Planejador ativa skill `categorizar-perguntas`
   - Fazer perguntas em 5 categorias (Escopo, Stack, Usuários, Dados, Infra)
   - Aguardar aprovação do usuário

2. **Distribuir para arquitetos**
   - Invocar `@arquiteto-geral` com plano aprovado
   - Arquiteto-Geral delega para Tier 2:
     - `@arquiteto-ui-ux` → lidera frontend + UX
     - `@arquiteto-backend` → lidera APIs + lógica
     - `@arquiteto-banco-de-dados` → lidera schema + DB

3. **Coordenação entre equipes**
   - Arquitetos conversam entre si para alinhar contratos
   - Frontend ↔ Backend: contratos de API
   - Backend ↔ Banco: modelo de dados
   - UI/UX ↔ Backend: viabilidade técnica

4. **Implementação paralela**
   - Cada Tier 2 delega para seu Tier 3
   - `@dev-frontend`, `@dev-backend`, `@dev-banco-de-dados` trabalham em paralelo
   - `@documentacao` documenta tudo em `/docs`

5. **Revisão automática**
   - Orquestrador invoca `@coordenador-revisao`
   - Ativa todos os Tier 4 em paralelo
   - Loop de correção até aprovação

## Estrutura de Equipe

```
Orquestrador (T0)
└── @arquiteto-geral (T1)
    ├── @arquiteto-ui-ux (T2) → @dev-frontend (T3) + @documentacao (T3)
    ├── @arquiteto-backend (T2) → @dev-backend (T3) + @documentacao (T3)
    └── @arquiteto-banco-de-dados (T2) → @dev-banco-de-dados (T3) + @documentacao (T3)

@coordenador-revisao (T1) — em paralelo após implementação
├── @critico (T4)
├── @critico-usuario (T4)
├── @testador (T4)
├── @auditor-seguranca (T4)
└── @otimizador (T4)
```

## Regras

- **SEMPRE planeje antes** — Tarefa complexa requer `@planejador-primario`
- **SEMPRE aguarde aprovação** do usuário antes de implementar
- **COORDENE contratos** entre arquitetos antes de implementar
- **IMPLEMENTE em paralelo** quando não houver dependências
- **REVISE automaticamente** após implementação

## Output Esperado

- Plano aprovado pelo usuário
- Equipes distribuídas corretamente
- Contratos alinhados entre camadas
- Implementação paralela executada
- Revisão automática ativada