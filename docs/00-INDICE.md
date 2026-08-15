# EROS STATUS TERMINAL — Índice Mestre de Documentação

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-API-FF2D78?logo=openai&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Chub_Venus_AI-00FFF5)

> **Referência canônica standalone.** O código-fonte completo do projeto é demasiado extenso para um único arquivo (a plataforma limita arquivos a 2.000 linhas; o código real excede 10.000). Por isso a documentação foi dividida em arquivos focados dentro de `docs/`. Este `COMPLETO.md` é o **índice mestre** que organiza e aponta para cada parte.

**Versão:** 3.0 · **Data:** Agosto 2026 · **Projeto:** Eros-Status-Stage

---

## 📂 Estrutura da Documentação

A documentação completa está em `src/docs/`, dividida em 10 arquivos:

| # | Arquivo | Conteúdo | Linhas aprox. |
|---|--------|----------|---------------|
| 1 | `docs/01-ARQUITETURA.md` | Objetivo, tecnologias, estrutura de pastas, diagramas Mermaid (arquitetura, pipeline, UML, ERD), SRS DOCS, fluxos (sequence diagrams), contrato JSON Schema | ~600 |
| 2 | `docs/02-CONFIGS_RAIZ.md` | `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `jsconfig.json`, `components.json`, `eslint.config.js`, `.gitignore`, `index.html`, `base44/config.jsonc`, `README.md`, `src/index.css` | ~520 |
| 3 | `docs/03-PAGES.md` | `src/pages/Terminal.jsx` (completo), `src/pages/Demo.jsx` (completo), `src/pages/SRS.jsx` (resumo + referência) | ~700 |
| 4 | `docs/04-TERMINAL_CORE.md` | `ErosTerminal.jsx` (completo) + `TerminalHeader`, `CharacterPanel`, `TerminalTabs`, `ProgressionsPanel`, `DetailsPanel`, `GoalsPanel`, `RawOutputPanel`, `NeonProgressBar`, `AvatarPanel` (completos) + `MiniMapPanel`, `NPCPanel` (resumos) | ~740 |
| 5a | `docs/05-TERMINAL_PANELS_A.md` | `IMGPanel.jsx` (completo, 584 linhas) + `SexPanel.jsx` (completo) + `AIConfigPanel`/`AIProviderSection` (resumos) | ~550 |
| 5b | `docs/05-TERMINAL_PANELS_B.md` | `ConfigPanel`, `CorrectionAlert`, `AuditPanel`, `RelationshipPanel`, `NotificationToast`, `NTRModal`, `ASCIIPositionViewer`, `BodyDescCharPanel`, `BodyDescPanel`, `InventoryPanel`, `ReactionPanel` (todos completos) | ~800 |
| 6 | `docs/06-LIB_PARSER.md` | `src/lib/erosParser.js` (parser principal, COMPLETO — 1.368 linhas de JS puro) | ~700 |
| 7 | `docs/07-LIB_MIDDLEWARE.md` | `src/lib/stateMiddleware.js` (middleware híbrido, COMPLETO — 536 linhas) | ~300 |
| 8 | `docs/08-LIB_SYSTEMS.md` | `memoryService.js`, `consistencyAuditor.js`, `relationshipSystem.js`, `sexPositionsLibrary.js`, `utils.js`, `app-params.js`, `query-client.js` (completos) + `AuthContext`/`PageNotFound` (resumos) | ~650 |
| 9 | `docs/09-SERVICES.md` | `openRouterService.js`, `characterStateService.js` (completos) | ~280 |
| 10 | `docs/10-MISC.md` | `api/base44Client.js`, `hooks/use-mobile.jsx`, `utils/index.ts`, `main.jsx`, `App.jsx`, `ui/toaster.jsx` (completos) + `ProtectedRoute`/`UserNotRegisteredError` (resumos) + lista 49 componentes shadcn/ui + **guia de deploy standalone** | ~250 |

**Total:** ~6.090 linhas de documentação + código-fonte. Os arquivos maiores (`erosParser.js` 1.368 linhas, `IMGPanel.jsx` 584, `AIProviderSection.jsx` 592, `AIConfigPanel.jsx` 340, `SRS.jsx` 940, `MiniMapPanel.jsx` 328, `NPCPanel.jsx` 371) estão preservados integralmente no repositório e documentados com seu conteúdo completo ou resumo técnico detalhado conforme o limite de 2.000 linhas por arquivo da plataforma.

---

## 🎯 Resumo Executivo

O **Eros Status Terminal (ESS)** é um painel visual cyberpunk embarcado como *Stage iframe* na plataforma **Chub Venus AI**. Ele recebe a saída de texto da IA em tempo real, faz o *parse* dos marcadores de status do roleplay e renderiza — fora da janela de chat — progressões, estado emocional, pensamentos, roupas, inventário, localização com mini-mapa, avatar, metas, NPCs, módulos de sexo/reação/NTR e prompts de geração de imagem (ComfyUI/Civitai).

### Arquitetura em camadas
```
AI Output → erosParser → stateMiddleware (NTR gate + schema + coherence)
         → consistencyAuditor (passivo) → characterStateService (deepMerge + localStorage)
         → memoryService (hybrid) → React State → UI Components
```

### Deploy standalone
O núcleo `ErosTerminal` é **100% client-side**. Para deploy no Chub Venus AI: remover `App.jsx`, `Terminal.jsx`, `Demo.jsx`, `react-router-dom`, `@tanstack/react-query`, `@base44/sdk`; apontar `main.jsx` direto para `ErosTerminal`; adicionar listener `postMessage`. Ver `docs/10-DEPLOY.md`.

---

## 🚀 Como usar este índice

1. **Visão geral** → leia `docs/01-ARQUITETURA.md` (objetivo, diagramas, fluxos, schema).
2. **Reproduzir o projeto** → siga na ordem: `02-CONFIGS_RAIZ` → `03-PAGES` → `04-TERMINAL_CORE` → `05-TERMINAL_PANELS_A` → `05-TERMINAL_PANELS_B` → `06-LIB_PARSER` → `07-LIB_MIDDLEWARE` → `08-LIB_SYSTEMS` → `09-SERVICES` → `10-MISC`.
3. **Deploy** → seção Apêndice no final de `docs/10-MISC.md`.

Cada arquivo `docs/NN-*.md` é autossuficiente e contém o código-fonte integral (ou resumo técnico detalhado para arquivos que excederiam o limite) dos arquivos listados.

---

*Documento gerado automaticamente. Qualquer desenvolvedor pode reconstruir o projeto integralmente a partir dos arquivos em `docs/` + `npx shadcn-ui add` para os primitivos de UI.*