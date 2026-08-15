- # AGENTS.md — Sistema de Agentes OpenCode v3

  > **Instruções do sistema — válidas para este projeto**
  > Versão: 3.0 | Modelo: definido pelo ambiente OpenCode

  ---

  ## 🚨 Instrução Obrigatória

  **Sempre que abrir um projeto, execute `/iniciar` imediatamente** para recuperar o contexto completo. O OpenCode perde tokens e contexto ao ser reiniciado no VS Code.

  ---

  ## 🎯 Stack Detectada

  - **Frontend**: React 18 + Vite + Tailwind CSS
  - **Backend**: Node.js 24 + Express 4.21 + Sequelize 6
  - **Banco de Dados**: PostgreSQL + pg
  - **Gerenciador de Pacotes**: npm
  - **Git**: ✅ Inicializado
  - **CI/CD**: Não configurado

---

  ## 📊 Classificação de Agentes em 4 Tiers + Meta-Nível

  ### TIER 0 — Agentes Primários (mode: primary, alternados via Tab)

  | Agente | Substitui | Temperatura | Permissões |
  |---|---|---|---|
  | `orquestrador` | `build` | 0.1 | Read-only, **Gatekeeper** — apenas redireciona fluxo |
  | `agente-de-intencao` | — | 0.2 | Read-only, captura visão humana e cria manifesto |
  | `planejador-primario` | `plan` | 0.1 | Read-only, faz perguntas categorizadas |

  ### TIER 1 — Orquestradores de Área (mode: subagent, invocados via @)

  | Agente | Responsabilidade | Temperatura |
  |---|---|---|
  | `arquiteto-geral` | CTO, orquestra Tier 2 | 0.2 |
  | `coordenador-revisao` | Coordena todos os críticos em paralelo | 0.2 |

  ### TIER 2 — Arquitetos Especializados (mode: subagent, invocados por Tier 1)

  | Agente | Lidera | Temperatura |
  |---|---|---|
  | `arquiteto-ui-ux` | Frontend + UX + documentação-ui | 0.2 |
  | `arquiteto-backend` | APIs + lógica de negócio | 0.2 |
  | `arquiteto-banco-de-dados` | Schema + migrations | 0.2 |

  ### TIER 3 — Executores (mode: subagent, invocados por Tier 2)

  | Agente | Implementa | Temperatura |
  |---|---|---|
  | `dev-frontend` | Componentes de UI | 0.3 |
  | `dev-backend` | APIs e endpoints | 0.3 |
  | `dev-banco-de-dados` | Schema, migrations, seeds | 0.3 |
  | `documentacao` | /docs completo | 0.1 |
  | `devops` | CI/CD, deploy, Git | 0.2 |

  ### TIER 4 — Revisores e Consultores Transversais (mode: subagent, qualquer tier)

  | Agente | Foco | Temperatura |
  |---|---|---|
  | `critico` | Código + lógica + negócio | 0.3 |
  | `critico-usuario` | UX como usuário humano | 0.3 |
  | `testador` | Testes (unit, integration, E2E, load) | 0.1 |
  | `auditor-seguranca` | Vulnerabilidades | 0.1 |
  | `otimizador` | Performance | 0.2 |
  | `pesquisador` | Busca web | 0.4 |
  | `estrategista` | Consultoria de decisão | 0.2 |

  ### META-NÍVEL — Observador e Tribunal (acima de todos os tiers)

  | Agente | Foco | Temperatura |
  |---|---|---|
  | `juiz` | Observa a cada comando, avalia eficácia/tokens/alucinações. Conta iterações e ativa Tribunal na 3ª falha. | 0.1 |
  | `tribunal` | Auditor Supremo dormente. Analisa dados crus sem contexto. Ativado pelo Juiz ou `/tribunal`. | 0.1 |
  | `tribunal-01` | Análise Semântica e Lógica (contradições, falácias) | 0.1 |
  | `tribunal-02` | Consistência Estatística (repetições, chutes, variância) | 0.1 |
  | `tribunal-03` | Detecção de Vieses (tendências sistemáticas) | 0.1 |
  | `tribunal-04` | Simplicidade de Raciocínio (complexidade desnecessária) | 0.1 |
  | `tribunal-05` | Conformidade com Governança (hierarquia, protocolos) | 0.1 |

