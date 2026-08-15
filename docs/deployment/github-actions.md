# GitHub Actions — Eros Status Terminal

Este documento descreve os workflows de CI/CD do projeto.

## Workflows

### `.github/workflows/deploy-dev.yml`

- **Trigger:** push na branch `dev` ou execução manual (`workflow_dispatch`).
- **Environment:** `development`.
- **Etapa final:** faz upload do pacote para `https://api.chub.ai/extension/${CHUB_EXTENSION_ID_DEV}/upload` usando os secrets `CHUB_AUTH_TOKEN` e `CHUB_EXTENSION_ID_DEV`.

### `.github/workflows/deploy.yml`

- **Trigger:** push na branch `main` ou execução manual (`workflow_dispatch`).
- **Environment:** `production` (recomenda-se configurar protection rules no GitHub para exigir aprovação manual).
- **Etapa final:** faz upload do pacote estável para `https://api.chub.ai/extension/eros-status-stage-b47cccbfa255/upload` usando o secret `CHUB_AUTH_TOKEN`.

> **Atenção:** o workflow de `main` só deve ser disparado após aprovação explícita do usuário para promover `dev` → `main`.

## Steps comuns

Ambos os workflows executam, na ordem:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`
5. Preparação do pacote Chub (`dist/` + `public/chub_meta.yaml` em um ZIP).
6. Upload via `curl` para a API do Chub.

Se qualquer um dos steps de validação falhar, o deploy é abortado.

## Secrets necessários

| Secret                 | Descrição                                                                 | Obrigatório |
|------------------------|---------------------------------------------------------------------------|-------------|
| `CHUB_AUTH_TOKEN`      | Token de autenticação da API do Chub Venus AI.                            | Sim         |
| `CHUB_EXTENSION_ID_DEV`| ID da extensão/Stage de **desenvolvimento/testes** no Chub (branch `dev`).| Sim         |

## Variáveis do workflow

| Variável            | Valor padrão                    | Descrição                                                          |
|---------------------|---------------------------------|--------------------------------------------------------------------|
| `NODE_VERSION`      | `24.x`                          | Versão do Node.js usada no runner.                                 |
| `CHUB_EXTENSION_ID` | `eros-status-stage-b47cccbfa255`| ID da extensão/Stage no Chub (apenas no workflow de `main` estável).|

## Pacote enviado ao Chub

```
eros-status-stage[-dev].zip
├── dist/
│   ├── index.html
│   ├── assets/
│   └── ...
└── chub_meta.yaml
```

O `chub_meta.yaml` é obrigatório e deve estar sempre presente na raiz do pacote ZIP.

## Como adicionar os secrets

1. Vá até **Settings → Secrets and variables → Actions** no repositório.
2. Clique em **New repository secret**.
3. Adicione os dois secrets obrigatórios:
   - **Nome:** `CHUB_AUTH_TOKEN`  
     **Valor:** o token de autenticação fornecido pelo Chub Venus AI.
   - **Nome:** `CHUB_EXTENSION_ID_DEV`  
     **Valor:** o ID da extensão/Stage de desenvolvimento (diferente do ID de produção `eros-status-stage-b47cccbfa255`).
4. Nunca commit estes valores em nenhum arquivo do repositório.

> **Atenção:** o workflow de `dev` falhará de forma clara caso `CHUB_EXTENSION_ID_DEV` não esteja configurado, evitando que o Stage de produção seja sobrescrito acidentalmente.
