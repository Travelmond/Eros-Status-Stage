---
description: "Executa testes do tipo especificado. Argumentos: unit, integration, e2e, load, all."
agent: testador

subtask: true

---

O usuário passou o tipo de teste como argumento: `$ARGUMENTS`

Se nenhum argumento foi fornecido, perguntar: "Qual tipo de teste? (unit, integration, e2e, load, all)"

## Processo

### Se `$ARGUMENTS` = `unit`:
1. Identificar funções/métodos para testar
2. Criar casos de teste (normais e de borda)
3. Implementar testes unitários
4. Mockar dependências
5. Executar testes
6. Verificar cobertura
7. Gerar relatório

### Se `$ARGUMENTS` = `integration`:
1. Identificar integrações para testar
2. Configurar ambiente de teste
3. Criar casos de teste
4. Implementar testes de integração
5. Executar testes
6. Gerar relatório

### Se `$ARGUMENTS` = `e2e`:
1. Identificar fluxos para testar
2. Configurar ambiente de teste
3. Criar casos de teste
4. Implementar testes E2E (Cypress, Playwright)
5. Executar testes
6. Gerar relatório

### Se `$ARGUMENTS` = `load`:
1. Definir métricas de performance
2. Configurar ferramenta de load test
3. Criar cenários de teste
4. Executar testes
5. Analisar resultados
6. Identificar gargalos
7. Gerar relatório

### Se `$ARGUMENTS` = `all`:
Executar todos os tipos acima em sequência.

## Formato de Relatório

```markdown
## Relatório de Testes ($ARGUMENTS)

### Resumo
- Testes executados: X
- Passaram: X
- Falharam: X
- Cobertura: X%

### Falhas
[Listar testes que falharam com detalhes]
```

Salvar relatório em `/docs/testing/test-results.md