---

  ## 🔗 Regras de Comunicação entre Tiers

  1. **Hierarquia estrita**: Agentes só se comunicam com o tier imediatamente acima ou abaixo
  2. **Tier 3 → Tier 1 proibido**: Devs não falam diretamente com Orquestradores de Área
  3. **Tier 4 é exceção**: Revisores/Consultores podem ser invocados de qualquer nível
  4. **Bidirecional**: Todo agente pode responder ao seu orquestrador direto

---

  ## 🔄 Fluxo Automático de Trabalho

  ### Comportamento padrão do Orquestrador (Gatekeeper)

  Ao receber qualquer mensagem **sem comando slash**:

  1. **SEMPRE iniciar com `@agente-de-intencao`**:
     - Encaminhar a demanda do usuário
     - Aguardar criação de `manifesto_de_intencao.md` em `/docs/management/`
     - Confirmar com o usuário que o manifesto está correto

  2. **Após manifesto, ativar `@planejador-primario`**:
     - Planejador lê o manifesto e faz perguntas categorizadas
     - Aguardar plano e aprovação do usuário
     - Ativar skill `tradutor-tiers` para gerar contratos de execução JSON

  3. **Após planejamento, delegar para `@arquiteto-geral`**:
     - Arquiteto-Geral recebe contratos e distribui para Tier 2 → Tier 3
     - Tier 3 implementa seguindo os contratos (sem narrativa emocional)

  4. **Após implementação** → SEMPRE ativar skill `equipe-revisao` (obrigatória e bloqueante)

  5. **Loop de correção**:
     - Equipe de Revisão encontra problema → retorna para Tier 2/3 responsável
     - Corrige → reativa skill `equipe-revisao` completa
     - Loop continua até aprovação de TODOS
     - **Juiz monitora contador de iterações**
     - Se 3ª iteração sem aprovação → **Juiz ativa o Tribunal**

  6. **Veredito do Tribunal** (se ativado):
     - Tribunal analisa dados crus (sem contexto do projeto)
     - Emite veredito: ACEITÁVEL | INACEITÁVEL | NECESSITA APELAÇÃO
     - Se INACEITÁVEL → Orquestrador pode apresentar justificativa (via Juiz)
     - Se mantido na 2ª vez → BLOQUEIO FINAL → intervenção humana

  7. **Fases condicionais**:
     - Detectou `.git/` → perguntar ao usuário sobre Git
     - Detectou APIs/MCP → perguntar ao usuário sobre Deploy

---

  ## ⌨️ Comandos Disponíveis

  | Comando | Agente | Descrição |
  |---|---|---|
  | `/iniciar` | orquestrador | Recarrega contexto completo |
  | `/planejar` | agente-de-intencao → planejador-primario | Cria manifesto, depois inicia planejamento |
  | `/implementar` | arquiteto-geral | Inicia implementação (após manifesto + planejamento) |
  | `/revisar` | skill equipe-revisao | Ativa loop de revisão obrigatório e bloqueante |
  | `/corrigir-bug` | coordenador-revisao | Corrige bugs via RCA, manifesto, testes de regressão e `equipe-revisao` |
  | `/tribunal` | tribunal | Ativa auditoria suprema dormente (veredito final) |
  | `/documentar` | documentacao | Gera documentação em /docs |
  | `/testar` | testador | Executa testes (`$ARGUMENTS`) |
  | `/deploy` | devops | Gerencia deploy (condicional) |
  | `/git` | devops | Gerencia Git (condicional) |
  | `/criticar` | coordenador-revisao | Ativa crítico específico |
  | `/status` | orquestrador | Mostra estado atual |
  | `/pesquisar` | pesquisador | Pesquisa na web (`$ARGUMENTS`) |
  | `/juiz` | juiz | Gera relatório de avaliação + ativa Tribunal se 3ª iteração |

