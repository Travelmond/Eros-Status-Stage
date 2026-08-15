---
description: "Recarrega contexto completo do projeto ao reabrir o OpenCode. Lê estrutura, AGENTS.md, /docs e /docs/management/."
agent: orquestrador

subtask: false

---

Ative a skill `ler-contexto-projeto` e execute os seguintes passos:

## Processo

1. **Ler estrutura de arquivos do projeto**
   - Listar árvore de diretórios
   - Identificar pastas principais

2. **Ler AGENTS.md**
   - Global: `~/.config/opencode/AGENTS.md`
   - Projeto: `.opencode/AGENTS.md` ou `AGENTS.md` na raiz

3. **Ler /docs completo**
   - `/docs/requirements/` (DER, proposta, briefing, escopo)
   - `/docs/architecture/` (arquitetura, UML, ERD)
   - `/docs/design/` (wireframes, mockups, user flows)
   - `/docs/testing/` (plano de testes, casos)
   - `/docs/deployment/` (guia de deploy, CI/CD)

4. **Ler /docs/management/** (estado vivo do projeto)
   - `implementacao.md` — plano vivo (objetivo, fase, stack, decisões)
   - `tarefas.md` — checklist vivo (concluídas, em andamento, pendentes)

5. **Ativar skill `detectar-stack`** para confirmar tecnologias

6. **Apresentar resumo ao usuário:**
   - Resumo do projeto
   - Stack tecnológica
   - Tarefas atuais
   - Progresso
   - Próximos passos sugeridos

7. **Perguntar o que fazer a seguir**