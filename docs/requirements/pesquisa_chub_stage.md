# Pesquisa Consolidada — Stages no Chub Venus AI

**Agente:** @pesquisador  
**Projeto:** Eros Status Terminal (ESS) para Chub Venus AI  
**Data:** 15 de Agosto de 2026  
**Status:** Factual, baseado em fontes oficiais e inspeção de repositório

---

## 1. Resumo Executivo

O **Chub Venus AI Stage** é um componente de software de terceiros executado dentro de um chat com LLM na plataforma Chub. Tecnicamente, trata-se de um **mini-site React/TypeScript** empacotado como iframe sandbox, que se comunica com a UI do Chub por meio da biblioteca `@chub-ai/stages-ts` (abstração sobre `postMessage`).

A plataforma fornece:
- Template oficial (`CharHubAI/stage-template`) com Vite + React 18 + TypeScript.
- Biblioteca de tipos e runtime (`@chub-ai/stages-ts`) com a classe abstrata `StageBase`.
- Deploy automático via GitHub Actions, fazendo upload do `dist/` zipado para `api.chub.ai/extension/{id}/upload`.
- Sandbox de iframe por subdomínio isolado, sem acesso a cookies/localStorage do Chub.

**Achado crítico:** A documentação oficial usa os termos "Stage" e "Extension" de forma intercambiável. O repositório antigo (`Travelmond/Eros-Status-Stage`) ainda reflete o template antigo (`@chub-ai/stages-ts@^0.3.7`), enquanto a biblioteca atual já evoluiu para incluir `messenger`, `storage` e `mcp` no `StageBase`. Além disso, a documentação local (`/docs`) descreve uma arquitetura standalone baseada em `postMessage` manual e persistência em `localStorage`, o que é **parcialmente desalinhado** com o modelo oficial de persistência via `StageBase`/`state schemas`.

---

## 2. Requisitos Oficiais do Chub Stage

