---
description: "Gerencia branches e commits (condicional: só se Git detectado). Pergunta ao usuário antes de agir."
agent: devops

subtask: true

---

## Pré-requisito

Verificar se Git foi detectado no projeto (`.git/` existe).

Se não houver Git, comunicar: "Git não detectado neste projeto."

Se houver, prosseguir.

## Processo

1. **Verificar status do Git**
   - `git status`
   - Identificar arquivos modificados
   - Identificar branch atual

2. **Perguntar ao usuário:**
   - "Quer criar uma nova branch? (feature/fix/hotfix)"
   - "Quer commitar as mudanças?"
   - "Quer fazer push?"
   - "Quer criar um pull request?"

3. **Criar branch (se solicitado)**
   - `feature/[nome]` para novas features
   - `fix/[nome]` para correções
   - `hotfix/[nome]` para correções urgentes

4. **Commit (se solicitado)**
   - Adicionar arquivos modificados
   - Criar commit semântico:
     - `feat:` nova funcionalidade
     - `fix:` correção de bug
     - `docs:` documentação
     - `refactor:` refatoração
     - `test:` testes
     - `chore:` tarefas de manutenção

5. **Push (se solicitado)**
   - Push para remote
   - Confirmar sucesso

6. **Pull Request (se solicitado)**
   - Criar PR: `feature/* → develop` ou `develop → main`
   - Adicionar descrição
   - Adicionar labels

7. **Merge (se solicitado e após aprovação)**
   - Merge PR
   - Deletar branch (opcional)

8. **Tag (se solicitado)**
   - Criar tag versionada (v1.0.0)
   - Push tags

**NUNCA faça force push para main.**