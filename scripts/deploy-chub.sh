#!/usr/bin/env bash
#
# deploy-chub.sh — Deploy local do ESS v3.0 para o Chub Venus AI (ambiente dev).
#
# Por que existe: o GitHub Actions (deploy-dev.yml) falha com HTTP 403
# ("This service is not available in your country") porque a API do Chub
# bloqueia IPs de data centers. Este script executa o MESMO processo a partir
# da máquina local do usuário.
#
# ⚠️  IMPORTANTE (geo-block): a API api.chub.ai também bloqueia por país
# (ex.: Brasil/BR retorna 403). Se o seu IP de origem for bloqueado, o script
# falhará com 403 em TODAS as chamadas — nesse caso, rode a partir de uma
# VPN/VPS/proxy em um país liberado ou com runner self-hosted.
#
# Autenticação: header `CH-API-KEY` (NÃO `Authorization: Bearer`).
#
# Resolução do STAGE_ID (nesta ordem):
#   1. $CHUB_EXTENSION_ID_DEV (env ou .env.chub) → usa.
#   2. Senão, lê `extension_id:` de public/chub_meta.yaml → usa.
#   3. Senão (ou se vazio/nulo, ou com --create) → cria via
#      POST https://api.chub.ai/extensions (nome "Eros Status Terminal"),
#      parseia `.id_v2` (jq; fallback python3) e grava
#      `extension_id: '<id_v2>'` em public/chub_meta.yaml.
#
# Uso:
#   chmod +x scripts/deploy-chub.sh
#   CHUB_AUTH_TOKEN=CHK-... CHUB_EXTENSION_ID_DEV=id... ./scripts/deploy-chub.sh
#   CHUB_AUTH_TOKEN=CHK-... ./scripts/deploy-chub.sh --create   # força criar nova extension
#
# Regras:
#   - NUNCA commite token/secrets (o token fica em env/.env.chub, gitignored).
#   - O arquivo .env.chub deve ter permissões restritas (chmod 600).

set -euo pipefail

