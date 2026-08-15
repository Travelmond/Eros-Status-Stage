# Análise de Tokens — 2026-08-15_iniciar

## Estimativa por Atividade
| Atividade | Tokens (est.) | % do total |
|---|---|---|
| Carregamento skill `avaliar-sistema` | 1.200 | 27% |
| Carregamento skill `ler-contexto-projeto` | 800 | 18% |
| Leitura `AGENTS.md` (316 linhas) | 1.200 | 27% |
| Listagem de diretórios (`/`, `.opencode/context`, `/docs`) | 400 | 9% |
| Leitura parcial de docs e análise | 900 | 19% |
| **Total** | **~4.500** | **100%** |

## Desperdício Identificado
- **Releitura de `AGENTS.md`**: já disponível nas instruções do sistema → ~900 tokens evitáveis.
- **Diretório `.opencode/context/` vazio**: leitura sem retorno → ~200 tokens.
- **Ausência de `/docs/management/`**: forçará releitura completa de `/docs` (13 arquivos) em novas rodadas → potencial desperdício futuro de ~5.000 tokens.

## Projeção de Economia
- Com contexto vivo (`implementacao.md`, `tarefas.md`, `project-summary.md`): economia de **60-80%** por rodada.
- Com estrutura `/docs` padronizada: economia adicional de **15-20%** em skills de documentação.
