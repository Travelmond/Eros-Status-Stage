# 💰 Análise de Tokens — fix config merge/persistência

> Estimativas (sem métricas de runtime disponíveis para o Juiz nesta sessão).

## Escopo do fix
- Arquivos relevantes: `Stage.tsx`, `App.tsx`, `AIProviderSection.tsx`,
  `AIConfigPanel.tsx`, `services/openRouter.ts`, `services/characterState.ts`.
- Mudança cirúrgica: 2 pontos de merge + 1 sanitizador + comentários de segurança.

## Avaliação
- **Redundância**: nenhuma — um único ponto de merge por caminho (Stage e App),
  sem duplicação de lógica.
- **Contexto**: o fix manteve o padrão de "fonte de verdade única" (`config`
  derivado, sem estado local duplicado) documentado em `AIProviderSection.tsx:64-65`
  e `AIConfigPanel.tsx:32`. Economiza re-renders e tokens de manutenção.
- **Desperdício estimado**: ~0%. Não há chamadas duplicadas nem refetch de modelos
  por mudança de config (cache em módulo em `openRouter.ts:48`).

## Otimizações possíveis
1. Extrair o sanitizador `sanitizeConfigForStorage` para um módulo compartilhado
   (`services/configSanitizer.ts`) caso o Stage venha a persistir config — hoje ele
   está embutido em `App.tsx` e não é reutilizável.
2. Centralizar o merge de config num helper único (`mergeConfig`) para eliminar a
   duplicação conceitual entre `Stage.tsx:236` e `App.tsx:181` (baixa prioridade;
   os dois são triviais e legíveis).
