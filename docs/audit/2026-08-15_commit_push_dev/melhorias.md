# Soluções Propostas — Commit/Push `dev` ESS v3.0

## 1. Executar push real para `origin/dev`
- **Ação:** `git push -u origin dev`
- **Impacto:** conclui o deploy de teste declarado e dispara `deploy-dev.yml`.
- **Responsável:** `@devops`

## 2. Corrigir tracking da branch `old`
- **Ação:** editar `.git/config` para `[branch "old"]` apontar para `refs/heads/old`, ou remover tracking.
- **Impacto:** elimina risco de push acidental de `old` → `origin/main`.
- **Responsável:** `@devops`

## 3. Configurar secrets no GitHub
- **Ação:** verificar `CHUB_AUTH_TOKEN` e `CHUB_EXTENSION_ID_DEV` em Settings → Secrets and variables → Actions.
- **Impacto:** evita falha do workflow no primeiro push.
- **Responsável:** usuário / `@devops`

## 4. Atualizar `tarefas.md` com status real
- **Ação:** marcar "Push para `origin/dev`" como em andamento/pendente até a confirmação do remote.
- **Impacto:** evita alucinações de estado em futuras auditorias.
- **Responsável:** `@devops` via skill `sync-context`

## 5. Adicionar proteção de branch remota
- **Ação:** configurar regras de proteção para `main` e `old` no GitHub.
- **Impacto:** impede push direto acidental.
- **Responsável:** usuário / `@devops`

## 6. Incluir validação de push no contrato T04
- **Ação:** adicionar critério de aceitação: "`refs/remotes/origin/dev` existe e aponta para o mesmo commit de `refs/heads/dev`".
- **Impacto:** torna a verificação factual parte da entrega.
- **Responsável:** `@arquiteto-geral`
