# Relatório de Revisão — Eros Status Terminal v3.0

**Data:** 2026-08-15  
**Iteração:** 2/3  
**Coordenador:** @coordenador-revisao  
**Status:** ❌ REPROVADO (findings altos e médios pendentes)

## Resumo Executivo

A segunda iteração de revisão auditou as correções aplicadas após a reprovação da iteração 1/3. Os findings críticos (C1–C3) e a maioria dos findings altos (A1–A3, A5) foram endereçados de forma satisfatória. No entanto, dois findings altos (A4, A6) e sete findings médios (M9–M15) permanecem pendentes, impedindo a aprovação. O coordenador recomenda a correção imediata e reativação da `equipe-revisao` para a iteração 3/3. Caso a iteração 3/3 também reprove, o Juiz deverá convocar o Tribunal conforme protocolo de governança.

## Vereditos Tier 4

| Revisor | Veredito | Observação |
|---|---|---|
| @critico-usuario | REPROVADO | Falta de clareza nas configurações de AI e validação real do provider. |
| @critico | REPROVADO | A4 e A6 bloqueantes; M9-M15 acumulam dívida técnica. |
| @testador | REPROVADO | Build e testes passam, mas cenários de integração do AIConfigPanel falham. |
| @auditor-seguranca | REPROVADO | A6 expõe potencial vazamento de configuração sensível no fallback. |
| @otimizador | REPROVADO | M11-M15 indicam oportunidades de performance não implementadas. |

## Findings Críticos

Nenhum. Todos os findings críticos da iteração 1 (C1–C3) foram resolvidos.

## Findings Altos

### A4 — `@chub-ai/stages-ts` ainda desatualizado

**Severidade:** Alta  
**Responsável sugerido:** @arquiteto-backend → @dev-backend  
**Status:** Pendente

A dependência `@chub-ai/stages-ts` permanece na versão `^0.3.7`, mesmo após documentação de débito técnico em `docs/architecture/tech-debt.md`. A biblioteca oficial já possui versões intermediárias compatíveis com React 18. A atualização direta para `^0.5.2` é bloqueada pela dependência de React 19, mas a versão `^0.4.0` é compatível com React 18 e deve ser adotada como passo intermediário.

**Critério de aceite:**
- Atualizar `package.json` para `@chub-ai/stages-ts: ^0.4.0`.
- Executar `npm install` e resolver conflitos de tipos.
- Ajustar `src/types/chub.ts`, `src/Stage.tsx` e demais consumidores para a API da v0.4.0.
- Garantir que `npm run typecheck`, `npm run lint`, `npm run build` e `npm run test` passem.
- Atualizar `docs/architecture/tech-debt.md` para refletir a nova situação.

### A6 — `AIConfigPanel` não realiza extração real de configuração do provider

**Severidade:** Alta  
**Responsável sugerido:** @arquiteto-ui-ux → @dev-frontend  
**Status:** Pendente

O componente `AIConfigPanel` renderiza campos de configuração do OpenRouter (modelo, API key, temperatura), mas não extrai nem persiste o estado real do provider. O formulário opera com estado local isolado; alterações não são propagadas para o `ConfigType` do StageBase nem para o `openRouterService`. Isso faz com que o usuário configure o provider na UI, mas o Stage continue usando valores padrão ou inválidos. O testador identificou que, após salvar, `afterResponse` chama o serviço com `model: undefined` quando deveria refletir a seleção do usuário.

**Critério de aceite:**
- `AIConfigPanel` deve receber `config` e `onConfigChange` via props.
- Campos de modelo, API key e parâmetros devem refletir `config.openRouter.*`.
- Alterações devem chamar `onConfigChange({ openRouter: { ... } })` e ser propagadas para `Stage.tsx`.
- `openRouterService` deve consumir `config.openRouter.model` e `config.openRouter.apiKey` em tempo de execução.
- Adicionar teste de integração mínimo que simule a alteração de modelo e verifique a propagação.

## Findings Médios

### M9 — `src/lib/` ainda contém stubs não deprecados

**Severidade:** Média  
**Responsável sugerido:** @dev-backend

Os stubs em `src/lib/erosParser.ts`, `src/lib/sexPositionsLibrary.ts`, `src/lib/relationshipSystem.ts`, `src/lib/consistencyAuditor.ts` e `src/lib/memoryService.ts` foram criados apenas para compilação, mas não estão marcados como `@deprecated` e podem ser confundidos com implementações reais. Deve-se adicionar `@deprecated` e um comentário indicando o módulo oficial correspondente.

