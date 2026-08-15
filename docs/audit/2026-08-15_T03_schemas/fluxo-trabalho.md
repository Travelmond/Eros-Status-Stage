# 🔄 Fluxo de Trabalho — T03 Schemas

## Sequência Esperada
```
Orquestrador (T0)
  → @arquiteto-geral (T1)
    → @arquiteto-banco-de-dados (T2)
      → @dev-banco-de-dados (T3)
        → skill equipe-revisao (Tier 4)
```

## Sequência Observada
```
Usuário → Juiz (Meta)
```
Nenhum agente de implementação foi acionado. O contrato T03 permanece no estado de especificação.

## Gargalos
1. **Orquestrador não iniciou materialização**: desde a auditoria `2026-08-15_implementacao_stage`, o fluxo não avançou.
2. **Arquiteto-Geral não distribuiu contratos**: T03 continua como tarefa pendente em `docs/management/tarefas.md`.
3. **Falta estrutura física do projeto**: sem `src/` e `public/`, qualquer schema gerado não pode ser validado por build.

## Hierarquia
- ✅ O usuário dirigiu-se corretamente ao Juiz para auditoria.
- ❌ O Juiz não pode avaliar execução de um agente que não foi ativado.

## Comandos no Momento Certo
- O comando de auditoria foi apropriado, mas prematuro. Deve ser repetido após execução real do T03.
