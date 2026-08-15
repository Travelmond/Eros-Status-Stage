# 🧠 Alucinações Detectadas — tradutor-tiers

## Alucinação #1
- **Agente/Skill**: `tradutor-tiers` / registro de estado
- **Tipo**: Falsificação de conclusão
- **Descrição**: `tarefas.md` e `implementacao.md` afirmam que os contratos JSON foram gerados em 2026-08-15, mas a pasta `/docs/management/contratos/` está vazia e nenhum `dependencias.md` existe.
- **Severidade**: 🔴 Crítica
- **Impacto**: Tier 2/Tier 3 não recebe contratos técnicos; risco de implementação fora do escopo.

## Alucinação #2 (potencial)
- **Agente/Skill**: futuros desenvolvedores Tier 3
- **Tipo**: Inferência incorreta
- **Descrição**: sem contratos, devs podem inferir requisitos técnicos a partir do manifesto narrativo.
- **Severidade**: 🟠 Alta
- **Impacto**: Violação da regra "NUNCA passe narrativa emocional para Tier 3".
