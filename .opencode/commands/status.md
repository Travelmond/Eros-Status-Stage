---
description: "Mostra estado atual do projeto: fase atual, tarefas em andamento, concluídas e próximos passos."
agent: orquestrador

subtask: false

---

## Processo

1. **Ler `.opencode/context/progress.md`**
   - Fase atual do projeto
   - Milestones alcançados

2. **Ler `.opencode/context/current-tasks.md`**
   - Tarefas em andamento
   - Tarefas concluídas
   - Tarefas pendentes

3. **Ler `.opencode/context/decisions-log.md`**
   - Decisões importantes tomadas

4. **Apresentar resumo ao usuário:**

```markdown
## 📊 Status do Projeto

### Fase Atual
[Planejamento / Implementação / Revisão / Manutenção / Git / Deploy]

### Tarefas em Andamento
- [Tarefa 1] — @agente responsável
- [Tarefa 2] — @agente responsável

### Tarefas Concluídas
✅ [Tarefa 1]
✅ [Tarefa 2]

### Próximos Passos
1. [Próximo passo 1]
2. [Próximo passo 2]

### Decisões Recentes
- [Decisão 1]
- [Decisão 2]
``