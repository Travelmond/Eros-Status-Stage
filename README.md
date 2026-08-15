# Eros Status Terminal v3.0

Stage para **Chub Venus AI** que renderiza um painel visual cyberpunk de status, progressões, inventário, localização, NPCs e módulos NSFW a partir dos marcadores de texto gerados pela IA.

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3.4
- `@chub-ai/stages-ts` (StageBase)
- Framer Motion, lucide-react
- OpenRouter API via fetch nativo

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Para testar dentro do Chub em modo staging:

```bash
npm run dev -- --host --mode staging
```

## Build

```bash
npm run build
```

## Lint / Type-check

```bash
npm run lint
npm run typecheck
```

## Estrutura

```text
src/
  Stage.tsx                 # Entrypoint do StageBase
  App.tsx                   # Modo standalone para testes locais
  main.tsx                  # Ponto de entrada React
  core/
    parser.ts               # Parser framework-agnostic
    middleware.ts           # Validacoes, gating, auto-tab, notificacoes
    audit.ts                # Auditor passivo de consistencia
    state.ts                # Defaults e helpers de imutabilidade
  systems/
    memory.ts               # Memoria hibrida via chatState
    relationships.ts        # Sistema de relacionamentos
    sexPositions.ts         # Biblioteca de posicoes
  services/
    openRouter.ts           # Integracao OpenRouter (fetch nativo)
    characterState.ts       # Merge/persistencia logica (chatState + cache opcional)
  components/terminal/
    ErosTerminal.tsx        # Painel visual (entregue pelo T01)
  types/                    # Tipagens ESS + Chub
public/
  chub_meta.yaml            # Metadados do Stage
```

## Persistencia

- **messageState**: estado critico do personagem (personagem, progressoes, inventario, local, etc.).
- **chatState**: fog-of-war/mapa, memoria de longo prazo, historico de turnos.
- **localStorage**: apenas cache opcional de backup e preferencias locais.
- **API keys**: nunca sao persistidas. Vem da configuracao segura do Chub (`config_schema` com `secret: true`).

## Deploy

O deploy e feito automaticamente via GitHub Actions para `api.chub.ai/extension/{id}/upload`. Veja o contrato T04 para detalhes de CI/CD e branches (`old`, `dev`, `main`).
