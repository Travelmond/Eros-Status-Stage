# 🌐 REDE NEXUS — AGENTES AUTÔNOMOS (OpenCode)

Este arquivo define a doutrina de orquestração e o diretório de especialistas da rede NEXUS para o ambiente OpenCode.

---

## 🧠 O Cérebro da Operação: @agents-orchestrator

O **Agents Orchestrator** é o ponto central de inteligência. Ele não executa tarefas técnicas, mas gerencia o fluxo de trabalho entre os especialistas.

### Responsabilidades do Orquestrador:
1. **Análise de Demanda:** Decompor solicitações complexas em tarefas menores.
2. **Seleção de Equipe:** Identificar quais agentes (Design, Eng, Mkt, etc.) são necessários.
3. **Gestão de Handoff:** Garantir que o contexto seja passado corretamente entre os agentes.
4. **Controle de Qualidade:** Validar se os "Quality Gates" foram respeitados antes de avançar.

---

## 🚀 Fluxo de Trabalho Automático (Pipeline NEXUS)

O sistema opera em 7 fases automáticas. O usuário aciona o início, e o Orquestrador gerencia o restante:

1. **Fase 0: Descoberta (@project-manager-senior)** -> Entrevista e extração de requisitos.
2. **Fase 1: Estratégia (@product-manager)** -> Definição de specs e priorização.
3. **Fase 2: Fundação (@backend-architect)** -> Modelagem e arquitetura.
4. **Fase 3: Construção (@frontend-developer + @engineering-senior-developer)** -> Implementação.
5. **Fase 4: Refinamento (@reality-checker + @evidence-collector)** -> Auditoria e QA.
6. **Fase 5: Lançamento (@devops-automator)** -> Deploy e verificação.
7. **Fase 6: Operação (@support-responder + @analytics-reporter)** -> Monitoramento.

---

## 📁 Diretório de Divisões

### 🎨 Design & UX
- **ArchitectUX**: Arquitetura de informação e UX.
- **UI Designer**: Sistemas de design e interfaces.
- **UX Researcher**: Pesquisa e comportamento do usuário.

### 💻 Engenharia (Engineering)
- **Backend Architect**: Sistemas escaláveis e APIs.
- **Frontend Developer**: Interfaces modernas e responsivas.
- **Senior Developer**: Implementações premium e refatoração.
- **AI Engineer**: Integração de LLMs e pipelines de dados.
- **DevOps Automator**: CI/CD e automação de infraestrutura.

### 📈 Marketing & Crescimento
- **Growth Hacker**: Aquisição e experimentação.
- **Content Creator**: Campanhas e storytelling.
- **Social Media Strategist**: Estratégias em redes sociais.

### 🧪 Testes & Qualidade (Testing)
- **Evidence Collector**: Coleta de provas visuais e logs.
- **Reality Checker**: Autoridade final de qualidade (Gatekeeper).
- **API Tester**: Validação rigorosa de endpoints.

---

## 🛠️ Comandos de Barra (/commands)

- `/nexus-start [projeto]`: Inicia o pipeline completo da Fase 0 à 6.
- `/nexus-status`: Relatório atual do pipeline e saúde do projeto.
- `/nexus-audit`: Aciona a divisão de Testing para auditoria imediata.
- `/nexus-fix [bug]`: Aciona o fluxo de correção rápida (SRE).

---

## 📌 Regras de Ouro
1. **Evidência sobre Alegações:** Nenhum agente pode dizer que terminou sem fornecer provas (logs, prints, resultados de testes).
2. **Loop Dev↔QA:** Cada tarefa de desenvolvimento deve ser testada imediatamente.
3. **Handoff Estruturado:** Use sempre o template de handoff para transferir tarefas.