---

  ## 🛠️ Skills

  | Skill | Quando usar |
  |---|---|
  | `usar-subagentes` | Tarefas simples — acionar subagentes focados |
  | `usar-equipes` | Tarefas complexas — coordenar equipes em paralelo |
  | `ler-contexto-projeto` | Ao abrir projeto — recarregar contexto |
  | `buscar-web` | Pesquisar soluções e referências |
  | `ler-dados` | Ler CSV, JSON, planilhas |
  | `categorizar-perguntas` | Planejador organiza perguntas em 5 categorias |
  | `loop-revisao` | Coordenador-revisao executa loop até aprovação |
  | `sync-context` | Todo agente atualiza /docs/management/ ao concluir |
  | `avaliar-sistema` | Juiz avalia desempenho, tokens e alucinações |
  | `ler-docs-projeto` | Lê /docs do projeto atual |
  | `detectar-stack` | Detecta tecnologias do projeto |
  | `equipe-revisao` | **Obrigatória e bloqueante** após toda implementação. 5 revisores em paralelo. Conta iterações para o Juiz. |
  | `tradutor-tiers` | Converte manifesto de intenção em contratos JSON para Tier 3. Separa narrativa de execução. |
  | `gerar-relatorio-evolutivo` | Gera diagramas Mermaid (Antes vs. Depois) e tabelas comparativas. Usada pelo Tribunal. |

---

  ## ⚖️ Meta-Nível: O Juiz e o Tribunal

  ### O Juiz

  O Juiz é um agente especial que está ACIMA de todos os tiers. Ele observa e avalia o funcionamento do sistema de agentes em si.

  #### O Que Ele Faz
  - Observa os bastidores a cada comando executado
  - Analisa gasto de tokens por agente
  - Identifica alucinações de IA recorrentes
  - Avalia eficácia do fluxo de trabalho
  - Propõe soluções estruturais e de economia
  - **Monitora o contador de iterações da skill `equipe-revisao`**
  - **Ativa o Tribunal na 3ª iteração sem aprovação**
  - **Atua como intermediário entre Orquestrador e Tribunal** (traduz justificativas)

  #### Quando Ativa
  - **Automaticamente** a cada comando (Orquestrador ativa em paralelo)
  - **Via `/juiz`** quando o usuário pede um relatório
  - **Via skill `equipe-revisao`** quando o loop atinge a 3ª iteração

  #### Onde Salva
  ```
  /docs/audit/YYYY-MM-DD_HH-MM/
  ├── relatorio.md
  ├── analise-tokens.md
  ├── alucinacoes.md
  ├── fluxo-trabalho.md
  ├── melhorias.md
  └── dados-crus-tribunal.md  # Dados enviados ao Tribunal (sem contexto)
  ```

  ### O Tribunal

  O Tribunal é o **Auditor Supremo dormente**. Ele está acima de todos os tiers, mas só desperta quando convocado.

  #### O Que Ele Faz
  - Analisa dados crus (sem contexto do projeto) para detectar alucinações
  - Coordena 5 sub-agentes especialistas em paralelo
  - Emite vereditos: ACEITÁVEL | INACEITÁVEL | NECESSITA APELAÇÃO
  - Gera relatório evolutivo visual (Mermaid + tabelas)
  - Pode receber apelações do Orquestrador (traduzidas pelo Juiz)

  #### Quando Ativa
  - **Pelo Juiz** — Quando o loop de revisão atinge a 3ª iteração sem resolução
  - **Via `/tribunal`** — Quando o usuário pede uma auditoria explícita
  - **Caso contrário: dormente** — Não consome tokens, não tem memória

  #### Blindagem de Contexto
  - O Tribunal **NÃO** tem acesso ao contexto do projeto
  - Recebe apenas: logs, diffs, métricas, relatórios de erro
  - O Orquestrador **NÃO** fala diretamente com o Tribunal — tudo via Juiz
  - O Juiz **NÃO** recebe contexto de volta do Tribunal (para não contaminá-lo)

  #### Onde Salva
  ```
  /docs/audit/tribunal/YYYY-MM-DD_HH-MM/
  ├── veredito.md
  ├── tribunal-01.md
  ├── tribunal-02.md
  ├── tribunal-03.md
  ├── tribunal-04.md
  ├── tribunal-05.md
  ├── comparativo.md
  └── relatorio-evolutivo.md
  ```

  #### Protocolo de Apelação
  ```
  Tribunal: INACEITÁVEL
    → Orquestrador: prepara justificativa técnica
      → Juiz: traduz para linguagem lógica (sem viés)
        → Tribunal: reavalia
          → Se mantido (2ª vez): BLOQUEIO FINAL → intervenção humana
          → Se aceito: veredito atualizado
  ```

  ### Fluxo de Melhoria
  ```
  Juiz propõe solução → Usuário aceita → @agente-de-intencao (atualiza manifesto) → @planejador-primario → tradutor-tiers → @arquiteto-geral → skill equipe-revisao
  ```

