# 🔧 Melhorias Propostas — Planejamento de Branches

**Pasta:** `/docs/audit/2026-08-15_planejamento_branches/`

## Ações antes de executar os renames
1. **Atualizar manifesto** (§5.5 e §7) — nova nomenclatura `old-v1`/`old-v2` + definição da branch estável. — *Impacto: elimina deriva de intenção.*
2. **Atualizar contrato T04** e `branch-strategy.md` — incluir `master`→`old-v2` e o destino da `main`. — *Impacto: devops com instrução estrita.*
3. **Definir destino da `main`** (recriar vazia vs. promover `dev`). — *Impacto: remove ambiguidade crítica.*
4. **Resolver `old` local** (remover ou renomear) para não duplicar `old-v1`. — *Impacto: evita confusão de refs.*
5. **Corrigir `.git/config`** — remover `merge = refs/heads/main` de `[branch "old"]`. — *Impacto: elimina risco de push acidental para `origin/main`.*
6. **Atualizar `deploy.yml`** após rename (novo gatilho de produção). — *Impacto: evita quebra do deploy.*
7. **Executar `sync-context`** ao concluir. — *Impacto: reduz ~30% de re-leitura futura.*

## Checklist proposto para `@devops` (contrato T04)
1. `git fetch origin`
2. `git checkout -b old-v2 origin/master` (materializar `master`)
3. `git branch -m main old-v1`
4. Corrigir tracking e remover/renomear `old` local
5. Atualizar `deploy.yml` + default branch no GitHub
6. `sync-context` (manifesto, T04, branch-strategy, implementacao, tarefas)

## Etapas futuras (já corretas)
- Polir F1–F4 (M1/M10/M13/README) — débito leve pós-deploy.
- `npm run dev` — validação do critério de fidelidade nº 2.
