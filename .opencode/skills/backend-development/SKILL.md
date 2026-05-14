---
name: development-backend
description: Diretrizes e checklist mandatory for development backend. Inclui Implementation Order, pré-condições, rules of schemas, services, routers e testing.
metadata:
  agent: "@engineering-backend-architect"
  Participants: "@engineering-backend-architect, @engineering-database-optimizer, @engineering-senior-developer, @engineering-autonomous-optimization-architect"
  triggered_by: "spec approved by @product-manager"
---

## 👥 Roles and Collaboration
- **@engineering-backend-architect:** Define o contrato of API e modelos of data.
- **@engineering-database-optimizer:** Valida as SQL queries e RLS policies.
- **@engineering-senior-developer:** Revisa a quality e padrões of the Code Python.
- **@engineering-autonomous-optimization-architect:** Garante que o Code seja performático e fácil of manter.

## Mandatory Pre-conditions
Antes of escrever a linha of Code, confirme:
- [ ] Spec in `docs/AAAA-MM-DD/[feature]-spec.md` tem status "✅ Approved"
- [ ] Contrato of API of the @engineering-backend-architect is available
- [ ] Migration SQL (If necessary) was reviewed by @engineering-backend-architect e @engineering-database-optimizer

## Implementation Order
1. **Schemas Pydantic** (`app/schemas/[feature].py`)
   - Request models with validação completa
   - Response models with todos os campos documentados
   
2. **Services** (`app/services/[feature]_service.py`)
   - Business logic isolada of the router
   - Handles all unhappy paths identificados na spec
   
3. **Router** (`app/routers/[feature].py`)
   - Endpoints FastAPI usando os services
   - Dependency injection for auth e db
   - Correct HTTP status codes (201 for create, 202 for async, 410 for gone, etc.)
   
4. **testing** (`tests/test_[feature].py`)
   - Happy path
   - Cada unhappy path listado na audit

## Delivery Checklist
- [ ] All functions have type hints
- [ ] No generic `except Exception`
- [ ] New environment variables adicionadas ao `.env.example`
- [ ] Migration SQL numbered correctly (ex: `003_add_pdf_documents.sql`)
- [ ] audit of unhappy paths listada no início of the delivery

## Delivery Format
```markdown
## 🚨 PREVIOUS AUDIT — What can go wrong:
1. [Unhappy path 1]
2. [Unhappy path 2]
3. [Unhappy path 3]

## 📁 files Delivered:
- `app/schemas/pdf.py` — schemas of upload e response
- `app/services/pdf_service.py` — Business logic
- `app/routers/pdfs.py` — endpoints
- `tests/test_pdf_upload.py` — testing

## 💻 Code:
```
[Code completo]
```
## 🗄️ Migration:
```
[SQL completo]
```

```