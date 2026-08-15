# Débito Técnico — Eros Status Terminal (ESS) v3.0

> Documento vivo com os débitos técnicos identificados na revisão do ESS v3.0 e recomendações de mitigação.

---

## 1. Resumo executivo

A revisão `2026-08-15` (iteração 1/3) reprovou o entregável por findings críticos e altos. Este documento consolida os débitos que ainda precisam ser endereçados, com ênfase na atualização da biblioteca StageBase, nos problemas de persistência no iframe do Chub e nos apontamentos médios levantados pelo time de revisão.

| Prioridade | Débito | Owner sugerido | Status |
|---|---|---|---|
| Crítico | Ausência total de testes | @testador + @dev-backend | Pendente |
| Crítico | Estado crítico em `localStorage` | @dev-backend | Pendente |
| Alto | `@chub-ai/stages-ts` desatualizado | @dev-backend | Concluído (^0.4.0) |
| Alto | Deploy dev/main com risco de sobreposição | @devops | Corrigido em workflow, depende de secrets |
| Médio | Cores hardcoded fora do design system (M1) | @dev-frontend | Pendente |
| Médio | `render()` do StageBase com side-effects (M7) | @dev-backend | Pendente |
| Médio | `memoryService.ts` adapter não persiste (M8) | @dev-backend | Pendente |

---

## 2. Atualização de `@chub-ai/stages-ts` (^0.3.7 → ^0.4.0, roadmap ^0.5.2)

### 2.1 Situação atual

- **Versão instalada:** `^0.4.0` (publicada em 2025-01; compatível com React 18).
- **Versão latest no npm:** `^0.5.2` (publicada em 2025-10-02; requer React 19).
- **Repositório upstream:** `CharHubAI/chub-stages-ts`.
- **Status:** atualização conservadora para `^0.4.0` concluída sem regressões de build/typecheck. Migração para `^0.5.2` permanece como roadmap futuro.

### 2.2 O que mudou no upstream (commits relevantes)

| Período | Mudança | Impacto no ESS |
|---|---|---|
| 2024-11 | `bump timeout` | Pouco impacto — ajuste interno de timeout. |
| 2025-01 | `imagine new fields` (v0.4.0) | Novos campos no `StageBase`; possíveis tipos adicionais. |
| 2025-06 | `tool extraction` / `extraction tools` | Novo utilitário `extract-tools` para extração de ferramentas. |
| 2025-07 | `alpha commit for storage api` (v0.5.0-alpha) | Introduz **storage service** no `StageBase` — alternativa oficial ao `localStorage`. |
| 2025-07 | `storage stabilization and 3D sketchout` (v0.5.1-alpha) | Estabilização do storage API. |
| 2025-08 | `upgrade to node 24` (v0.5.1) | Engine mínima passa para Node `>=24.2.0`. |
| 2025-10 | `mcp-style tool calling` (v0.5.2) | Integração com `@modelcontextprotocol/sdk`; suporte a tool calling estilo MCP. |

### 2.3 Dependências de versão

A tabela abaixo mostra o conflito direto entre a stack atual do ESS e a `v0.5.2`:

| Pacote | ESS atual | `v0.4.0` | `v0.5.2` |
|---|---|---|---|
| `react` | `^18.2.0` | `^18.2.79` ✅ compatível | `^19.1.1` ❌ requer migração |
| `react-dom` | `^18.2.0` | `^18.2.79` ✅ | `^19.1.1` ❌ |
| `typescript` | `^5.8.2` | `^5.4.5` / `^5.8.3` | `^5.9.2` |
| `uuid` | — (transitiva) | `^9.0.1` | `^11.1.0` |
| `@ffmpeg/ffmpeg` | — | `^0.12.10` | `^0.12.15` |
| `@modelcontextprotocol/sdk` | — | — | `^1.18.2` |
| `engines.node` | `>=20.0.0` | `21.7.1` | `>=24.2.0` |

### 2.4 Riscos

