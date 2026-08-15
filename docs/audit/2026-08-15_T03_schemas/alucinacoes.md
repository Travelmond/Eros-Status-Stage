# 🧠 Alucinações Detectadas — T03 Schemas

## Execução do Contrato T03
Nenhum agente executou o contrato T03, portanto não há alucinações sobre tipos, YAML ou StageBase produzidas por código.

## Riscos de Alucinação Identificados

### 1. Persistência em `localStorage` para estado crítico
- **Fonte**: `docs/01-ARQUITETURA.md` §4.1 e manifesto §2.3.
- **Problema**: documentação local assume persistência de estado do personagem em `localStorage`.
- **Fato oficial**: Stage roda em iframe sandbox em subdomínio isolado; `localStorage` pode ser inacessível. O Chub persiste estado via retornos de `load`/`beforePrompt`/`afterResponse` (`messageState`/`chatState`).
- **Severidade**: 🔴 Alta — viola hard rule do contrato T03 (“Todo estado crítico deve estar tipado em messageState ou chatState; nunca apenas em localStorage”).

### 2. API key do OpenRouter
- **Fonte**: contrato T03 e manifesto §5.2.
- **Risco**: alucinar que a API key pode ser salva em `localStorage` ou em estado não seguro.
- **Mitigação**: contrato T03 já exige campo `sensitive`/`secret` no `config_schema` de `chub_meta.yaml`.

### 3. Estrutura de arquivos do Chub
- **Fonte**: documentação local `/docs`.
- **Risco**: criar `chub_meta.yaml` com campos ou tipos incompatíveis com a versão atual do template (`CharHubAI/stage-template`).
- **Mitigação**: inspecionar template oficial e `chub-stages-ts/src/types` antes de gerar o YAML.

## Recomendação
Quando `@arquiteto-banco-de-dados` executar T03, o Juiz deve reavaliar especificamente:
- Validação YAML com parser real.
- Compilação TypeScript dos arquivos `src/types/*.ts`.
- Mapeamento correto entre `ErosStatusState` e `messageState`/`chatState`.
- Marcação de `api_key` como sensível no schema.
