# GitHub Actions — Eros Status Terminal

Este documento descreve os workflows de CI/CD do projeto.

## Workflows

### `.github/workflows/deploy-dev.yml`

- **Trigger:** push na branch `dev` ou execução manual (`workflow_dispatch`).
- **Environment:** `development`.
- **Etapa final:** faz upload do pacote para `https://api.chub.ai/extension/eros-status-stage-b47cccbfa255/upload` usando o secret `CHUB_AUTH_TOKEN`.

### `.github/workflows/deploy.yml`

- **Trigger:** push na branch `main` ou execução manual (`workflow_dispatch`).
- **Environment:** `production` (recomenda-se configurar protection rules no GitHub para exigir aprovação manual).
- **Etapa final:** faz upload do pacote estável para o mesmo endpoint do Chub.

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

| Secret            | Descrição                                      | Obrigatório |
|-------------------|------------------------------------------------|-------------|
| `CHUB_AUTH_TOKEN` | Token de autenticação da API do Chub Venus AI. | Sim         |

## Variáveis do workflow

| Variável            | Valor padrão                    | Descrição                          |
|---------------------|---------------------------------|------------------------------------|
| `NODE_VERSION`      | `24.x`                          | Versão do Node.js usada no runner. |
| `CHUB_EXTENSION_ID` | `eros-status-stage-b47cccbfa255`| ID da extensão/Stage no Chub.      |

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

## Como adicionar o secret

1. Vá até **Settings → Secrets and variables → Actions** no repositório.
2. Clique em **New repository secret**.
3. Nome: `CHUB_AUTH_TOKEN`.
4. Valor: o token fornecido pelo Chub Venus AI.
5. Nunca commit este valor em nenhum arquivo do repositório.