1. **Risco de compatibilidade React:** a `v0.5.2` exige React 19. Atualizar diretamente quebrará a build e pode exigir adaptações em componentes, hooks e tipagens.
2. **Risco de API obsoleta:** a `v0.3.7` não expõe o `storage` service oficial. Continuar usando `localStorage` dentro do iframe sandbox é **fragilidade conhecida** (ver C3).
3. **Risco de segurança/estabilidade:** versões antigas podem não receber correções relacionadas ao sandbox ou ao novo modelo de tool calling.
4. **Risco de build Node:** a `v0.5.1+` exige Node 24. O ambiente de CI já usa `24.x`, mas o `engines` do ESS ainda permite `>=20.0.0`.

### 2.5 Recomendação

A atualização conservadora para `^0.4.0` foi concluída. Não atualizar para `^0.5.2` sem antes migrar a stack para React 19. Estratégias:

#### Opção A — Atualização conservadora (concluída)

- ✅ Atualizar para `^0.4.0` (última versão estável compatível com React 18).
- ✅ Revisar novos campos/tipos introduzidos e ajustar `src/types/chub.ts` se necessário.
- ✅ Testar build (`npm run typecheck && npm run build`) com `^0.4.0`.
- **Status:** Concluído.

#### Opção B — Atualização completa (médio/longo prazo)

- Migrar ESS para React 19 + TypeScript 5.9 + Node 24.
- Depois adotar `^0.5.2` e refatorar persistência para usar o `storage` service oficial do StageBase.
- **Prioridade:** Média (após estabilizar v3.0).
- **Esforço estimado:** Alto.

### 2.6 Ações concretas

- [x] Verificar diff de tipos entre `0.3.7` e `0.4.0`.
- [x] Testar build (`npm run typecheck && npm run build`) com `^0.4.0`.
- [x] Atualizar `package.json` e `package-lock.json`.
- [ ] Documentar no `README.md` a versão suportada do StageBase.
- [ ] Criar tarefa de roadmap para migração `0.5.x` (React 19).

---

## 3. Outros débitos identificados na revisão

### 3.1 M1 — Cores hardcoded fora do design system

**Descrição:** vários componentes do terminal usam cores literais (`#0A0A0A`, `#050505`, `#ffffff30`, `#FF2D78`, etc.) e valores Tailwind (`text-gray-300`, `bg-black/30`) que não estão mapeados no design system de CSS variables.

**Exemplos encontrados:**

- `EmotionPanel.tsx`: `background: '#050505'`, `background: '#00000090'`.
- `NTRPanel.tsx`: `background: '#0A0A0A'`, `background: '#ffffff10'`.
- `RelationshipPanel.tsx`: `color = '#00FFF5'`, `color: '#ffffff40'`, `Badge color="#FF2D78"`.
- `TerminalHeader.tsx`: `background: '#00000060'`.
- `ErosTerminal.tsx`: `color: '#e2e8f0'`, `color: '#ffffff30'`, `border: '1px solid var(--neon-cyan)30'`.
- `AuditPanel.tsx`, `MiniMapPanel.tsx`, `ImagePromptPanel.tsx`, `NTRModal.tsx`: múltiplas cores literais.

**Risco:**

- Dificulta manutenção de tema.
- Quebra a estética cyberpunk se as variáveis do tema forem alteradas.
- CSS inline inválido em casos como `var(--neon-cyan)30` (A3).

**Mitigação:**

- Mapear todas as cores para tokens em `src/index.css` (ex.: `--terminal-panel-bg`, `--terminal-text-muted`, `--neon-danger`).
- Substituir inline styles por classes utilitárias customizadas ou `style` baseado em variáveis.
- Adicionar lint para proibir cores literais em novos componentes.

**Prioridade:** Média.  
**Owner:** @dev-frontend.

---

### 3.2 M7 — `render()` do StageBase com side-effects via `onParse`

**Descrição:** em `src/Stage.tsx`, o método `render()` retorna:

```tsx
<ErosTerminal
  state={this.messageState}
  chatState={this.chatState}
  config={this.config}
  onParse={(text) => {
    void this.afterResponse({ content: text, isBot: true, ... });
  }}
/>
```

