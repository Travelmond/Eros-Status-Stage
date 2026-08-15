---
name: ler-contexto-projeto
description: "Lê a estrutura de arquivos do projeto, AGENTS.md, /docs completo e .opencode/context/ para recuperar o contexto completo ao reabrir o OpenCode."
license: MIT

compatibility: opencode

---

# Skill: Ler Contexto do Projeto

## Objetivo

Recuperar o contexto completo do projeto quando o OpenCode é reiniciado, resolvendo o problema de perda de tokens e contexto ao fechar e reabrir no VS Code.

## Quando Usar

- Ao abrir um projeto no OpenCode
- Ao executar o comando `/iniciar`
- Quando o usuário pedir para "recarregar contexto"
- Quando há confusão sobre o estado atual do projeto

## Processo

1. **Ler estrutura de arquivos**
   - Listar árvore de diretórios do projeto
   - Identificar pastas principais (src/, docs/, .opencode/, etc.)
   - Detectar arquivos de configuração (package.json, requirements.txt, etc.)

2. **Ler AGENTS.md**
   - Ler `~/.config/opencode/AGENTS.md` (global)
   - Ler `.opencode/AGENTS.md` ou `AGENTS.md` na raiz (projeto)
   - Identificar stack detectada
   - Identificar agentes específicos do projeto

3. **Ler /docs completo**
   - Ler `/docs/requirements/` (DER, proposta, briefing, escopo)
   - Ler `/docs/architecture/` (arquitetura, UML, ERD)
   - Ler `/docs/design/` (wireframes, mockups, user flows)
   - Ler `/docs/testing/` (plano de testes, casos)
   - Ler `/docs/deployment/` (guia de deploy, CI/CD)

4. **Ler .opencode/context/**
   - Ler `.opencode/context/project-summary.md`
   - Ler `.opencode/context/current-tasks.md`
   - Ler `.opencode/context/decisions-log.md`
   - Ler `.opencode/context/progress.md`

5. **Ativar skill `detectar-stack`** (se disponível)
   - Confirmar stack tecnológica
   - Detectar Git, APIs, MCP

6. **Apresentar resumo ao usuário**
   - Resumo do projeto
   - Tarefas atuais
   - Progresso
   - Próximos passos sugeridos

7. **Perguntar o que fazer a seguir**

## Output Esperado

- Estrutura do projeto mapeada
- Stack tecnológica identificada
- Documentação lida e compreendida
- Estado atual do projeto recuperado
- Resumo apresentado ao usuário
- Próximos passos sugeridos

## Regras

- **SEMPRE leia tudo** — Não pule arquivos de contexto
- **SEJA conciso no resumo** — O usuário não precisa ver tudo, apenas o resumo
- **DESTAQUE tarefas em andamento** — O que estava sendo feito antes de fechar
- **SUGIRA próximos passos** — Baseado no progresso atual