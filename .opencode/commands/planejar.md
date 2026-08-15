---
description: "Inicia fase de planejamento com perguntas categorizadas em 5 áreas (Escopo, Stack, Usuários, Dados, Infra)."
agent: planejador-primario

subtask: false

---

Ative a skill `categorizar-perguntas` e inicie o processo de planejamento.

## Processo

1. **Receber requisito do usuário**
   - Se foi passado como argumento, usar como requisito inicial
   - Se não, perguntar o que o usuário quer fazer

2. **Ativar skill `categorizar-perguntas`**

3. **Fazer perguntas por categoria (uma por vez):**
   - Categoria 1: Escopo e Objetivo
   - Categoria 2: Stack e Tecnologia
   - Categoria 3: Usuários e Permissões
   - Categoria 4: Dados e Persistência (pular se tarefa simples)
   - Categoria 5: Infraestrutura e Deploy (pular se tarefa simples)

4. **Criar plano de ação**
   - Decompor em tarefas
   - Definir ordem de execução
   - Identificar paralelismos
   - Estimar complexidade

5. **Validar com `@arquiteto-geral`**
   - Solicitar validação de arquitetura
   - Incorporar feedback

6. **Solicitar `@documentacao` para gerar:**
   - `/docs/requirements/DER.md`
   - `/docs/architecture/software-architecture.md`

7. **Apresentar plano ao usuário para aprovação**