# ---------------------------------------------------------------------------
# 0. Help
# ---------------------------------------------------------------------------
usage() {
  cat <<'EOF'
Uso: CHUB_AUTH_TOKEN=CHK-... CHUB_EXTENSION_ID_DEV=id... ./scripts/deploy-chub.sh
     ./scripts/deploy-chub.sh --help

Flags:
  --create          Força a criação de uma NOVA extension via API (ignora
                    CHUB_EXTENSION_ID_DEV e extension_id do chub_meta.yaml).

Variáveis (ou .env.chub no diretório raiz):
  CHUB_AUTH_TOKEN        Token de escrita do Chub (formato CHK-...)
  CHUB_EXTENSION_ID_DEV  ID da extension no Chub (ambiente dev)

Resolução do STAGE_ID:
  1. CHUB_EXTENSION_ID_DEV (env > .env.chub)  2. extension_id: de public/chub_meta.yaml
  3. Criação automática via POST https://api.chub.ai/extensions

O script:
  1. Lê as credenciais (env > .env.chub > prompt interativo mascarado)
  2. Resolve o STAGE_ID (env > chub_meta.yaml > criação via API)
  3. Executa npm run build
  4. Empacota dist/ + chub_meta.yaml em eros-status-stage-dev.zip
  5. Faz upload via api.chub.ai/extension/{id}/upload (header CH-API-KEY)
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

FORCE_CREATE=0
for arg in "$@"; do
  if [[ "$arg" == "--create" ]]; then
    FORCE_CREATE=1
  fi
done

# ---------------------------------------------------------------------------
# 1. Credenciais: env > .env.chub > prompt interativo
# ---------------------------------------------------------------------------
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Carrega .env.chub somente se a variável ainda não estiver definida no ambiente.
load_env_chub() {
  local env_file="$PROJECT_ROOT/.env.chub"
  if [[ -f "$env_file" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
  fi
}

load_env_chub

# CHUB_AUTH_TOKEN — formato esperado: CHK-...
if [[ -z "${CHUB_AUTH_TOKEN:-}" ]]; then
  read -rsp "Token de escrita do Chub (CHK-...): " CHUB_AUTH_TOKEN
  echo
  CHUB_AUTH_TOKEN="$(echo "$CHUB_AUTH_TOKEN" | tr -d '[:space:]')"
fi

if [[ -z "$CHUB_AUTH_TOKEN" ]]; then
  echo "❌ ERRO: CHUB_AUTH_TOKEN é obrigatório." >&2
  exit 1
fi

# Validação de formato (aviso, não bloqueia — tokens antigos podem ter outro prefixo)
if [[ ! "$CHUB_AUTH_TOKEN" =~ ^CHK- ]]; then
  echo "⚠️  AVISO: CHUB_AUTH_TOKEN não começa com 'CHK-'. Verifique se o token está correto." >&2
fi

echo "✅ Credenciais lidas (token: ${CHUB_AUTH_TOKEN:0:7}...)"

# ---------------------------------------------------------------------------
# 2. Limpeza (trap) e pré-requisitos
# ---------------------------------------------------------------------------
ZIP_NAME="eros-status-stage-dev.zip"
META_FILE="public/chub_meta.yaml"
CREATION_JSON=""

cleanup() {
  rm -f "$ZIP_NAME" response.json 2>/dev/null || true
  if [[ -n "$CREATION_JSON" ]]; then
    rm -f "$CREATION_JSON" 2>/dev/null || true
  fi
  rm -rf chub-upload
}
trap cleanup EXIT

for cmd in curl zip npm; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ ERRO: comando '$cmd' não encontrado. Instale antes de rodar o deploy." >&2
    exit 1
  fi
done

if ! command -v jq >/dev/null 2>&1; then
  echo "ℹ️  jq não encontrado — usarei python3 para parsear o JSON da API."
  if ! command -v python3 >/dev/null 2>&1; then
    echo "❌ ERRO: nem jq nem python3 estão disponíveis. Instale jq (sudo apt-get install jq) ou python3." >&2
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 3. Resolução do STAGE_ID: env > chub_meta.yaml > criação via API
# ---------------------------------------------------------------------------
STAGE_ID="${CHUB_EXTENSION_ID_DEV:-}"

if [[ -z "$STAGE_ID" && "$FORCE_CREATE" -eq 0 && -f "$META_FILE" ]]; then
  # Lê `extension_id:` de public/chub_meta.yaml (aceita aspas simples/duplas)
  STAGE_ID="$(sed -nE 's/^extension_id:[[:space:]]*["'"'"']?([^"'"'"']*).*/\1/p' "$META_FILE" | head -n1)"
  if [[ -n "$STAGE_ID" ]]; then
    echo "ℹ️  STAGE_ID lido de public/chub_meta.yaml: $STAGE_ID"
  fi
fi

# Cria a extension se ainda não temos ID (ou se --create for solicitado)
if [[ -z "$STAGE_ID" || "$STAGE_ID" == "null" || "$FORCE_CREATE" -eq 1 ]]; then
  echo "🔧 Criando extension 'Eros Status Terminal' na API do Chub..."
  CREATION_JSON="$(mktemp)"
  CREATE_STATUS="$(curl -s -o "$CREATION_JSON" -w "%{http_code}" \
    --request POST \
    -H "CH-API-KEY: ${CHUB_AUTH_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"name":"Eros Status Terminal"}' \
    "https://api.chub.ai/extensions")"

  echo "Status da criação: ${CREATE_STATUS}"
  if [[ -f "$CREATION_JSON" ]]; then
    cat "$CREATION_JSON"
    echo ""
  fi

  if [[ "$CREATE_STATUS" != "200" && "$CREATE_STATUS" != "201" ]]; then
    echo "❌ Falha ao criar extension (HTTP ${CREATE_STATUS})." >&2
    if grep -qi "not available in your country" "$CREATION_JSON" 2>/dev/null; then
      echo "⚠️  A API do Chub está bloqueada para o seu país/IP (geo-block)." >&2
      echo "   Rode a partir de VPN/VPS/proxy em um país liberado (não BR, não datacenter)." >&2
    fi
    exit 1
  fi

  if command -v jq >/dev/null 2>&1; then
    STAGE_ID="$(jq -r '.id_v2 // empty' "$CREATION_JSON")"
  else
    STAGE_ID="$(python3 -c "import sys,json; print(json.load(open('$CREATION_JSON')).get('id_v2',''))" 2>/dev/null || true)"
  fi

  if [[ -z "$STAGE_ID" || "$STAGE_ID" == "null" ]]; then
    echo "❌ Não foi possível extrair id_v2 da resposta de criação:" >&2
    [[ -f "$CREATION_JSON" ]] && cat "$CREATION_JSON" >&2
    exit 1
  fi

  # Grava extension_id no chub_meta.yaml (atualiza linha existente ou anexa)
  if grep -q '^extension_id:' "$META_FILE"; then
    sed -i -E "s|^extension_id:.*|extension_id: \"$STAGE_ID\"|" "$META_FILE"
  else
    printf '\nextension_id: "%s"\n' "$STAGE_ID" >> "$META_FILE"
  fi
  echo "✅ Extension criada! STAGE_ID: $STAGE_ID (gravado em $META_FILE)"
fi

if [[ -z "$STAGE_ID" ]]; then
  echo "❌ ERRO: não foi possível determinar o STAGE_ID da extension." >&2
  exit 1
fi

echo "✅ STAGE_ID definido: $STAGE_ID"

# ---------------------------------------------------------------------------
# 4. Build
# ---------------------------------------------------------------------------
echo "🔨 Executando npm run build..."
npm run build
echo "✅ Build concluído."

# ---------------------------------------------------------------------------
# 5. Empacotamento
# ---------------------------------------------------------------------------
echo "📦 Empacotando extension..."
rm -rf chub-upload
mkdir -p chub-upload
cp -r dist chub-upload/dist
cp "$META_FILE" chub-upload/chub_meta.yaml
(
  cd chub-upload
  zip -r "../$ZIP_NAME" .
)
echo "✅ Pacote criado: $ZIP_NAME"

# ---------------------------------------------------------------------------
# 6. Upload (header de autenticação: CH-API-KEY)
# ---------------------------------------------------------------------------
echo "🚀 Enviando para api.chub.ai/extension/${STAGE_ID}/upload ..."

HTTP_STATUS="$(curl -s -o response.json -w "%{http_code}" \
  -X POST "https://api.chub.ai/extension/${STAGE_ID}/upload" \
  -H "CH-API-KEY: ${CHUB_AUTH_TOKEN}" \
  -H "Accept: application/json" \
  -F "file=@$ZIP_NAME")"

echo ""
echo "Status: ${HTTP_STATUS}"
if [[ -f response.json ]]; then
  cat response.json
  echo ""
fi

# ---------------------------------------------------------------------------
# 7. Tratamento de erro
# ---------------------------------------------------------------------------
if [[ "$HTTP_STATUS" != "200" && "$HTTP_STATUS" != "201" ]]; then
  echo "❌ Deploy falhou com status ${HTTP_STATUS}. Verifique token, ID da extension e conectividade com a API do Chub." >&2
  if [[ -f response.json ]] && grep -qi "not available in your country" response.json; then
    echo "⚠️  A API do Chub está bloqueada para o seu país/IP (geo-block)." >&2
    echo "   O GitHub Actions também falha por esse motivo (IP de datacenter)." >&2
    echo "   Solução: VPN/VPS/proxy em país liberado (não BR, não datacenter) ou runner self-hosted." >&2
  fi
  exit 1
fi

# ---------------------------------------------------------------------------
# 8. Sucesso (cleanup via trap)
# ---------------------------------------------------------------------------
echo ""
echo "🎉 Deploy concluído com sucesso! (HTTP ${HTTP_STATUS})"
echo "Extension: ${STAGE_ID}"
