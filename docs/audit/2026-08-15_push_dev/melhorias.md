# Melhorias Propostas — Push para `dev`

## 1. Corrigir tracking da branch `old`
**Problema:** `.git/config` define `[branch "old"]` com `merge = refs/heads/main`, fazendo com que um push de `old` envie dados para `origin/main`.

**Ação:**
```ini
[branch "old"]
    remote = origin
    merge = refs/heads/old
```

Ou, preferencialmente, remover o tracking de `old` para garantir imutabilidade:
```bash
git branch --unset-upstream old
```

**Impacto:** elimina risco de sobrescrita acidental de `origin/main`.

---

## 2. Configurar tracking de `dev` para `origin/dev`
**Problema:** `dev` não tem upstream configurado.

**Ação:** após a revisão final pós-Tribunal:
```bash
git push -u origin dev
```

**Impacto:** padroniza o fluxo e evita erros de push para a branch errada.

---

## 3. Verificar secrets antes do primeiro push
**Problema:** se `CHUB_AUTH_TOKEN` ou `CHUB_EXTENSION_ID_DEV` não estiverem configurados no GitHub, o workflow falhará no primeiro push.

**Ação:** validar em **Settings → Secrets and variables → Actions** que ambos existem. Opcionalmente, adicionar um step de validação local (sem expor valores).

**Impacto:** evita falha do workflow e notificações de erro no primeiro deploy.

---

## 4. Adicionar proteção de branches no GitHub
**Problema:** sem branch protection rules, push direto em `main` ou `old` é tecnicamente possível.

**Ação:** configurar no repositório remoto:
- `main`: exigir PR com aprovação; bloquear push direto.
- `old`: bloquear push direto e marcar como arquivada.
- `dev`: permitir push direto, mas exigir que status checks passem para PRs.

**Impacto:** fortalece a governança e impede violações da estratégia de branches.

---

## 5. Executar `equipe-revisao` antes do push real
**Problema:** o push para `dev` dispara deploy automático de teste no Chub.

**Ação:** conforme protocolo de `AGENTS.md`, ativar `@coordenador-revisao` e a skill `equipe-revisao` para revisar os workflows e o estado atual do código **antes** de `git push origin dev`.

**Impacto:** detecta vazamento de secrets, erros de sintaxe de workflow e regressões antes do deploy de teste.

---

## 6. Documentar o estado atual de não-push
**Problema:** a solicitação do usuário pressupõe que o push já ocorreu, mas o repositório local não reflete isso.

**Ação:** atualizar `docs/management/tarefas.md` para refletir que:
- commits locais em `dev` foram feitos;
- push para `origin/dev` ainda está pendente;
- deploy de teste está bloqueado até revisão final pós-Tribunal.

**Impacto:** evita mal-entendidos e mantém o contexto vivo alinhado ao filesystem.

---

## Priorização
| # | Melhoria | Urgência | Impacto |
|---|---|---|---|
| 1 | Corrigir tracking de `old` | Alta | Segurança |
| 2 | Verificar secrets no GitHub | Alta | Evita falha de deploy |
| 5 | Executar `equipe-revisao` antes do push | Alta | Qualidade |
| 3 | Configurar upstream de `dev` | Média | Padronização |
| 4 | Branch protection no GitHub | Média | Governança |
| 6 | Documentar estado de não-push | Baixa | Clareza |
