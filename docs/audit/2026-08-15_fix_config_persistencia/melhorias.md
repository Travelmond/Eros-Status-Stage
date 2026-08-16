# 🔧 Melhorias Propostas — fix config merge/persistência

## 1. Confirmar build/testes (prioridade alta)
- Executar `npm run build` (tsc + vite) e `npm test` (vitest).
- O Juiz não tem shell nesta sessão; análise estática não encontrou erros, mas o
  selo verde depende de execução real.

## 2. Adicionar teste de regressão para o sanitizador (prioridade alta)
- Cobrir `sanitizeConfigForStorage`: garantir que `openRouterApiKey` **não** está
  no objeto retornado, mesmo quando presente na entrada.
- Cobrir o merge do `Stage.onConfigChange` (via render + callback): patches
  acumulam corretamente e não sobrescrevem campos não-patchados.
- Impacto: previne regressão exatamente do bug corrigido.

## 3. Decidir persistência de preferências não sensíveis em produção (média)
- `Stage.tsx` mantém `runtimeConfig` só em memória → toggles/model/tema não
  sobrevivem a reinstanciação do Stage. Se desejado, persistir **apenas campos
  não sensíveis** de volta a `chatState`/`initState` **após sanitizar a chave**.

## 4. Extrair sanitizador para módulo compartilhado (baixa)
- Mover `sanitizeConfigForStorage` de `App.tsx` para `services/configSanitizer.ts`
  para reuso no caminho de produção caso a melhoria #3 seja adotada.
