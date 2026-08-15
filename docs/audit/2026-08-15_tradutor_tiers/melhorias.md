# 🔧 Soluções e Recomendações — tradutor-tiers

## 1. Reexecutar a skill `tradutor-tiers`
- **Ação**: Invocar novamente `tradutor-tiers` a partir do manifesto e do plano de ação.
- **Impacto**: Gera os contratos faltantes; desbloqueia o fluxo.
- **Responsável**: `@orquestrador`

## 2. Adicionar validação de artefatos no `sync-context`
- **Ação**: skill `sync-context` deve verificar existência dos arquivos de saída antes de marcar tarefa como concluída.
- **Impacto**: Evita inconsistências estado vs. sistema de arquivos.

## 3. Gatekeeper no Orquestrador
- **Ação**: Orquestrador deve listar `/docs/management/contratos/` antes de ativar `@arquiteto-geral`.
- **Impacto**: Bloqueia progresso sem contratos; reduz alucinações downstream.

## 4. Revisão obrigatória dos contratos
- **Ação**: após gerar contratos, executar `equipe-revisao` focada em:
  - formato JSON rigoroso;
  - `hard_rules` e `acceptance_criteria` mensuráveis;
  - ausência de narrativa emocional.
- **Impacto**: Aumenta fidelidade técnica antes da implementação.

## 5. Métricas futuras
- Registrar tokens gastos pela skill `tradutor-tiers` para comparar com a economia de contexto dos tiers seguintes.