### 2.1 O que é um Stage
> "A Chub Stage is a software component written by other people that can be used within a chat."  
> Fonte: [Overview](https://docs.chub.ai/docs/stages/overview.md)

Casos de uso oficiais:
- Criar UI para mundo, personagem ou cenário.
- RPGs e experiências multimídia.
- Blocos de estatísticas com matemática e estado.
- Tratamento especial de entrada/saída para quirks de modelos.

### 2.2 Stack e Requisitos de Ambiente
| Requisito | Valor Oficial |
|-----------|---------------|
| Node.js | `21.7.1` |
| Gerenciador | `yarn` (via `corepack enable`) |
| Framework | React 18 + TypeScript |
| Build | Vite |
| Template | `https://github.com/CharHubAI/stage-template` |
| Biblioteca | `@chub-ai/stages-ts` |

Fonte: [Quickstart / Setup](https://docs.chub.ai/docs/stages/developing-a-stage/quickstart-setup.md)

### 2.3 Deploy Oficial
1. Obter token de escrita em `https://chub.ai/my_stages?active=tokens`.
2. Adicionar como secret `CHUB_AUTH_TOKEN` no GitHub.
3. Push na branch `main` dispara a GitHub Action `deploy.yml`.
4. A action cria o projeto automaticamente (se `extension_id` não existir) via `POST https://api.chub.ai/extensions`.
5. Faz upload do build zipado via `POST https://api.chub.ai/extension/{id}/upload`.

Fonte: [Quickstart / Setup — Adding an API Key](https://docs.chub.ai/docs/stages/developing-a-stage/quickstart-setup.md)

---

## 3. Estrutura de Arquivos Esperada

A estrutura mínima exigida pelo template oficial é:

```text
public/
    chub_meta.yaml          # Metadados do stage (nome, visibilidade, schemas)
src/
    Stage.tsx               # Implementação principal — herda StageBase
    TestRunner.tsx          # Runner de testes em desenvolvimento
    App.tsx                 # Seletor dev/prod
    main.tsx                # Ponto de entrada React
    assets/
        test-init.json      # Dados de teste
    index.scss              # Estilos
package.json
vite.config.ts
tsconfig.json
tsconfig.node.json
index.html
.eslintrc.cjs
.github/workflows/deploy.yml
yarn.lock
```

Fonte: [Concepts — Project Structure](https://docs.chub.ai/docs/stages/developing-a-stage/concepts.md)

### Arquivo `public/chub_meta.yaml`
Obrigatório para deploy. Campos principais:

| Campo | Descrição |
|-------|-----------|
| `project_name` | Nome do stage |
| `tagline` | Subtítulo em busca |
| `visibility` | `PUBLIC`, `PRIVATE`, `UNLISTED` |
| `position` | `ADJACENT` (padrão), `NONE`, `COVER`, `FULLSCREEN` |
| `tags` | Lista de tags |
| `config_schema` | Schema JSON/YAML de configuração do usuário |
| `state_schema` | Schema opcional para `init`, `message`, `chat` states |
| `github_path` | URL do repositório (adicionado automaticamente pela action) |
| `extension_id` | Gerado automaticamente no primeiro push |

Fonte: [Config / Metadata](https://docs.chub.ai/docs/stages/developing-a-stage/config-metadata.md)

### Valores de `position`
- `ADJACENT`: painel lateral no desktop, topo no mobile.
- `NONE`: não exibe visualmente (executa em background).
- `COVER`: cobre o histórico de chat, mas mantém a caixa de texto.
- `FULLSCREEN`: ocupa toda a área abaixo do header.

Fonte: [chub_meta.yaml do template](https://github.com/CharHubAI/stage-template/blob/main/public/chub_meta.yaml)

---

## 4. API de Comunicação (postMessage / StageBase)

### 4.1 Comunicação Geral
A comunicação entre a UI do Chub e o Stage é feita pela biblioteca `@chub-ai/stages-ts`, que usa `postMessage` internamente. O desenvolvedor **não precisa implementar `postMessage` manualmente** — basta herdar `StageBase` e implementar seus métodos abstratos.

Fonte: [Concepts — Stage Lifecycle and Communication](https://docs.chub.ai/docs/stages/developing-a-stage/concepts.md)

### 4.2 Interface `StageBase`
Definida em `chub-stages-ts/src/types/stage.ts`:

```typescript
export abstract class StageBase<
  InitStateType,
  ChatStateType,
  MessageStateType,
  ConfigType
> {
  public generator: GenerationService;
  public messenger: MessagingService<ChatStateType>;
  public storage: StorageService;
  public mcp: McpServer;

  abstract load(): Promise<Partial<LoadResponse<...>>>;
  abstract setState(state: MessageStateType): Promise<void>;
  abstract beforePrompt(inputMessage: Message): Promise<Partial<StageResponse<...>>>;
  abstract afterResponse(botMessage: Message): Promise<Partial<StageResponse<...>>>;
  abstract render(): ReactElement;
}
```

Fonte: [chub-stages-ts/src/types/stage.ts](https://github.com/CharHubAI/chub-stages-ts/blob/main/src/types/stage.ts)

### 4.3 Pontos de Comunicação Top-Down

| Método | Quando é chamado | Retorno típico |
|--------|------------------|----------------|
| `constructor(data)` | Ao iniciar o chat | — |
| `load()` | Imediatamente após o construtor | `{success, error, initState, chatState}` |
| `beforePrompt(userMessage)` | Após o usuário enviar mensagem, antes do LLM | `{stageDirections, messageState, modifiedMessage, systemMessage, error, chatState}` |
| `afterResponse(botMessage)` | Após resposta do LLM | `{stageDirections, messageState, modifiedMessage, systemMessage, error, chatState}` |
| `setState(state)` | Ao trocar de branch (swipe/jump) | — |
| `render()` | Sempre que a UI precisa desenhar | `ReactElement` |

Fonte: [Concepts — Top-Down Communication Points](https://docs.chub.ai/docs/stages/developing-a-stage/concepts.md) e [stage-template/src/Stage.tsx](https://github.com/CharHubAI/stage-template/blob/main/src/Stage.tsx)

### 4.4 Tipo `InitialData`
Dados recebidos no construtor:

```typescript
interface InitialData<..., ConfigType> extends InitialState<...> {
  characters: { [key: string]: Character };
  users: { [key: string]: User };
  config: ConfigType | null;
  environment: 'development' | 'staging' | 'production' | 'testing';
  token: string;
  id: number;
  userId: string;
}
```

Fonte: [chub-stages-ts/src/types/initial.ts](https://github.com/CharHubAI/chub-stages-ts/blob/main/src/types/initial.ts)

### 4.5 Tipo `Message`
Usado em `beforePrompt` e `afterResponse`:

```typescript
interface Message {
  content: string;
  anonymizedId: string;
  isBot: boolean;
  promptForId: string | null;
  identity: string;
  isMain: boolean;
}
```

Fonte: [chub-stages-ts/src/types/message.ts](https://github.com/CharHubAI/chub-stages-ts/blob/main/src/types/message.ts)

### 4.6 Serviços Disponíveis no `StageBase`

#### `generator` — Geração multimídia (experimental/instável)
Métodos: `makeImage`, `imageToImage`, `inpaintImage`, `removeBackground`, `animateImage`, `makeVideo`, `makeMusic`, `makeSound`, `speak`, `textGen`, `modelGen`.

> "Note: of these, only {'makeImage', 'imageToImage', 'removeBackground', 'inpaintImage'} are implemented, and none of them are stable."  
> Fonte: [Concepts — Bottom-Up Communication Points](https://docs.chub.ai/docs/stages/developing-a-stage/concepts.md)

#### `messenger` — Mensagens para a UI do chat
Métodos: `impersonate`, `updateChatState`, `updateEnvironment`, `nudge`.

Fonte: [chub-stages-ts/src/services/messaging-service.ts](https://github.com/CharHubAI/chub-stages-ts/blob/main/src/services/messaging-service.ts)

#### `storage` — Persistência de arquivos/JSON por personagem/usuário
Suporta `get`, `set`, `clear`, `query`, `update` com escopo por personagem, usuário, persona ou chat local.

Fonte: [chub-stages-ts/src/services/storage-service.ts](https://github.com/CharHubAI/chub-stages-ts/blob/main/src/services/storage-service.ts)

#### `mcp` — Servidor MCP embutido
> `public mcp: McpServer;`  
> Fonte: [chub-stages-ts/src/types/stage.ts](https://github.com/CharHubAI/chub-stages-ts/blob/main/src/types/stage.ts)

### 4.7 Tipos de Estado
Três estados persistidos:

| Tipo | Escopo | Quando retornado | Uso típico |
|------|--------|------------------|------------|
| `initState` | Chat, gerado uma única vez | `load()` | Mapa procedural, configuração fixa |
| `messageState` | Por mensagem | `beforePrompt`, `afterResponse`, `setState` | Estado atual do personagem, posição, emoção |
| `chatState` | Todo o chat, todas as branches | `load`, `beforePrompt`, `afterResponse` | Fog of war, meta-comentário |

Fonte: [State](https://docs.chub.ai/docs/stages/developing-a-stage/state.md)

---

## 5. Restrições e Boas Práticas

### 5.1 Segurança e Isolamento
- O Stage roda em **iframe sandbox** hospedado em subdomínio separado.
- Não tem acesso a cookies/localStorage do Chub.
- Cada Stage roda em subdomínio diferente, isolando uns dos outros.
- Stages marcados como "Verified" foram revisados pela equipe do Chub.
- **Aviso oficial:** nunca forneça API keys ou senhas a nenhum Stage.

Fonte: [Overview — Is that secure?](https://docs.chub.ai/docs/stages/overview.md)

### 5.2 CORS e iframe
A documentação não detalha headers CORS específicos, mas deixa claro que:
- O Stage é hospedado em domínio separado.
- A comunicação é feita por `postMessage` encapsulado pela biblioteca oficial.
- O desenvolvedor não deve depender de `localStorage` do Chub; para persistência, deve usar o `storage` service oficial ou o state retornado pelos métodos do `StageBase`.

### 5.3 Boas Práticas
- **Evite trabalho pesado no `render()`** — deve apenas retornar o ReactElement.
- **Configuração é opcional:** mesmo com `config_schema`, o construtor/load deve lidar com `config` nulo ou parcial.
- **Use `messageState` por padrão** — `chatState` raramente é necessário e só deve ser usado para dados que transcendem branches (ex: fog of war).
- **Teste com `TestRunner.tsx`** em desenvolvimento; use `--mode staging` para live coding dentro do chat.
- **Não aguarde (`await`) gerações multimídia dentro de `beforePrompt`/`afterResponse`** — a API é instável.

Fontes: [Concepts](https://docs.chub.ai/docs/stages/developing-a-stage/concepts.md), [Config / Metadata](https://docs.chub.ai/docs/stages/developing-a-stage/config-metadata.md), [State](https://docs.chub.ai/docs/stages/developing-a-stage/state.md)

### 5.4 Requisitos de Build
- Comando de desenvolvimento: `yarn dev --host`
- Modo staging para live coding: `yarn dev --host --mode staging`
- Build de produção: `yarn build`
- O deploy zipa a pasta `dist/` e envia para a API do Chub.

Fonte: [Quickstart / Setup](https://docs.chub.ai/docs/stages/developing-a-stage/quickstart-setup.md)

---

## 6. Repositório Antigo — Estrutura e Estado

**Repositório:** `https://github.com/Travelmond/Eros-Status-Stage`

### 6.1 Estrutura de Pastas e Arquivos (branch `main`)

```text
.github/workflows/
public/
src/
styles/
.eslintrc.cjs
.gitignore
DESIGN-SPEC.md
LICENSE.txt
README.md
demo.GIF
index.html
package.json
tsconfig.json
tsconfig.node.json
vite.config.ts
yarn.lock
```

Fonte: [GitHub — Eros-Status-Stage](https://github.com/Travelmond/Eros-Status-Stage)

### 6.2 Presença de `chub_meta.yaml`
**Sim**, localizado em `public/chub_meta.yaml`.

Conteúdo identificado:
```yaml
project_name: "Eros Status Stage"
tagline: "Visual novel-style status panel for Eros Status System 3.0..."
visibility: 'PUBLIC'
position: 'FULLSCREEN'
config_schema:
  type: object
  properties:
    health:
      type: integer
      default: 100
state_schema:
  init: { ... }
  message: { ... }
  chat: { ... }
github_path: 'https://github.com/Travelmond/Eros-Status-Stage'
extension_id: 'eros-status-stage-b47cccbfa255'
```

Fonte: [public/chub_meta.yaml](https://github.com/Travelmond/Eros-Status-Stage/blob/main/public/chub_meta.yaml)

### 6.3 Versão do Código e Dependências

`package.json` identificado:

```json
{
  "name": "@chub-ai/stage-template",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@chub-ai/stages-ts": "^0.3.7",
    "@typescript-eslint/parser": "^7.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite-plugin-dts": "^3.9.1"
  },
  "engines": { "node": "21.7.1" },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^4.6.0",
    "sass": "^1.72.0",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

Fonte: [package.json](https://github.com/Travelmond/Eros-Status-Stage/blob/main/package.json)

**Observações:**
- O `name` ainda é `@chub-ai/stage-template`, indicando que o projeto foi gerado a partir do template e não renomeado.
- A biblioteca `@chub-ai/stages-ts` está na versão `^0.3.7`.
- Não há Tailwind CSS, Framer Motion, shadcn/ui, lucide-react, date-fns, lodash, recharts, zod, react-leaflet, three.js nem OpenRouter no `package.json` antigo.

### 6.4 Arquivos Principais

| Arquivo | Estado |
|---------|--------|
| `src/Stage.tsx` | Implementação principal (~740 linhas), importa `ErosStatusApp` e tipos customizados (`./types/eros-status`, `./core/state`, `./systems/integration/stageHooks`, etc.) |
| `src/main.tsx` | Padrão React 18 com `ReactDOM.createRoot` |
| `src/App.tsx` | Não visualizado diretamente, mas provavelmente similar ao template |
| `vite.config.ts` | Configuração dual: app (`mode != 'lib'`) e biblioteca (`mode == 'lib'`) |
| `.github/workflows/deploy.yml` | Action completa de deploy para Chub |

### 6.5 Diferenças Grosseiras em Relação à Documentação Local (`/docs`)

A documentação local (`docs/01-ARQUITETURA.md`, `docs/00-INDICE.md`, etc.) descreve uma aplicação standalone rica:

| Aspecto | Documentação Local `/docs` | Repositório Antigo / Oficial Chub |
|---------|---------------------------|-----------------------------------|
| Stack | React 18.2 + Vite 6.1 + Tailwind 3.4 + shadcn/ui + Framer Motion | React 18.2 + Vite 5.2 + SASS, sem Tailwind/shadcn |
| Persistência | `localStorage` via `characterStateService.js` | State oficial do `StageBase` (`messageState`, `chatState`, `initState`) |
| Comunicação | Listener `postMessage` manual + parse inline | `StageBase` da biblioteca oficial |
| Parser | `erosParser.js` (~1.368 linhas) | Parser customizado dentro de `Stage.tsx` |
| Roteamento | `react-router-dom` (dev) | Nenhum |
| Data fetching | `@tanstack/react-query`, `@base44/sdk` | Nenhum |
| IA externa | OpenRouter API | Nenhuma |
| UI | 49 componentes shadcn/ui + painéis customizados | Componentes customizados provavelmente menores |

**Pontos de desatualização/apontamentos:**

1. **Versão da biblioteca Stage:** o repositório antigo usa `@chub-ai/stages-ts@^0.3.7`. A biblioteca atual (`chub-stages-ts`) já inclui `messenger`, `storage` e `mcp`, que não existiam ou não eram expostos naquela versão.
2. **Modelo de persistência:** a documentação local assume persistência em `localStorage`, mas o modelo oficial do Chub persiste estado através dos retornos de `beforePrompt`/`afterResponse`/`load`. O `localStorage` dentro do iframe sandbox pode ser limpo ou inacessível dependendo do subdomínio/escopo.
3. **Comunicação manual vs. abstração:** a documentação local menciona "listener `postMessage`" e "deploy standalone como iframe". O modelo oficial abstrai isso via `StageBase` — o desenvolvedor não deve implementar `postMessage` manualmente.
4. **Stack divergente:** a documentação local lista Vite 6.1, Tailwind, shadcn/ui, Framer Motion, OpenRouter, etc. Nenhuma dessas dependências aparece no `package.json` antigo.
5. **Arquitetura de pastas:** a documentação local prevê `src/lib/`, `src/services/`, `src/pages/`, `src/components/terminal/`, etc. O repositório antigo tem `src/`, `styles/` e aparentemente menos modularização.
6. **Página `DESIGN-SPEC.md` no repositório antigo:** existe um arquivo `DESIGN-SPEC.md` na raiz que pode conter especificações antigas; não foi possível inspecionar seu conteúdo sem fetch adicional.

### 6.6 Recomendação para o Novo Projeto
- Usar o template oficial atualizado (`CharHubAI/stage-template`) como base.
- Implementar `StageBase` com os tipos corretos (`InitStateType`, `ChatStateType`, `MessageStateType`, `ConfigType`).
- Mapear o parser `erosParser.js` para dentro dos métodos `beforePrompt`/`afterResponse`, retornando `messageState` adequado.
- Substituir `localStorage` manual pelo `storage` service oficial ou pelo state retornado do `StageBase` quando possível.
- Renomear o pacote em `package.json` e atualizar as dependências para refletir a stack da documentação local.
- Preservar o código antigo na branch `old`, conforme o manifesto de intenção.

---

## 7. Links e Fontes

### Documentação Oficial Chub Venus AI
| Título | URL |
|--------|-----|
| Getting Started | https://docs.chub.ai/docs/the-basics/getting-started.md |
| Stages — Índice | https://docs.chub.ai/docs/stages.md |
| Stages — Overview | https://docs.chub.ai/docs/stages/overview.md |
| Developing a Stage | https://docs.chub.ai/docs/stages/developing-a-stage.md |
| Quickstart / Setup | https://docs.chub.ai/docs/stages/developing-a-stage/quickstart-setup.md |
| Concepts | https://docs.chub.ai/docs/stages/developing-a-stage/concepts.md |
| Config / Metadata | https://docs.chub.ai/docs/stages/developing-a-stage/config-metadata.md |
| State | https://docs.chub.ai/docs/stages/developing-a-stage/state.md |
| Examples / Resources | https://docs.chub.ai/docs/stages/developing-a-stage/examples-resources.md |
| Future Directions | https://docs.chub.ai/docs/stages/developing-a-stage/future-directions.md |
| Optional: GitHub Codespaces | https://docs.chub.ai/docs/stages/developing-a-stage/optional-github-codespaces.md |
| Using a Stage | https://docs.chub.ai/docs/stages/using-a-stage.md |
| Índice completo (llms.txt) | https://docs.chub.ai/docs/llms.txt |

### Repositórios Oficiais e de Exemplo
| Título | URL |
|--------|-----|
| Stage Template | https://github.com/CharHubAI/stage-template |
| chub-stages-ts (biblioteca) | https://github.com/CharHubAI/chub-stages-ts |
| expressions-extension | https://github.com/CharHubAI/expressions-extension |
| maze-extension | https://github.com/lloorree/maze-extension |
| extension-integration-test | https://github.com/CharHubAI/extension-integration-test |

### Repositório do Projeto Antigo
| Título | URL |
|--------|-----|
| Travelmond/Eros-Status-Stage | https://github.com/Travelmond/Eros-Status-Stage |
| package.json | https://github.com/Travelmond/Eros-Status-Stage/blob/main/package.json |
| public/chub_meta.yaml | https://github.com/Travelmond/Eros-Status-Stage/blob/main/public/chub_meta.yaml |
| src/Stage.tsx | https://github.com/Travelmond/Eros-Status-Stage/blob/main/src/Stage.tsx |
| src/main.tsx | https://github.com/Travelmond/Eros-Status-Stage/blob/main/src/main.tsx |
| vite.config.ts | https://github.com/Travelmond/Eros-Status-Stage/blob/main/vite.config.ts |
| .github/workflows/deploy.yml | https://github.com/Travelmond/Eros-Stage/blob/main/.github/workflows/deploy.yml |

### Documentação Local do Projeto Atual
| Título | Caminho |
|--------|---------|
| Manifesto de Intenção | `/docs/management/manifesto_de_intencao.md` |
| Índice Mestre | `/docs/00-INDICE.md` |
| Arquitetura | `/docs/01-ARQUITETURA.md` |

---

## Apêndice: Links Relevantes Adicionais Encontrados em `docs.chub.ai`

Além dos links solicitados, foram identificados na documentação oficial:

1. **`/docs/stages/overview.md`** — Visão geral de segurança e conceito de Stage; explica sandbox de iframe e selo "Verified".
2. **`/docs/stages/developing-a-stage/optional-github-codespaces.md`** — Guia alternativo de desenvolvimento usando GitHub Codespaces, incluindo live coding remoto.
3. **`/docs/llms.txt`** — Índice completo de toda a documentação do Chub AI em formato texto.
4. **`/docs/the-basics/getting-started.md`** — Introdução geral à plataforma Chub.
5. **`/docs/patch-notes/0.5.7.md`** — Notas de patch da plataforma (menção em llms.txt, não inspecionado).

Esses links foram incluídos na seção 7 (Links e Fontes).
