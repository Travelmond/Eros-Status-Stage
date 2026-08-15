---
name: sync-context
description: "Sincroniza o contexto do projeto atualizando implementacao.md (plano) e tarefas.md (checklist) na pasta /docs/management/. Todo agente executa ao concluir uma tarefa."
license: MIT

compatibility: opencode

---

# Skill: Sincronizar Contexto

## Objetivo

Manter o estado do projeto persistente e independente da memória do modelo, atualizando dois arquivos centrais que todos os agentes podem ler:
- `implementacao.md` — Plano do que deve ser feito
- `tarefas.md` — Checklist do que já foi feito e o que falta

## Quando Usar

- **Todo agente deve executar esta skill ao concluir uma tarefa**
- Antes de passar o controle para outro agente
- Ao final de cada fase (planejamento, implementação, revisão)
- Quando o Orquestrador detecta mudança de estado

## Por Que Esta Skill Existe

O OpenCode perde contexto ao ser reiniciado. Sem estes arquivos, os agentes precisam reler conversas inteiras para saber onde estão. Com eles, basta ler 2 arquivos curtos para recuperar o estado completo — economizando tokens drasticamente.

## Arquivos de Estado

### `/docs/management/implementacao.md`

O **plano vivo** do projeto. Contém:

```markdown
# 📋 Plano de Implementação

## Objetivo
[Objetivo atual do projeto]

## Fase Atual
[Planejamento | Implementação | Revisão | Git | Deploy | Concluído]

## Arquitetura Decidida
- Frontend: [stack]
- Backend: [stack]
- Banco: [stack]

## Decisões Importantes
- [Decisão 1] — [data]
- [Decisão 2] — [data]

## Próximos Passos
1. [Próximo passo 1]
2. [Próximo passo 2]
```

### `/docs/management/tarefas.md`

O **checklist vivo** do projeto. Contém:

```markdown
# ✅ Checklist de Tarefas

## Tarefas Concluídas
- [x] [Tarefa 1] — @agente — [data]
- [x] [Tarefa 2] — @agente — [data]

## Tarefas em Andamento
- [ ] [Tarefa 3] — @agente — [status]

## Tarefas Pendentes
- [ ] [Tarefa 4] — @agente responsável
- [ ] [Tarefa 5] — @agente responsável

## Bloqueios
- ⛔ [Bloqueio 1] — [motivo]
```

## Processo

### Ao concluir uma tarefa:

1. **Ler arquivos atuais**
   - Ler `/docs/management/implementacao.md`
   - Ler `/docs/management/tarefas.md`

2. **Atualizar tarefas.md**
   - Mover tarefa de "Em Andamento" para "Concluídas"
   - Adicionar próxima tarefa a "Em Andamento" (se houver)
   - Remover bloqueios resolvidos

3. **Atualizar implementacao.md**
   - Atualizar "Fase Atual" se mudou
   - Adicionar nova decisão importante (se houve)
   - Atualizar "Próximos Passos"

4. **Salvar arquivos**
   - Garantir que estão em `/docs/management/`
   - Criar pasta se não existir

5. **Comunicar ao próximo agente**
   - "Contexto sincronizado. Próximo agente pode ler /docs/management/"

## Regras

- **SEMPRE execute esta skill ao terminar uma tarefa**
- **MANTENHA os arquivos curtos** — Resumos, não transcrições
- **SEJA específico** — Status claro, não vago
- **NUNCA apague histórico** de tarefas concluídas
- **CRIE a pasta** `/docs/management/` se não existir

## Economia de Tokens

Sem esta skill: agentes relêem conversas inteiras (milhares de tokens)
Com esta skill: agentes leem 2 arquivos curtos (centenas de tokens)
**Economia estimada: 70-90% de tokens de contexto por rodada.**