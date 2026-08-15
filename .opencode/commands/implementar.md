---
description: "Inicia fase de implementação via Arquiteto-Geral. Verifica se o planejamento foi aprovado."
agent: arquiteto-geral

subtask: true

---

## Pré-requisito

Verificar se existe plano aprovado em `/docs/requirements/` ou `.opencode/context/current-tasks.md`.

Se não houver plano, comunicar ao usuário: "É necessário planejar antes de implementar. Use `/planejar` primeiro."

## Processo

1. **Verificar plano aprovado**
   - Ler `/docs/requirements/DER.md`
   - Ler `.opencode/context/current-tasks.md`

2. **Receber tarefas do Orquestrador**

3. **Distribuir para arquitetos especializados (Tier 2):**
   - `@arquiteto-ui-ux` → frontend + UX
   - `@arquiteto-backend` → APIs + lógica
   - `@arquiteto-banco-de-dados` → schema + DB

4. **Coordenar entre arquitetos**
   - Alinhar contratos de API entre frontend e backend
   - Validar modelo de dados com regras de negócio

5. **Delegar para desenvolvedores (Tier 3):**
   - Cada arquiteto delega para seu dev
   - `@dev-frontend`, `@dev-backend`, `@dev-banco-de-dados`

6. **Implementação paralela**
   - Devs trabalham em paralelo quando não há dependências
   - `@documentacao` atualiza /docs simultaneamente

7. **Integração**
   - Frontend consome API
   - API acessa banco
   - Testar fluxo completo

8. **Atualizar progresso em `.opencode/context/progress.md`**

9. **Comunicar conclusão ao Orquestrador**
   - Orquestrador ativará `@coordenador-revisao` automaticamente