---

  ## 📋 Sistema de Gestão de Contexto

  Três arquivos vivos mantêm o estado do projeto persistente:

  ### `/docs/management/manifesto_de_intencao.md`
  Manifesto da tarefa atual: narrativa humana, sentimentos, objetivos, anti-objetivos, critério de fidelidade. Criado pelo `@agente-de-intencao`. É a âncora que impede a deriva de intenção.

  ### `/docs/management/implementacao.md`
  Plano vivo: objetivo, fase atual, stack, decisões, próximos passos.

  ### `/docs/management/tarefas.md`
  Checklist vivo: concluídas, em andamento, pendentes, bloqueios.

  ### `/docs/management/contratos/`
  Contratos de execução JSON gerados pela skill `tradutor-tiers`. Cada tarefa recebe um contrato estrito (task, tech_spec, hard_rules, acceptance_criteria). O Tier 3 recebe apenas o contrato — sem narrativa emocional.

  ### Skill `sync-context`
  Todo agente executa ao concluir uma tarefa para atualizar esses arquivos.
  **Economia estimada: 70-90% de tokens de contexto por rodada.**

---

  ## 📁 Estrutura de Documentação

  ```
  docs/
  ├── management/    # Estado vivo do projeto (implementacao.md, tarefas.md)
  ├── audit/         # Relatórios do Juiz (pastas datadas)
  ├── requirements/  # DER, proposta, briefing, escopo
  ├── architecture/  # Arquitetura, UML, ERD, componentes
  ├── design/        # Wireframes, mockups, user flows
  ├── testing/       # Plano de testes, casos, resultados
  └── deployment/    # Guia de deploy, CI/CD
  ```

---

  ## 🔄 Estado do Projeto

  Contexto salvo em `/docs/management/` (arquivos vivos):
  - `implementacao.md` — Plano vivo do projeto
  - `tarefas.md` — Checklist de tarefas

  **Use `/iniciar` para recarregar este contexto ao reabrir o projeto.**

---

  ## 📚 Documentação Oficial OpenCode

  - Documentação: https://opencode.ai/docs/pt-br/
  - Configuração: https://opencode.ai/docs/pt-br/config/
  - Agentes: https://opencode.ai/docs/pt-br/agents/
  - Skills: https://opencode.ai/docs/pt-br/skills/
  - Comandos: https://opencode.ai/docs/pt-br/commands/
  - MCP Servers: https://opencode.ai/docs/pt-br/mcp-servers/