---
name: loop-revisao
description: "Instrui o coordenador-revisao a executar o loop de revisão até que todos os críticos (Tier 4) aprovem. Ativa críticos em paralelo, consolida e itera."
license: MIT

compatibility: opencode

---

# Skill: Loop de Revisão

## Objetivo

Garantir que o coordenador-revisao execute o loop de revisão corretamente: ativa todos os críticos em paralelo, consolida problemas, retorna para correção, e itera até aprovação total.

## Quando Usar

- Sempre que o `coordenador-revisao` é invocado
- Sempre que se está na fase de revisão
- Sempre após implementação (o Orquestrador ativa automaticamente)

## Processo do Loop

### Passo 1: Ativação Paralela

Ativar TODOS os críticos simultaneamente (não sequencial):

```
@critico → "Revise todo o código em /src"
@critico-usuario → "Teste a interface como usuário"
@testador → "Crie e execute testes (unit, integration, e2e)"
@auditor-seguranca → "Verifique vulnerabilidades"
@otimizador → "Identifique gargalos de performance"
```

### Passo 2: Consolidação

Coletar todos os relatórios:
- Agrupar problemas por área (frontend, backend, banco, segurança, performance)
- Priorizar por severidade:
  - 🔴 Crítico: Bloqueia funcionamento
  - 🟠 Alto: Impacta significativamente
  - 🟡 Médio: Deve ser corrigido
  - 🟢 Baixo: Sugestão de melhoria

### Passo 3: Atribuição de Correção

Mapear cada problema para o agente responsável:

| Tipo de Problema | Agente que Corrige |
|---|---|
| Bug de frontend | `@arquiteto-ui-ux` → `@dev-frontend` |
| Bug de backend | `@arquiteto-backend` → `@dev-backend` |
| Bug de banco | `@arquiteto-banco-de-dados` → `@dev-banco-de-dados` |
| Vulnerabilidade | `@arquiteto-backend` → `@dev-backend` |
| Performance | `@otimizador` ou `@arquiteto-*` |
| UX/usabilidade | `@arquiteto-ui-ux` → `@dev-frontend` |

### Passo 4: Loop de Correção

```
REPEAT:
  1. Enviar problemas para os agentes responsáveis
  2. Agentes corrigem
  3. Reativar críticos para revisar as correções
  4. Se ainda há problemas críticos ou altos → voltar ao passo 1
  5. Se todos aprovam → sair do loop
```

### Passo 5: Aprovação Final

Verificar que TODOS os Tier 4 aprovaram:
```
@critico: "Código aprovado" ✅
@critico-usuario: "Interface aprovada" ✅
@testador: "Todos os testes passaram" ✅
@auditor-seguranca: "Segurança aprovada" ✅
@otimizador: "Performance aceitável" ✅
```

Só então o coordenador-revisao comunica ao Orquestrador: "Fase de revisão concluída"

## Regras

- **SEMPRE ative em paralelo** — não sequencial
- **SEMPRE retorne problemas** ao Tier responsável
- **NUNCA aprove sem TODOS os Tier 4**
- **ITERE até aprovação total** — não desista no primeiro problema
- **COMUNIQUE progresso** ao Orquestrador a cada iteração

## Output Esperado

- Críticos ativados em paralelo
- Problemas consolidados por severidade
- Atribuições de correção enviadas
- Loop executado até aprovação de TODOS os Tier 4
- Confirmação final ao Orquestrador