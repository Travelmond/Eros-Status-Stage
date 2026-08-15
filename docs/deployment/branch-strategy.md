# Estratégia de Branches — Eros Status Terminal

Este repositório segue um modelo de branches de três vias para preservar o histórico e controlar a qualidade do deploy.

## Branches

### `old`

- **Conteúdo:** snapshot do código antigo/desatualizado do repositório original.
- **Origem:** `origin/main` (ou branch padrão do repositório remoto) no momento em que o projeto foi reescrito.
- **Uso:** preservação histórica. Não recebe novos commits.

### `dev`

- **Conteúdo:** código funcional atual (ESS v3.0).
- **Origem:** criada a partir de `main` após a criação de `old`.
- **Uso:** branch de trabalho padrão. Todos os novos recursos e correções são desenvolvidos aqui.
- **Deploy:** todo push em `dev` dispara o workflow `.github/workflows/deploy-dev.yml` e publica no stage de teste do Chub.

### `main`

- **Conteúdo:** versão estável e validada.
- **Uso:** reflete o código aprovado para produção.
- **Deploy:** todo push em `main` dispara o workflow `.github/workflows/deploy.yml` e publica a versão estável no Chub.
- **Regra:** nunca faça push direto em `main`. A atualização só ocorre mediante solicitação explícita do usuário.

## Fluxo de promoção

```
[dev] --(testes + validação)--> [main] --(aprovação)--> [deploy estável]
```

1. Desenvolva e teste em `dev`.
2. Quando `dev` estiver estável, abra um pull request para `main`.
3. Após revisão e aprovação, faça merge do PR.
4. O workflow `deploy.yml` publicará a versão estável.

## Regras duras

- **Nunca commite secrets, `.env` ou API keys.**
- **`CHUB_AUTH_TOKEN` deve ser configurado apenas como GitHub Secret.**
- **Nunca faça push direto em `main`.**
- **`old` é imutável** após a criação inicial.

## Branches locais vs. remotas

| Branch | Remoto          | Local           | Conteúdo esperado                    |
|--------|-----------------|-----------------|--------------------------------------|
| `old`  | `origin/old`    | `old`           | Código antigo do repositório original|
| `dev`  | `origin/dev`    | `dev`           | Código novo em desenvolvimento       |
| `main` | `origin/main`   | `main`          | Estável (promovido de `dev`)         |
