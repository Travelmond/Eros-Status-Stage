# Manifesto de Intenção — Eros Status Stage

> **Agente:** `@agente-de-intencao`  
> **Projeto:** Eros Status Terminal (ESS) para Chub Venus AI  
> **Data:** 15 de Agosto de 2026  
> **Versão:** 1.0

---

## 1. Visão Humana / Intenção Completa

O usuário quer **materializar o código funcional** do **Eros Status Terminal (ESS)**, um Stage para a plataforma **Chub Venus AI**. A intenção é transformar a documentação existente em código real, organizado corretamente, e preparar o projeto para deploy como um Stage no Chub.

A motivação é que existe uma versão anterior desatualizada no GitHub (`https://github.com/Travelmond/Eros-Status-Stage`) e o usuário quer recomeçar a partir da documentação atual (`/docs`), usando também a documentação oficial do Chub Venus AI como referência técnica de implementação de Stages.

A expectativa é que o projeto seja reconstruído de forma funcional, com estrutura de pastas correta, e que o GitHub seja organizado com branches separadas para preservar o histórico e controlar a qualidade do deploy.

---

## 2. Objetivos

### 2.1 Objetivo Principal
- Criar um **Stage funcional para Chub Venus AI** chamado **Eros Status Terminal**.
- O Stage deve receber a saída de texto da IA em tempo real, fazer parse dos marcadores de status e renderizar um painel visual cyberpunk com progressões, estado emocional, pensamentos, roupas, inventário, localização, avatar, metas, NPCs, módulos de sexo/reação/NTR e prompts de imagem.

### 2.2 Objetivos Técnicos
- **Organizar as pastas corretamente** com base na documentação existente em `/docs`.
- **Materializar o código funcional** a partir da documentação dividida em 10 arquivos (`00-INDICE.md`, `01-ARQUITETURA.md` ... `10-MISC.md`) e do arquivo `ARQUITETURA_COMPLETA.md`.
- **Criar o Stage no Chub Venus AI**, seguindo o template oficial e as convenções da plataforma.
- **Consultar a documentação oficial do Chub Venus AI** para garantir conformidade técnica:
  - `https://docs.chub.ai/docs/stages/developing-a-stage`
  - `https://docs.chub.ai/docs/stages/developing-a-stage/quickstart-setup`
  - `https://docs.chub.ai/docs/stages/developing-a-stage/concepts`
  - `https://docs.chub.ai/docs/stages/developing-a-stage/config-metadata`
  - `https://docs.chub.ai/docs/stages/developing-a-stage/state`
  - `https://docs.chub.ai/docs/stages/developing-a-stage/examples-resources`
  - `https://docs.chub.ai/docs/stages/developing-a-stage/future-directions`
  - `https://docs.chub.ai/docs/stages/using-a-stage`
- **Criar documentação própria** em `/docs` com base nas informações coletadas da documentação do Chub, de forma a manter o conhecimento acessível no repositório local.
- **Atualizar o repositório GitHub** `https://github.com/Travelmond/Eros-Status-Stage`:
  - Mover o código antigo/desatualizado para uma branch chamada **`old`**.
  - Desenvolver e fazer push do novo código na branch **`dev`**.
  - Promover para a branch **`main`** **somente quando o usuário explicitamente solicitar**, após validação de que tudo está funcionando corretamente.

### 2.3 Objetivos de Qualidade
- Garantir que o código seja funcional, sem erros de build e compatível com o template de Stage do Chub.
- Preservar as funcionalidades documentadas: parser `erosParser.js`, middleware `stateMiddleware.js`, auditoria de consistência, memória híbrida, sistema de relacionamentos, módulos sex/reação/NTR, painel de imagem, persistência em `localStorage` e integração OpenRouter.
- Manter o deploy standalone funcional: o núcleo `ErosTerminal` deve poder ser embarcado como iframe no Chub.

---

## 3. Anti-Objetivos

- **Não modificar o código da branch `main` sem autorização explícita do usuário.**
- **Não descartar a versão antiga do GitHub** — ela deve ser preservada na branch `old`.
- **Não criar dependências de backend** desnecessárias: o Stage é 100% client-side.
- **Não adicionar funcionalidades não documentadas** sem aprovação prévia.
- **Não fazer push direto para `main`** — o fluxo deve ser `dev` → validação → `main` sob demanda.
- **Não ignorar a documentação oficial do Chub** ao criar o Stage; a conformidade com `chub_meta.yaml`, `StageBase`, ciclo de vida do Stage e state schemas deve ser prioridade.

---

## 4. Critério de Fidelidade

Para considerar o trabalho concluído com fidelidade, os seguintes critérios devem ser atendidos:

