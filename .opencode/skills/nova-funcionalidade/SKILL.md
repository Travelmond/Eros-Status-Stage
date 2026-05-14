---
name: nova-funcionalidade
description: Workflow Orchestrator for criação of novas funcionalidades. Coordena o fluxo entre @product-manager, @engineering-backend-architect, @engineering-backend-architect, @engineering-frontend-developer, @reviewer-codigo e @specialist-documentation.
metadata:
  Orchestrator: "@product-manager"
  Participants: "@product-manager → @engineering-backend-architect → @engineering-backend-architect + @engineering-frontend-developer → @reviewer-codigo → @specialist-documentation"
  Trigger: "/nova-feature <descricao_da_funcionalidade>"
---

## Execution Flow

### PHASE 1 — Especificação [@product-manager]
**Notify:** "📋 PHASE 1/5 — Especificação in progress..."
1. Read `docs/OPENCODE.md`
2. Execute a skill `write-specs` (interview + generation of spec)
3. Wait for approval of the user
4. Ao Approved: Notify "✅ Spec approved. Starting PHASE of arquitetura..."

### PHASE 2 — modeling [@engineering-backend-architect]
**Notify:** "🏗️ PHASE 2/5 — modeling architectural..."
1. Read a spec approved in `docs/AAAA-MM-DD/`
2. Gere:
   - ADR (If any decision architectural nova)
   - Contrato of API (endpoints, schemas)
   - ERD delta (If any change no database)
   - Diagrama of sequence (happy path + unhappy paths principais)
   - Wireframe textual (If any screen nova)
3. Save to `docs/AAAA-MM-DD/[feature]-arch.md`
4. Notify: "✅ Arquitetura modelada. Starting development..."

### PHASE 3 — development [@engineering-backend-architect + @engineering-frontend-developer]
**Notify:** "💻 PHASE 3/5 — development..."
1. @engineering-backend-architect lê o contrato of API e executa a skill `develop-backend`
2. @engineering-frontend-developer lê o wireframe e executa a skill `develop-frontend`
3. Ambos entregam Code completo
4. Notify: "✅ Code entregue. Starting audit..."

### PHASE 4 — audit [@reviewer-codigo]
**Notify:** "🛡️ PHASE 4/5 — audit of quality..."
1. @reviewer-codigo executa a skill `audit-code` in todo Code entregue
2. Se ❌ Rejected: retornar for PHASE 3 with list of corrections
3. Se ✅ Approved: Notify "✅ audit approved. Documentando..."

### PHASE 5 — Documentação [@specialist-documentation]
**Notify:** "📚 PHASE 5/5 — Atualizando documentação..."
1. @specialist-documentation executa a skill `update-docs`
2. Atualiza `docs/OPENCODE.md`
3. Notify: "✅ Feature [nome] implementada e documentada with success!"

## Mandatory Final Summary
```text
## ✅ Feature [Nome] — Implementação Completa

### Delivered:
- Spec: `docs/AAAA-MM-DD/[feature]-spec.md`
- Arquitetura: `docs/AAAA-MM-DD/[feature]-arch.md`  
- Backend: [list of files]
- Frontend: [list of files]
- testing: [list of files]
- Documentação: atualizada for v[nova-versão]

### To deploy in production:
1. Executar migration: `[nome-of the-arquivo-sql]`
2. Adicionar env vars: `[If any]`
3. Deploy no Railway
```