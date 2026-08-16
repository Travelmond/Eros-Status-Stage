# 🧠 Alucinações e Desvios — 2026-08-15 (lembrar chave / validação API key)

## Alucinações de código
Nenhuma detectada (código presente é coerente e compilável em análise estática).

## Desvio de interpretação (gap de entrega)
| Pedido | Entregue | Gravidade |
|---|---|---|
| "Lembrar chave" — persistir chave **com opt-in** | Nenhuma persistência; nenhum opt-in | 🔴 Crítico |
| Validação de **formato** da API key | Apenas checagem de vazio (`if (!apiKey)`) | 🔴 Crítico |

## Hipótese de causa
O agente @dev-frontend provavelmente interpretou as hard rules de segurança ("API key nunca persistida") como satisfação do requisito, sem implementar o mecanismo de opt-in solicitado. As auditorias anteriores (`2026-08-15_fix_config_persistencia`) reforçaram "não persistir", o que pode ter induzido a omissão do opt-in.

## Risco futuro
- Usuário que deseja conveniência ("lembrar chave") não tem opção; chave some a cada reload — a regressão de UX não foi coberta por teste.
- Chave em formato inválido só falha no 401 da API, sem feedback antecipado.