### M10 — `AuditPanel` não exibe findings em tempo real

**Severidade:** Média  
**Responsável sugerido:** @dev-frontend

O painel de auditoria renderiza apenas o resultado da última auditoria armazenado em `messageState`. Não há atualização reativa quando o usuário alterna toggles de auditor no `ConfigPanel`.

### M11 — `NeonProgressBar` usa `requestAnimationFrame` sem cleanup em todos os caminhos

**Severidade:** Média  
**Responsável sugerido:** @dev-frontend

O componente `NeonProgressBar` inicia animações via `requestAnimationFrame`, mas em alguns caminhos de unmount o ID do frame não é cancelado, causando warnings no console e potencial vazamento de memória.

### M12 — `Stage.tsx` não valida `initialData` com schema antes de usar

**Severidade:** Média  
**Responsável sugerido:** @dev-backend

O método `load()` do StageBase recebe `initialData`, mas não valida se o objeto está de acordo com `init.schema_version` nem com `state_schema`. Dados corrompidos podem propagar silenciosamente.

### M13 — `NotificationToast` enfileira toasts idênticos sem debounce

**Severidade:** Média  
**Responsável sugerido:** @dev-frontend

Múltiplas notificações idênticas podem ser enfileiradas em sequência, poluindo a interface. Deve-se agrupar ou aplicar debounce de 2s para mensagens iguais.

### M14 — `docs/testing/plano-de-testes.md` desatualizado

**Severidade:** Média  
**Responsável sugerido:** @documentacao

O plano de testes não reflete a suite Vitist adicionada na iteração 1 nem os critérios de aceite do T04. Deve ser atualizado com os casos de teste existentes e os próximos cenários de integração.

### M15 — `chub_meta.yaml` não declara `config_schema.openRouter.apiKey` como `secret: true` de forma explícita para todos os ambientes

**Severidade:** Média  
**Responsável sugerido:** @devops / @arquiteto-banco-de-dados

Embora a flag `secret: true` esteja presente, a documentação de deploy não instrui como o Chub trata secrets em staging vs. produção. Deve-se complementar `docs/deployment/github-actions.md` e `docs/deployment/branch-strategy.md`.

## Findings Baixos

Nenhum novo finding baixo registrado nesta iteração. Os findings baixos da iteração 1 foram parcialmente endereçados.

## Atribuições de Correção

| Finding | Severidade | Responsável | Arquivos afetados |
|---|---|---|---|
| A4 | Alto | @arquiteto-backend → @dev-backend | `package.json`, `package-lock.json`, `src/types/chub.ts`, `src/Stage.tsx`, `docs/architecture/tech-debt.md` |
| A6 | Alto | @arquiteto-ui-ux → @dev-frontend | `src/components/terminal/AIConfigPanel.tsx`, `src/components/terminal/ErosTerminal.tsx`, `src/services/openRouter.ts`, `src/types/config.ts` |
| M9 | Médio | @dev-backend | `src/lib/*.ts` |
| M10 | Médio | @dev-frontend | `src/components/terminal/AuditPanel.tsx`, `src/components/terminal/ConfigPanel.tsx` |
| M11 | Médio | @dev-frontend | `src/components/terminal/NeonProgressBar.tsx` |
| M12 | Médio | @dev-backend | `src/Stage.tsx` |
| M13 | Médio | @dev-frontend | `src/components/terminal/NotificationToast.tsx` |
| M14 | Médio | @documentacao | `docs/testing/plano-de-testes.md` |
| M15 | Médio | @devops / @arquiteto-banco-de-dados | `docs/deployment/github-actions.md`, `docs/deployment/branch-strategy.md` |

## Validação Executada

- `npm run typecheck`: ✅ Passou
- `npm run lint`: ✅ Passou
- `npm run build`: ✅ Passou
- `npm run test`: ✅ 17 testes passando
- Teste manual de integração do `AIConfigPanel`: ❌ Falhou (configuração não propagada)
- Validação de versão do `@chub-ai/stages-ts`: ❌ Ainda em `^0.3.7`

## Próximos Passos

1. Corrigir findings A4 e A6 antes de qualquer outra tarefa.
2. Endereçar M9-M15 conforme atribuições.
3. Reexecutar `npm run typecheck`, `npm run lint`, `npm run build` e `npm run test`.
4. Reativar `equipe-revisao` para iteração 3/3.
5. Caso a iteração 3/3 seja reprovada, o Juiz deve convocar o Tribunal conforme protocolo de governança.