O handler `onParse` dispara `afterResponse` durante a renderização, causando **side-effect no ciclo de vida de render do React**. Em React 18 isso pode causar warnings; em React 19 com Strict Mode pode entrar em loop.

**Risco:**

- Violação do princípio de que `render()` deve ser puro.
- Potencial loop de renderização quando o test runner standalone envia texto.
- Dificulta testes unitários do StageBase.

**Mitigação:**

- Mover o parse para fora do `render`: usar um callback seguro (memoizado com `useCallback` em componente wrapper) ou expor um método explícito do Stage para testes.
- No modo standalone (`App.tsx`), chamar `stage.afterResponse()` diretamente em vez de passar `onParse` para o terminal.
- No Chub, o parse real acontece em `afterResponse` — `onParse` deve ser opcional e não disparar efeitos colaterais durante render.

**Prioridade:** Média.  
**Owner:** @dev-backend.

---

### 3.3 M8 — `memoryService.ts` adapter não persiste

**Descrição:** `src/systems/memory.ts` implementa memória de curto e longo prazo **apenas dentro do `chatState`** do StageBase. Embora existam funções `loadMemoryCache`/`saveMemoryCache` usando `localStorage`, elas são:

1. **Não essenciais** — usadas apenas como cache opcional.
2. **Não confiáveis** — o Stage roda em iframe sandbox; `localStorage` pode ser limpo ou inacessível.
3. **Não integradas ao StageBase** — a `v0.5.x` oferece um `storage` service oficial que deveria ser o adapter principal.

Além disso, `condenseChatMemory` executa condensação local sem limite de tokens e sem persistir o resumo no backend do Chub de forma explícita (além do retorno de `chatState`).

**Risco:**

- Perda de memória de longo prazo em cenários de sandbox restrito.
- Escalada de tamanho do `chatState` se a condensação não for acionada regularmente.
- Incompatibilidade futura com a API de storage oficial.

**Mitigação:**

- Após atualizar para `0.4.0`/`0.5.x`, usar o `storage` service do StageBase para persistir memória de longo prazo.
- Remover dependência de `localStorage` para estado essencial (ver C3).
- Adicionar testes para `condenseChatMemory` garantindo limites de fatos e tamanho do narrativo.

**Prioridade:** Média.  
**Owner:** @dev-backend.

---

## 4. Plano de mitigação por prioridade

### 4.1 Curto prazo (próxima iteração de revisão)

1. **C1 — Testes:** adicionar script `test` no `package.json` e criar testes para `parser.ts`, `middleware.ts`, `audit.ts` e `state.ts`.
2. **C3 — localStorage:** remover `saveCharacterCache`/`loadCharacterCache` do ciclo de vida do StageBase; garantir que estado crítico flua apenas por `messageState`/`chatState`.
3. **C2 — Deploy:** validar que `CHUB_EXTENSION_ID_DEV` está configurado e que `main` não sobrescreve o Stage de `dev`.
4. **A3 — CSS inline inválido:** corrigir construções do tipo `var(--color)30` para `rgba(var(--color-rgb), 0.3)` ou tokens equivalentes.

### 4.2 Médio prazo (após aprovação da revisão)

1. **M1 — Hardcoded colors:** mapear tokens e refatorar componentes restantes.
2. **M8 — Memory adapter:** integrar ao storage service oficial do StageBase (`^0.5.x`) ou garantir persistência via `chatState` sem `localStorage`.

### 4.3 Longo prazo

1. Avaliar migração para React 19 + Node 24 + `@chub-ai/stages-ts@^0.5.2`.
2. Adotar tool calling/MCP se fizer sentido para o negócio do ESS.

---

## 5. Referências

- Relatório de revisão: `/docs/testing/revisao-2026-08-15_00-00.md`
- Mapeamento de estado: `/docs/architecture/state-mapping.md`
- Estratégia de branches: `/docs/deployment/branch-strategy.md`
- Workflows de deploy: `/docs/deployment/github-actions.md`
- Repositório upstream: `https://github.com/CharHubAI/chub-stages-ts`
- Pacote npm: `https://www.npmjs.com/package/@chub-ai/stages-ts`
