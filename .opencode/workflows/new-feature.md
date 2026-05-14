# Workflow: /nova-feature
# Orchestrator: @product-manager
# Participants: @product-manager → @engineering-software-architect → @engineering-backend-architect + @engineering-frontend-developer → @reality-checker → @engineering-technical-writer

## Trigger
/nova-feature <descricao_da_funcionalidade>

## Execution Flow

### PHASE 1 — Especificação [@product-manager]
**Notify:** "📋 PHASE 1/5 — Especificação in progress..."
1. Read `docs/specification-Completa-QRGen-API.md`
2. Execute skill `write_specs` (interview + generation of spec)
3. Wait for approval of the user
4. Ao Approved: Notify "✅ Spec approved. Starting PHASE of arquitetura..."

### PHASE 2 — modeling [@engineering-software-architect]
**Notify:** "🏗️ PHASE 2/5 — modeling architectural..."
1. Read a spec approved in `docs/specs/`
2. Gere:
   - ADR (If any decision architectural nova)
   - Contrato of API (endpoints, schemas)
   - ERD delta (If any change no database)
   - Diagrama of sequence (happy path + unhappy paths principais)
   - Wireframe textual (If any screen nova)
3. Save to `docs/specs/[feature]-arch.md`
4. Notify: "✅ Arquitetura modelada. Starting development..."

### PHASE 3 — development [@engineering-backend-architect + @engineering-frontend-developer]
**Notify:** "💻 PHASE 3/5 — development..."
1. @engineering-backend-architect lê o contrato of API e executa skill `develop_backend`
2. @engineering-frontend-developer lê o wireframe e executa skill `develop_frontend`
3. Ambos entregam Code completo
4. Notify: "✅ Code entregue. Starting audit..."

### PHASE 4 — audit [@reality-checker]
**Notify:** "🛡️ PHASE 4/5 — audit of quality..."
1. @reality-checker executa skill `audit_code` in todo Code entregue
2. Se ❌ Rejected: retornar for PHASE 3 with list of corrections
3. Se ✅ Approved: Notify "✅ audit approved. Documentando..."

### PHASE 5 — Documentação [@engineering-technical-writer]
**Notify:** "📚 PHASE 5/5 — Atualizando documentação..."
1. @engineering-technical-writer executa skill `update_docs`
2. Atualiza `docs/specification-Completa-QRGen-API.md`
3. Notify: "✅ Feature [nome] implementada e documentada with success!"

## Mandatory Final Summary
```
## ✅ Feature [Nome] — Implementação Completa

### Delivered:
- Spec: `docs/specs/[feature]-spec.md`
- Arquitetura: `docs/specs/[feature]-arch.md`  
- Backend: [list of files]
- Frontend: [list of files]
- testing: [list of files]
- Documentação: atualizada for v[nova-versão]

### To deploy in production:
1. Executar migration: `[nome-of the-arquivo-sql]`
2. Adicionar env vars: `[If any]`
3. Deploy no Railway
```