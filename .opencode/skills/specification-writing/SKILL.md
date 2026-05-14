---
name: escrita-especificacoes
description: Diretrizes for atuar como PM na criação of especificações técnicas completas a partir of ideias brutas. Inclui leitura of contexto, interview of requisitos, verificação of conflitos e generation/aprovação of the spec.
metadata:
  agent: "@product-manager"
  triggered_by: "/nova-feature <descricao>"
---

## Objetivo
Transformar a ideia bruta in a especificação técnica completa e approved by usuário, antes que qualquer Code seja escrito.

## Processo mandatory

### Passo 1 — Leitura of Contexto
Antes of qualquer coisa, Read:
- `docs/OPENCODE.md` (arquitetura atual)
- `docs/AAAA-MM-DD/` (specs anteriores for consistência)

### Passo 2 — interview of Requisitos
Faça as seguintes perguntas ao usuário (a of cada vez, aguardando resposta):
1. "Qual é o problema que esta feature resolve for o usuário final?"
2. "Quem vai usar isso — a dev via API, ou a usuário no dashboard visual?"
3. "O que acontece se isso falhar? Qual é o comportamento esperado?"
4. "Tem alguma restrição of prazo ou of plano (Free/Paid) a considerar?"

### Passo 3 — Verificação of Conflito
Verifique se a feature pedida:
- Já existe na spec (se sim, informe)
- Conflita with alguma regra of negócio existente (se sim, alerte)
- Requer mudanças in tabelas existentes (se sim, sinalize @engineering-backend-architect)

### Passo 4 — generation of the Spec
Gere o arquivo `docs/AAAA-MM-DD/[nome-of the-feature]-spec.md` with:

```markdown
# Spec: [Nome of the Feature]
**status:** 🔴 Aguardando Aprovação
**Data:** [data]
**Solicitado por:** usuário
**agent PM:** @product-manager

## Briefing
[O que realmente foi pedido, in linguagem técnica clara]

## Escopo
### ✅ Entra
- item 1
### ❌ Não Entra
- item 1

## Critérios of Aceitação
- [ ] AC-01: [critério verificável]
- [ ] AC-02: [critério verificável]

## Impacto Técnico
- Rotas afetadas: [list]
- Tabelas afetadas: [list]
- files frontend: [list]

## Riscos Identificados
- Risco 1: [descrição + mitigação]
```

### Passo 5 — Aprovação
Apresente a spec ao usuário e Wait:
- ✅ "Approved" → delegar for @engineering-backend-architect ou devs ou outro agent, for o trabalho respectivo a sua função
- 📝 "Alterar [X]" → revisar e reapresentar
- ❌ "Cancelar" → arquivar spec with status CANCELADO

## Loop of Retrabalho
Se o usuário pedir revisão na spec:
1. Read os comentários inline no arquivo spec
2. Ajuste APENAS os pontos comentados
3. Atualize o status for "🟡 Revisado — Aguardando Reaprovação"
4. Reapresente for aprovação