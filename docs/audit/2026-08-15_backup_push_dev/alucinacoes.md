# 🧠 Alucinações e Divergências — Backup e Push `dev`

## 1. `dev-backup` fantasma (🔴 alta severidade)
- **Evidência esperada:** branch `dev-backup` (local ou remota) contendo o snapshot de `dev` antes da renomeação.
- **Evidência real:** zero ocorrências em `refs/heads/`, `refs/remotes/origin/`, reflogs, `FETCH_HEAD` e em todo `/docs`.
- **Conclusão:** se o `@devops` relatou ter criado `dev-backup`, trata-se de **alucinação** (etapa declarada mas não executada). Se não relatou, é **omissão crítica** da etapa de backup exigida pela operação.

## 2. Deriva de contexto nos docs de gestão (🟠 alta)
- `docs/management/tarefas.md` (linhas 159-173) e `implementacao.md` (linha 7) ainda descrevem o push/renomeação como "em andamento/pendente".
- **Realidade:** o push já ocorreu (reflog `update by push` para `old-v1`, `old-v2` e `dev`).
- **Conclusão:** a skill `sync-context` não foi executada ao concluir a operação — estado documentado diverge do filesystem.

## 3. Nomenclatura de branches local (🟡 média)
- `branch-strategy.md` (linhas 95-98) exige branches locais `old-v1`, `old-v2`, `dev`, `main`.
- **Realidade local:** `dev`, `main`, `old` (sem `old-v1`/`old-v2`; `old` duplica `old-v1`).
- **Conclusão:** inconsistência de nomenclatura; `old` local é redundante e não foi resolvido (já apontado no audit `2026-08-15_planejamento_branches`).

## 4. Não-alucinações (descartadas)
- A preservação de `old-v1`/`old-v2` no remoto é **real** e verificável via reflog/FETCH_HEAD.
- O push de `dev` é **real** (`origin/dev` → `692c5711`).
