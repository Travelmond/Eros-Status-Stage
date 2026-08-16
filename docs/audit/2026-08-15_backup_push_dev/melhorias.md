# 🔧 Soluções e Melhorias — Backup e Push `dev`

## 🔴 Ação Imediata — Segurança
1. **Rotacionar o GitHub PAT** exposto em `.git/config` (URL do remote com `ghp_****Rr90`).
   - Impacto: elimina credencial comprometida em texto plano.
2. **Mover autenticação para Git Credential Manager ou SSH** — remover o token da URL do remote:
   ```bash
   git remote set-url origin https://github.com/Travelmond/Eros-Status-Stage.git
   ```
   - Impacto: impede reincidência do vazamento.
3. **Auditar histórico/commits** por possíveis secrets (`git log -S ghp_`), embora `.git/config` não seja commitado.

## 🟠 Corretivas de fluxo
4. **Criar `dev-backup` agora** (ou antes de qualquer nova operação destrutiva): `git branch dev-backup dev`.
5. **Apagar/renomear `main` local** (`git branch -D main` ou `git branch -m main old-v1`) para alinhar ao remoto.
6. **Materializar branches locais** `old-v1` e `old-v2` (`git checkout -b old-v1 origin/old-v1`) e **remover `old` local** redundante.
7. **Executar `sync-context`** para atualizar `implementacao.md`/`tarefas.md` ao estado real (push concluído).

## 📈 Recomendações estruturais
- Adicionar proteção de branch no GitHub para `old-v1`, `old-v2` e futura `main`.
- Documentar explicitamente no fluxo a etapa de **backup obrigatório (`dev-backup`) antes de renomeação/remoção de branches**.
- Adicionar verificação automatizada de secrets expostos no `.git/config` ao workflow do `@devops`.
