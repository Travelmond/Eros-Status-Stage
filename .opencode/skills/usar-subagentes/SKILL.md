---
name: usar-subagentes
description: "Instruções para quando e como acionar sub-agentes para tarefas simples. Use quando a tarefa envolve 1-2 arquivos e não requer nova arquitetura."
license: MIT

compatibility: opencode

---

# Skill: Usar Sub-agentes

## Objetivo

Determinar quando uma tarefa é simples o suficiente para ser resolvida com sub-agentes focados, e como acioná-los corretamente.

## Quando Usar

Use esta skill quando o Orquestrador recebe uma tarefa e precisa decidir se ela é simples ou complexa.

### Tarefa Simples (use sub-agentes)
- Envolve 1-2 arquivos
- Não requer nova arquitetura
- É uma correção, ajuste ou pequena feature
- Não tem dependências entre múltiplas camadas
- Pode ser resolvida por um único especialista

### Tarefa Complexa (use `usar-equipes`)
- Envolve múltiplos arquivos/camadas
- Require nova arquitetura
- É uma feature grande ou novo sistema
- Tem dependências entre frontend, backend e banco
- Precisa de planejamento detalhado

## Processo

1. **Analisar a tarefa recebida**
   - Quantos arquivos serão afetados?
   - Há mudança de arquitetura?
   - Há dependências entre camadas?

2. **Se simples:**
   - Identificar qual arquiteto especialista é responsável
   - Invocar `@arquiteto-geral` com contexto completo
   - Arquiteto-Geral delega para o Tier 2 apropriado
   - Tier 2 delega para Tier 3

3. **Após implementação:**
   - Orquestrador invoca `@coordenador-revisao` automaticamente

## Mapeamento de Tarefas Simples

| Tipo de Tarefa | Arquiteto Responsável |
|---|---|
| Bug de frontend | `@arquiteto-ui-ux` → `@dev-frontend` |
| Bug de backend | `@arquiteto-backend` → `@dev-backend` |
| Bug de banco | `@arquiteto-banco-de-dados` → `@dev-banco-de-dados` |
| Atualizar doc | `@documentacao` |
| Corrigir segurança | `@auditor-seguranca` identifica → `@arquiteto-backend` corrige |

## Output Esperado

- Tarefa classificada como simples
- Sub-agente correto identificado
- Contexto completo passado ao sub-agente
- Revisão automática ativada após implementação