1. **Estrutura de pastas correta**: o repositório deve refletir a estrutura documentada em `docs/01-ARQUITETURA.md` e `ARQUITETURA_COMPLETA.md`, com `src/`, `public/`, `docs/`, configurações de raiz e arquivos do Stage.
2. **Código funcional**: `npm install` e `npm run dev` (ou `yarn dev`) devem executar sem erros fatais.
3. **Stage reconhecido pelo Chub**: o arquivo `public/chub_meta.yaml` deve estar presente e configurado de acordo com a documentação do Chub (`config-metadata`).
4. **Integração com Stage API**: o `ErosTerminal` deve escutar mensagens `postMessage` do Chub e implementar a interface `StageBase` (inicialização, `beforePrompt`, `afterResponse`, `setState`, `render`).
5. **Parser e middleware operacionais**: `erosParser.js` e `stateMiddleware.js` devem processar corretamente o estado vindo da IA e aplicar validações/auditorias.
6. **Persistência funcionando**: `characterStateService.js` e `memoryService.js` devem manter estado entre turnos usando `localStorage`.
7. **Branches Git corretas**:
   - `old` contendo o código antigo do repositório original.
   - `dev` contendo o novo código funcional.
   - `main` **inalterada** até o usuário aprovar a promoção.
8. **Documentação complementar**: resumos ou arquivos baseados na documentação oficial do Chub devem estar disponíveis em `/docs` para referência futura.

---

## 5. Contexto

### 5.1 Sobre o Projeto
O **Eros Status Terminal (ESS)** é um painel visual cyberpunk embarcado como Stage iframe na plataforma Chub Venus AI. Ele extrai blocos de status inline das respostas da IA e os renderiza em um painel lateral dedicado, reduzindo poluição na narrativa e consumo de tokens.

### 5.2 Stack Tecnológica
- React 18 + Vite 6 + Tailwind CSS 3.4
- shadcn/ui (new-york style) + Radix UI
- Framer Motion, lucide-react
- OpenRouter API (fetch nativo)
- Persistência em `localStorage`

### 5.3 Documentação Local Disponível
- `docs/00-INDICE.md` — índice mestre
- `docs/01-ARQUITETURA.md` — arquitetura, SRS, fluxos, contrato JSON
- `docs/02-CONFIGS_RAIZ.md` — configs de raiz e `src/index.css`
- `docs/03-PAGES.md` — páginas Terminal, Demo, SRS
- `docs/04-TERMINAL_CORE.md` — componentes core do terminal
- `docs/05-TERMINAL_PANELS_A.md` e `B` — painéis auxiliares
- `docs/06-LIB_PARSER.md` — parser principal
- `docs/07-LIB_MIDDLEWARE.md` — middleware híbrido
- `docs/08-LIB_SYSTEMS.md` — serviços de memória, auditoria, relacionamento
- `docs/09-SERVICES.md` — OpenRouter e character state
- `docs/10-MISC.md` — deploy standalone e componentes diversos
- `docs/ARQUITETURA_COMPLETA.md` — documento canônico consolidado

### 5.4 Documentação Oficial do Chub Venus AI
A implementação deve ser compatível com o framework de Stages do Chub, descrito em:
- `https://docs.chub.ai/docs/stages/developing-a-stage`
- `https://docs.chub.ai/docs/stages/developing-a-stage/quickstart-setup`
- `https://docs.chub.ai/docs/stages/developing-a-stage/concepts`
- `https://docs.chub.ai/docs/stages/developing-a-stage/config-metadata`
- `https://docs.chub.ai/docs/stages/developing-a-stage/state`
- `https://docs.chub.ai/docs/stages/developing-a-stage/examples-resources`
- `https://docs.chub.ai/docs/stages/developing-a-stage/future-directions`
- `https://docs.chub.ai/docs/stages/using-a-stage`

### 5.5 Repositório GitHub
- URL: `https://github.com/Travelmond/Eros-Status-Stage`
- Código atual (antigo/desatualizado) está na branch padrão.
- Deve ser reorganizado em:
  - `old` — snapshot do código antigo
  - `dev` — código novo em desenvolvimento
  - `main` — estável, só atualizada por solicitação explícita do usuário

---

## 6. Notas para os Próximos Agentes

- Este manifesto é a **âncora de intenção**. Qualquer decisão técnica deve estar alinhada com os objetivos, anti-objetivos e critérios de fidelidade aqui descritos.
- O fluxo recomendado é:
  1. Planejador primário faz perguntas categorizadas ao usuário.
  2. `tradutor-tiers` gera contratos JSON de execução.
  3. Arquiteto-Geral distribui para arquitetos especializados (UI/UX, Backend, Banco).
  4. Tier 3 (devs) implementa seguindo os contratos.
  5. `equipe-revisao` audita obrigatoriamente após a implementação.
- **Não escrever código nesta etapa.** Este documento é apenas o manifesto de intenção.
