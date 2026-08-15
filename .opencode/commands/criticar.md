---
description: "Ativa crítico específico para revisão focada. Argumentos: code, user, security, performance, all."
agent: coordenador-revisao

subtask: true

---

O usuário passou o tipo de crítico como argumento: `$ARGUMENTS`

Se nenhum argumento foi fornecido, perguntar: "Qual tipo de crítico? (code, user, security, performance, all)"

## Processo

### Se `$ARGUMENTS` = `code`:
- Ativar `@critico`
- Instrução: "Revise todo o código em /src — bugs, lógica, padrões, performance"

### Se `$ARGUMENTS` = `user`:
- Ativar `@critico-usuario`
- Instrução: "Teste a interface como usuário comum — usabilidade, fluxos, alucinações de IA"

### Se `$ARGUMENTS` = `security`:
- Ativar `@auditor-seguranca`
- Instrução: "Verifique vulnerabilidades — SQL injection, XSS, CSRF, autenticação, autorização"

### Se `$ARGUMENTS` = `performance`:
- Ativar `@otimizador`
- Instrução: "Identifique gargalos de performance — queries, bundle, renderização, cache"

### Se `$ARGUMENTS` = `all`:
- Ativar TODOS em paralelo:
  - `@critico` → código
  - `@critico-usuario` → interface
  - `@testador` → testes
  - `@auditor-seguranca` → segurança
  - `@otimizador` → performance

## Após revisão

1. Consolidar relatório do(s) crítico(s) ativado(s)
2. Se houver problemas críticos ou altos:
   - Atribuir correção ao agente responsável
   - Reativar crítico após correção
   - Loop até aprovação
3. Comunicar resultado ao Orquestrador