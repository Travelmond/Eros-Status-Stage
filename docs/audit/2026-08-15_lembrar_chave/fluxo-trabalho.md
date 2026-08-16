# 🔄 Fluxo de Trabalho — 2026-08-15 (lembrar chave / validação API key)

## Fluxo atual (o que existe)
```
AIProviderSection (input API key)
  └─ handleApiKeyInputChange → onConfigChange({ openRouterApiKey })
        └─ App.handleConfigChange → setConfig (merge)
              └─ setPreference('ui_config', sanitizeConfigForStorage(next))
                    └─ sanitize remove openRouterApiKey  ← chave NUNCA gravada
```

## Fluxo esperado (o que foi pedido, ausente)
```
[ ] checkbox "lembrar chave" (opt-in) no AIProviderSection
[ ] se opt-in: persistir chave isolada (fora de ui_config)
[ ] validação de formato sk-or-v1-… no input e em callOpenRouter
```

## Gargalos
- **Gap de escopo**: o requisito não foi mapeado para contrato Tier 3; não há contrato `lembrar-chave` nem `validar-formato` em `docs/management/contratos/`.
- **Sem `equipe-revisao`**: não há evidência de revisão que detectasse a omissão da feature.

## Recomendação
- Reabrir o fluxo: @agente-de-intencao (atualizar manifesto) → @planejador-primario → `tradutor-tiers` → @dev-frontend → `equipe-revisao`.
