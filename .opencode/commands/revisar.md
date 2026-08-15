---
description: "Ativa loop de revisão com todos os críticos em paralelo. Coordena correções até aprovação total."
agent: coordenador-revisao

subtask: true

---

Ative a skill `loop-revisao` e execute o loop de revisão completo.

## Processo

1. **Ativar skill `loop-revisao`**

2. **Ativar todos os críticos em paralelo:**
   - `@critico` → "Revise todo o código em /src"
   - `@critico-usuario` → "Teste a interface como usuário"
   - `@testador` → "Crie e execute testes"
   - `@auditor-seguranca` → "Verifique vulnerabilidades"
   - `@otimizador` → "Identifique gargalos de performance"

3. **Consolidar relatórios**
   - Agrupar por área (frontend, backend, banco, segurança, performance)
   - Priorizar por severidade (🔴 → 🟢)

4. **Atribuir correções:**
   - Bug de frontend → `@arquiteto-ui-ux` → `@dev-frontend`
   - Bug de backend → `@arquiteto-backend` → `@dev-backend`
   - Bug de banco → `@arquiteto-banco-de-dados` → `@dev-banco-de-dados`
   - Vulnerabilidade → `@arquiteto-backend` → `@dev-backend`
   - Performance → `@otimizador` ou `@arquiteto-*`
   - UX → `@arquiteto-ui-ux` → `@dev-frontend`

5. **Loop de correção:**
   - Enviar problemas para correção
   - Reativar críticos após correção
   - Iterar até que TODOS aprovem

6. **Aprovação final**
   - Verificar: `@critico` ✅, `@critico-usuario` ✅, `@testador` ✅, `@auditor-seguranca` ✅, `@otimizador` ✅
   - Comunicar ao Orquestrador: "Fase de revisão concluída"

7. **Gerar relatório em `.opencode/context/progress.md`**