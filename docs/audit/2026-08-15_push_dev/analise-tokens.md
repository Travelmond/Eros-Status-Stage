# Análise de Tokens — Push para `dev`

## Estimativa de Consumo

| Atividade | Tokens (est.) | % do total |
|---|---|---|
| Leitura de `.git/config`, `.git/HEAD`, refs e logs | ~800 | 25% |
| Leitura dos workflows `.github/workflows/deploy-dev.yml` e `deploy.yml` | ~1.200 | 38% |
| Leitura de `docs/deployment/branch-strategy.md` e `github-actions.md` | ~600 | 19% |
| Leitura de `.gitignore` e verificação de credenciais | ~200 | 6% |
| Geração dos relatórios de auditoria | ~400 | 12% |
| **Total** | **~3.200** | **100%** |

## Análise de Eficiência

### ✅ Uso Eficiente
- A inspeção direta de `.git/` evitou a necessidade de executar comandos git e consumir tokens com saídas longas.
- Os workflows são concisos (76 e 71 linhas), permitindo leitura completa sem truncamento.
- A documentação de deployment está centralizada em `docs/deployment/`, reduzindo o número de arquivos a verificar.

### ⚠️ Desperdício Potencial
- **Leitura de relatórios anteriores:** ~500 tokens foram usados para reconciliar o estado atual com o relatório `2026-08-15_T04_devops`, que estava desatualizado. Isso foi necessário para contextualizar a evolução, mas poderia ser evitado se `sync-context` tivesse sido executado corretamente após a criação dos workflows.
- **Falha do glob em diretórios ocultos:** a ferramenta `glob` não retornou `.git/` nem `.github/` inicialmente, exigindo leituras diretas e aumentando o número de chamadas.

## Recomendações para Economia
1. **Sempre executar `sync-context` após mudanças de DevOps** — mantém `implementacao.md` e `tarefas.md` alinhados ao filesystem, evitando reconciliação custosa em auditorias futuras.
2. **Preferir leitura direta de arquivos-chave** — quando `glob` falha em diretórios ocultos, ler os arquivos conhecidos diretamente é mais eficiente do que múltiplas tentativas de busca.
3. **Manter workflows enxutos** — os workflows atuais já são relativamente curtos; evitar adicionar steps desnecessários.
