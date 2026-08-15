# 🔧 Soluções e Recomendações — Correções Pós-Tribunal

**Data:** 2026-08-15

---

## Soluções Imediatas

### 1. Completar M9 — `@deprecated` em todos os re-exports

**Responsável:** @dev-backend  
**Esforço:** baixo  
**Ação:** adicionar anotação `@deprecated` no topo de cada arquivo `src/lib/*.ts`.

Exemplo para os 4 arquivos pendentes:

```ts
/**
 * @deprecated Use `@/systems/sexPositions` instead. This compatibility re-export will be removed in a future release.
 */
```

**Arquivos afetados:**
- `src/lib/sexPositionsLibrary.ts`
- `src/lib/consistencyAuditor.ts`
- `src/lib/relationshipSystem.ts`
- `src/lib/memoryService.ts`

**Impacto:** fecha M9 integralmente.

---

### 2. Resolver M12 — validação de schema em `Stage.load()`

**Responsável:** @dev-backend  
**Esforço:** médio  
**Opções:**

#### Opção A — Validação defensiva (recomendada)
Adicionar em `Stage.load()`:

```ts
async load(): Promise<Partial<LoadResponse<...>>> {
  const validatedInitState = validateInitState(this.initState);
  const validatedChatState = validateChatState(this.chatState);
  const validatedMessageState = validateMessageState(this.messageState);

  return {
    success: true,
    initState: validatedInitState,
    chatState: validatedChatState,
    messageState: validatedMessageState,
  };
}
```

Implementar validadores mínimos em `src/core/state.ts` ou `src/core/validation.ts`.

#### Opção B — Documentar risco aceito
Criar `/docs/architecture/risco-schema-stage.md` explicando que:
- `StageBase` é a fonte única de verdade para estados iniciais.
- O stage confia nos estados recebidos.
- A validação adicional é considerada débito técnico consciente.

**Impacto:** fecha M12 conforme alternativa permitida pelo Tribunal.

---

### 3. Criar M14 — `docs/testing/plano-de-testes.md`

**Responsável:** @documentacao  
**Esforço:** médio  
**Estrutura mínima sugerida:**

```markdown
# Plano de Testes — Eros Stage Terminal v3.0

## Escopo
- Unitários: parser, middleware, memory, gates
- Integração: Stage + ErosTerminal
- Regressão: findings do Tribunal

## Suite Atual
- Vitest
- 34 testes passando
- Arquivos: `src/core/middleware.test.ts`, `src/services/openRouter.test.ts`, etc.

## Casos de Teste
1. Gating de Sex/Reaction
2. Persistência de audit ids (correctedIds/ignoredIds)
3. Timeout e retry do OpenRouter
4. Validação de schema (quando M12 for implementado)

## Próximos Cenários
- Testes E2E do ciclo beforePrompt/afterResponse
- Testes de renderização de ErosTerminal
```

**Impacto:** fecha M14.

---

## Recomendações Estruturais

1. **Pré-validação obrigatória do Juiz antes de `equipe-revisao`** — reduz ciclos de revisão prematura.
2. **Checklist de fechamento pós-Tribunal** em `tarefas.md` — evita esquecimento de findings obrigatórios.
3. **Auto-teste de M9 via grep** — adicionar em scripts de CI/CD: `grep -L "@deprecated" src/lib/*.ts` deve retornar vazio.
4. **Não permitir bypass do M12 com apenas documentação sem aprovação explícita** — se Opção B for escolhida, o Juiz deve registrar aceitação do risco.

---

## Ordem de Execução Recomendada

1. M9 (mais rápido, maior impacto visual)
2. M14 (documentação, independente de código)
3. M12 (requer análise técnica)
4. Pré-validação do Juiz
5. `skill equipe-revisao` (revisão pós-Tribunal)
