# 🔧 Soluções e Recomendações — T04 / @devops

## 1. Validar build antes de executar @devops

**Problema:** O contrato T04 depende de um build funcional, mas `docs/management/tarefas.md` registra que a validação não foi executada.

**Ação:** Executar `npm install`, `npm run typecheck` e `npm run lint` no ambiente local. Se a ferramenta Bash continuar indisponível, documentar o bloqueio e solicitar intervenção humana.

**Impacto:** Evita que workflows sejam criados sobre código quebrado, reduzindo iterações de correção.

## 2. Revalidar endpoint de deploy da API Chub

**Problema:** O endpoint `api.chub.ai/extension/{id}/upload` é usado como verdade, mas não foi revalidado nesta rodada.

**Ação:** Ativar `@pesquisador` para buscar a documentação oficial mais recente. Se houver acesso, testar com token de teste.

**Impacto:** Elimina o risco de alucinação sobre a API de deploy antes de codificar os workflows.

## 3. Criar workflows com gates obrigatórios

**Problema:** Sem workflows, não há CI/CD.

**Ação:** `@devops` deve criar:
- `.github/workflows/deploy.yml` — trigger em `push` para `main`, com aprovação manual via `environment: production`.
- `.github/workflows/deploy-dev.yml` — trigger em `push` para `dev`.
- Ambos devem incluir: checkout, setup Node 24, `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, zip de `dist/` + `public/chub_meta.yaml`, upload para a API Chub usando `secrets.CHUB_AUTH_TOKEN`.

**Impacto:** Garante que deploys só ocorram após build e lint passarem.

## 4. Proteger secrets

**Problema:** `CHUB_AUTH_TOKEN` ainda não está configurado e não há workflows.

**Ação:** Ao criar os workflows, usar apenas `${{ secrets.CHUB_AUTH_TOKEN }}` e nunca logar o token. Adicionar `.env*` e `*.pem` em `.gitignore`.

**Impacto:** Previne vazamento de credenciais no repositório.

## 5. Organizar branches e documentação

**Problema:** Branches `old`, `dev`, `main` ainda não foram preparadas; documentação de deploy está fora do padrão.

**Ação:**
- Criar `old` a partir do estado atual de `main` antes de qualquer push.
- Criar `dev` a partir de `main` após `old`.
- Criar `docs/deployment/github-actions.md` e `docs/deployment/branch-strategy.md`.
- Migrar/selecionar conteúdo relevante de `docs/10-MISC.md`.

**Impacto:** Alinha o projeto com `AGENTS.md` e deixa o fluxo de deploy documentado.

## 6. Executar equipe-revisao após @devops

**Problema:** Sem execução, não há revisão.

**Ação:** Após o @devops concluir, acionar `equipe-revisao` obrigatoriamente com foco em `auditor-seguranca` (secrets) e `critico` (sintaxe dos workflows).

**Impacto:** Detecta problemas antes do primeiro push para `dev`.

## Fluxo de melhoria proposto

```
validar build local
  → @pesquisador revalida API Chub
    → @devops implementa T04
      → equipe-revisao audita
        → @orquestrador valida e autoriza push para dev
```

## Métricas de sucesso

- [ ] `npm run typecheck` passa.
- [ ] `npm run lint` passa.
- [ ] `.github/workflows/deploy-dev.yml` existe e é sintaticamente válido.
- [ ] `.github/workflows/deploy.yml` existe e exige aprovação manual.
- [ ] `docs/deployment/` contém `github-actions.md` e `branch-strategy.md`.
- [ ] `CHUB_AUTH_TOKEN` configurado como secret (validado manualmente no GitHub).
- [ ] Nenhum secret aparece em código ou logs.
