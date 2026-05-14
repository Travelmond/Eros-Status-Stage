---
name: nexus-orchestration
description: Protocolo de orquestração automática da rede NEXUS para o OpenCode. Gerencia o fluxo entre 9 divisões e 7 fases.
metadata:
  agente: "@agents-orchestrator"
  participantes: "@project-manager-senior, @backend-architect, @testing-reality-checker"
  acionado_por: "comando /nexus-start ou solicitação de pipeline completo"
---

## 🧠 Protocolo de Orquestração (NEXUS)

### 1. Análise e Decomposição
- **Entrada:** Solicitação bruta do usuário.
- **Ação:** O @agents-orchestrator lê o `AGENTS.md` e o `nexus-strategy.md` para identificar a fase atual e os agentes necessários.
- **Saída:** Plano de execução detalhado com IDs de tarefas.

### 2. Delegação Automática
- **Handoff:** O Orquestrador chama o próximo agente usando o template:
  ```markdown
  📦 HANDOFF: [Agente Origem] → [Agente Destino]
  Tarefa: [ID] - [Descrição]
  Contexto: [Link para docs/specs]
  Critérios de Aceitação: [Lista]
  Evidência Requerida: [Tipo de prova]
  ```

### 3. Loop de Qualidade (Dev↔QA)
- **Regra:** Nenhuma tarefa de desenvolvimento é considerada "Done" sem o selo de aprovação do @testing-reality-checker.
- **Fluxo:** Dev entrega código → QA testa → QA aprova (PASS) ou QA reprova (FAIL).
- **Retry:** Máximo de 3 tentativas antes de escalação para o Orquestrador.

---

## ✅ Checklist do Orquestrador

- [ ] A fase anterior foi 100% concluída e aprovada?
- [ ] O próximo agente tem todo o contexto necessário (docs/specs)?
- [ ] Os critérios de aceitação estão claros e verificáveis?
- [ ] O pipeline está dentro do cronograma estimado?
- [ ] Existem riscos bloqueantes identificados?

---

## 🛠️ Comandos de Automação

- **`/nexus-next`**: Avança automaticamente para a próxima tarefa ou fase se os critérios forem atendidos.
- **`/nexus-report`**: Gera o relatório de status do pipeline (Appendix B do nexus-strategy.md).
- **`/nexus-escalate`**: Aciona intervenção humana ou do Orquestrador em caso de bloqueio persistente.
