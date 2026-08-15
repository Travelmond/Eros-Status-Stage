# 🔧 Melhorias Propostas — Correções Iter2 → Iter3

## Ações Imediatas (antes de reativar `equipe-revisao`)

### 1. Completar A6 — Wiring do `AIConfigPanel`
- **Arquivo:** `src/components/terminal/ErosTerminal.tsx`, linha 281.
- **Mudança:** passar `config` e `onConfigChange` para `<AIConfigPanel>`.
- **Impacto:** fecha finding alto; evita nova rodada de revisão.
- **Exemplo:**
  ```tsx
  <AIConfigPanel
    config={config}
    onConfigChange={onConfigChange}
    onParsed={(text) => onParse?.(text)}
  />
  ```

### 2. Sincronizar documentação de A4
- **Arquivos:** `docs/architecture/tech-debt.md`, `docs/management/implementacao.md`.
- **Mudança:** atualizar versão instalada para `^0.4.0`, marcar A4 como resolvido (condicional a build limpa) e manter roadmap para `^0.5.x`.
- **Impacto:** elimina alucinação de estado.

### 3. Adicionar `@deprecated` em `src/lib/*.ts`
- **Arquivos:** `src/lib/erosParser.ts`, `src/lib/sexPositionsLibrary.ts`, `src/lib/relationshipSystem.ts`, `src/lib/consistencyAuditor.ts`, `src/lib/memoryService.ts`.
- **Mudança:** inserir `@deprecated` na JSDoc inicial.
- **Impacto:** fecha M9 com alteração mínima.

### 4. Validar build e persistir log
- **Comandos:** `npm run typecheck && npm run lint && npm run build && npm run test`.
- **Destino:** `docs/testing/build-log-iter3.md` ou similar.
- **Impacto:** reduz findings falsos na iter3.

## Ações para Findings Médios Pendentes

### 5. M10 — Reatividade do `AuditPanel`
- **Opção A:** incluir `auditorEnabled`/`imgAuditorEnabled` nas dependências do `useEffect` que atualiza o painel.
- **Opção B:** refazer auditoria localmente ao togglar, refletindo resultado em `issues`/`auditLog`.
- **Impacto:** fecha M10.

### 6. M12 — Validação de `initialData` no `Stage.load()`
- **Mudança:** adicionar validação mínima de `schema_version` e campos obrigatórios de `initState`/`chatState`/`messageState`.
- **Impacto:** evita propagação silenciosa de dados corrompidos.

### 7. M13 — Debounce em `NotificationToast`
- **Mudança:** manter mapa de mensagens recentes; ignorar nova mensagem idêntica dentro de 2s.
- **Impacto:** reduz poluição de UI.

### 8. M14 — Criar `docs/testing/plano-de-testes.md`
- **Conteúdo:** cobertura atual (parser, middleware, audit), casos de integração (AIConfigPanel, StageBase), critérios de aceite T04.
- **Impacto:** fecha M14.

### 9. M15 — Documentar tratamento de secrets por ambiente
- **Arquivos:** `docs/deployment/github-actions.md`, `docs/deployment/branch-strategy.md`.
- **Mudança:** explicar que `secret: true` no `chub_meta.yaml` impede exibição em UI, mas o deploy de `dev` e `main` devem usar IDs de extensão separados para isolar valores de configuração.
- **Impacto:** fecha M15.

## Melhorias Estruturais

1. **Gate de build pré-revisão:** o Orquestrador deve exigir log de build/typecheck/testes antes de acionar `equipe-revisao`.
2. **Checklist de integração cruzada:** `@arquiteto-geral` deve verificar se componentes filhos corrigidos recebem props do pai.
3. **`sync-context` obrigatório:** toda correção deve atualizar `implementacao.md`, `tarefas.md` e arquivos de débito técnico afetados.
4. **Contador de iterações visível:** manter contador em 2/3 até aprovação; na 3ª reprovação, Juiz ativa Tribunal automaticamente.
