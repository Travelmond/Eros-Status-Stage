# 🔄 Fluxo de Trabalho — Planejamento de Branches

**Pasta:** `/docs/audit/2026-08-15_planejamento_branches/`

## Sequência Observada
1. Usuário decide renomear `main`→`old-v1` e `master`→`old-v2` + etapas futuras (F1–F4, `npm run dev`).
2. Orquestrador (Gatekeeper) guiou a decisão.
3. Juiz avalia estado Git e governança.

## Avaliação do Fluxo
- ✅ **Hierarquia respeitada** — decisão de planejamento, sem pulo de tiers nem implementação indevida.
- ✅ **Sem loop de revisão** — correto: não houve código novo, portanto `equipe-revisao` não se aplica (não bloqueante nesta fase).
- ✅ **Tribunal não acionado** — contador de iterações irrelevante (0 iterações de implementação).
- ❌ **`sync-context` não executado** — a mudança de nomenclatura não foi persistida em `implementacao.md`/`tarefas.md`/manifesto/contrato T04. Gargalo para as próximas rodadas.

## Pontos de Gargalo
- `master` ausente localmente → exigirá fetch/checkout antes do rename.
- Rename de `main` → impacto em `deploy.yml` (`push: [main]`) e default branch do GitHub.

## Recomendação
- Roteirizar a operação de rename como tarefa do contrato T04 com checklist explícito (fetch master → rename main → rename master → corrigir tracking → atualizar workflow → atualizar default branch → `sync-context`).
