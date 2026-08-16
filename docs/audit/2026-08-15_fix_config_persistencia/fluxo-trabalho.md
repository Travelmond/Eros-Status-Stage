# 🔄 Fluxo de Trabalho — fix config merge/persistência

## Fluxo observado (config)

```
AIProviderSection (input API key / model)
  └─ onConfigChange({ openRouterApiKey | openRouterModel })
       ├─ [dev]  App.handleConfigChange → setConfig + sanitize + setPreference
       └─ [prod] Stage.onConfigChange → runtimeConfig (memória apenas)
```

## Avaliação

- **Sequência lógica**: correta. A UI propaga patch para o dono do estado; não há
  mutação direta de props.
- **Hierarquia**: respeitada. Componente → orquestrador (Stage/App) → estado.
  Sem pulo de tiers.
- **Gargalos**: nenhum. `setPreference` usa debounce (300ms) para gravação local.
- **Loop de revisão**: não se aplica (fix pequeno; sem indícios de re-trabalho).

## Observação
- O `onConfigChange` do Stage **não persiste** nada em produção. Para a API key
  isso é o comportamento desejado (segurança). Para campos de preferência, é uma
  decisão de produto pendente (ver `melhorias.md`).
