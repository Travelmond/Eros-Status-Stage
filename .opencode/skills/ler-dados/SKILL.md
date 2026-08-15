---
name: ler-dados
description: "Lê e interpreta arquivos de dados CSV, JSON e planilhas. Extrai estrutura, valida dados e retorna informações estruturadas."
license: MIT

compatibility: opencode

---

# Skill: Ler Dados

## Objetivo

Ler e processar arquivos de dados (CSV, JSON, planilhas) para extrair informações estruturadas eutilizáveis.

## Quando Usar

- Quando o usuário fornece um arquivo de dados para análise
- Quando se precisa importar dados de um arquivo
- Quando se precisa validar a estrutura de dados

## Processo

### Para CSV
1. Receber caminho do arquivo
2. Ler arquivo
3. Identificar delimitador (vírgula, ponto e vírgula, tab)
4. Identificar cabeçalho (primeira linha)
5. Parsear dados para estrutura (array de objetos)
6. Validar tipos de dados
7. Retornar estrutura de dados + estatísticas

### Para JSON
1. Receber caminho do arquivo
2. Ler arquivo
3. Parsear JSON
4. Validar estrutura (schema)
5. Identificar tipo (objeto, array, aninhado)
6. Retornar estrutura de dados + estatísticas

### Para Planilhas (Excel)
1. Receber caminho do arquivo
2. Identificar abas
3. Para cada aba:
   - Identificar cabeçalho
   - Parsear dados
   - Validar tipos
4. Retornar estrutura de dados + estatísticas

## Validação de Dados

- Verificar campos obrigatórios
- Verificar tipos de dados (string, number, date, boolean)
- Identificar valores nulos/vazios
- Identificar duplicatas
- Calcular estatísticas básicas (count, min, max, avg)

## Output Esperado

```markdown
## Análise de Dados

### Estrutura
- **Arquivo**: `dados.csv`
- **Formato**: CSV
- **Registros**: X
- **Colunas**: [lista]

### Amostra (primeiras 5 linhas)
| Coluna 1 | Coluna 2 | Coluna 3 |
|---|---|---|
| ... | ... | ... |

### Estatísticas
- Registros totais: X
- Registros válidos: X
- Duplicatas: X
- Valores nulos: X

### Validação
- ✅ Campos obrigatórios: OK
- ⚠️ Tipos: [problemas encontrados]
```

## Regras

- **SEMPRE valide** os dados antes de retornar
- **MOSTRE amostra** — Primeiras 5 linhas para confirmação
- **IDENTIFIQUE problemas** — Nulos, duplicatas, tipos errados
- **SEJA eficiente** — Não carregue arquivos enormes na memória toda de uma vez