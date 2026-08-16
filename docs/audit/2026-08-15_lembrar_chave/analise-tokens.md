# 💰 Análise de Tokens — 2026-08-15 (lembrar chave / validação API key)

## Contexto
Observação estática; não houve execução de agentes nesta sessão. Estimativa por leitura de arquivos.

## Arquivos envolvidos (feature)
| Arquivo | Papel | Complexidade |
|---|---|---|
| `src/App.tsx` | Persistência via `sanitizeConfigForStorage` + `setPreference` | Baixa |
| `src/services/characterState.ts` | `setPreference`/`getPreference` (debounce 300ms) | Baixa |
| `src/services/openRouter.ts` | `callOpenRouter` (checagem de vazio) | Baixa |
| `src/components/terminal/AIProviderSection.tsx` | Input de API key (sem validação de formato) | Média |
| `src/components/terminal/AIConfigPanel.tsx` | Consumo de `config.openRouterApiKey` | Baixa |

## Gargalo / desperdício
- **Redundância funcional zero**: não há dois agentes fazendo a mesma coisa — o problema é o oposto: a feature simplesmente não foi entregue.
- **Custo de retrabalho estimado**: baixo. Adicionar opt-in + validação de formato + 2-3 testes ≈ 1 arquivo de serviço + 1 componente + 1 teste. Impacto de tokens marginal.

## Otimização
- Reaproveitar `setPreference`/`getPreference` existentes para o novo armazenamento isolado da chave (sem novo mecanismo de persistência).
