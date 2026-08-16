# GitHub Actions — Eros Status Terminal

Este documento descreve os workflows de CI/CD do projeto e o fluxo de **deploy local** (fallback quando o CI está geo-bloqueado).

## ⚠️ Bloqueio geo da API do Chub (importante)

A API do Chub (`api.chub.ai`) retorna **HTTP 403 "This service is not available in your country."** em dois cenários:

1. **IPs de data center** (runners do GitHub Actions) — motivo original da falha do CI.
2. **Países inteiros** — confirmado em 2026-08-15 que o **Brasil (BR)** também é bloqueado na origem (`x-src-country: BR`); tanto `api.chub.ai/extensions` quanto `api.chub.ai/extension/{id}/upload` retornam 403 a partir de IP residencial BR.

**Consequência:** o deploy local a partir do Brasil **não funciona** sem VPN/VPS/proxy em país liberado (não BR, não datacenter). O workflow do GitHub Actions continua registrado como fonte de verdade para quando o runner for liberado (self-hosted) ou o bloqueio por país for removido.

**Autenticação:** todos os uploads usam o header `CH-API-KEY: $CHUB_AUTH_TOKEN` (NÃO `Authorization: Bearer`).

## Workflows

### `.github/workflows/deploy-dev.yml`

- **Trigger:** execução manual (`workflow_dispatch`) **apenas** — sem trigger automático por push, pois a API do Chub (`api.chub.ai`) está geo-bloqueada em runners do GitHub Actions (403) e o deploy é feito via script local a partir de IP liberado.
- **Environment:** `development`.
- **Etapa final:** faz upload do pacote para `https://api.chub.ai/extension/${CHUB_EXTENSION_ID_DEV}/upload` usando os secrets `CHUB_AUTH_TOKEN` e `CHUB_EXTENSION_ID_DEV`, com header `CH-API-KEY`.

### `.github/workflows/deploy.yml`

- **Trigger:** push na branch `main` ou execução manual (`workflow_dispatch`).
- **Environment:** `production` (recomenda-se configurar protection rules no GitHub para exigir aprovação manual).
- **Etapa final:** faz upload do pacote estável para `https://api.chub.ai/extension/eros-status-stage-b47cccbfa255/upload` usando o secret `CHUB_AUTH_TOKEN`, com header `CH-API-KEY`.

> **Atenção:** o workflow de `main` só deve ser disparado após aprovação explícita do usuário para promover `dev` → `main`.

## Fluxo de deploy local (fallback)

Quando o CI falhar por geo-block, use o script `scripts/deploy-chub.sh` (não versionado — `scripts/` está no `.gitignore`; o script não contém secrets).

```bash
chmod +x scripts/deploy-chub.sh
CHUB_AUTH_TOKEN=CHK-... ./scripts/deploy-chub.sh
```

**Resolução do STAGE_ID** (nesta ordem):

1. `CHUB_EXTENSION_ID_DEV` (env/`.env.chub`) → usa.
2. Senão, lê `extension_id:` de `public/chub_meta.yaml` → usa.
3. Senão (ou se vazio/nulo) → **cria** via `POST https://api.chub.ai/extensions` (nome "Eros Status Terminal"), parseia `.id_v2` (com `jq`; fallback `python3`) e grava `extension_id: '<id_v2>'` no `public/chub_meta.yaml`.

Para **forçar** a criação de uma nova extension (ex.: ambiente dev separado da produção):

```bash
CHUB_AUTH_TOKEN=CHK-... ./scripts/deploy-chub.sh --create
```

O script valida o status HTTP (200/201), reporta a resposta completa em falha (400/401/403/409 etc.) e limpa os artefatos (`eros-status-stage-dev.zip`, `response.json`, `chub-upload/`) via `trap cleanup`.

> **Observação:** o `extension_id` gravado em `public/chub_meta.yaml` é o ID de **produção** (`eros-status-stage-b47cccbfa255`). Para publicar em uma extension de dev separada, defina `CHUB_EXTENSION_ID_DEV` ou use `--create`.

## Steps comuns

Ambos os workflows executam, na ordem:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`
5. Preparação do pacote Chub (`dist/` + `public/chub_meta.yaml` em um ZIP).
6. Upload via `curl` para a API do Chub (header `CH-API-KEY`).

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
