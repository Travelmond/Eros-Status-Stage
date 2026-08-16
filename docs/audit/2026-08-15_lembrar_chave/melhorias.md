# 🔧 Melhorias Propostas — 2026-08-15 (lembrar chave / validação API key)

## 1. Opt-in real de "lembrar chave" (prioridade ALTA)
- Adicionar `rememberApiKey?: boolean` em `ConfigType` (`src/types/config.ts`).
- Checkbox no `AIProviderSection` ("Remember API key (local only)").
- Quando ativo, persistir em chave isolada `eros_pref_v3_openrouter_key` (via `setPreference`), **nunca** dentro de `ui_config`, **nunca** em `messageState`/`chatState`.
- Quando desativo, remover a chave salva imediatamente.
- **Impacto**: atende o requisito sem expor a chave no blob compartilhado.

## 2. Validação de formato (prioridade ALTA)
- Novo helper `isValidOpenRouterKey(key)` em `src/services/openRouter.ts`:
  `^sk-or-v[0-9a-z]+-[A-Za-z0-9-]{20,}$`
- Aplicar em `callOpenRouter` (substituir/anteceder o `if (!apiKey)`) e no `handleApiKeyInputChange` (feedback visual).
- **Impacto**: evita chamadas fadadas a 401; melhora UX.

## 3. Cobertura de testes (prioridade MÉDIA)
- `sanitizeConfigForStorage` não grava `openRouterApiKey`.
- `isValidOpenRouterKey` (válido/inválido/vazio).
- Fluxo de opt-in: ativar → grava chave isolada; desativar → remove.

## 4. Estrutural (prioridade BAIXA)
- Mover `sanitizeConfigForStorage` para `src/services/configSanitizer.ts` (compartilhável/testável).
- Executar `npm run typecheck && npm run build && npm test` para fechar a verificação pendente de build/testes.
