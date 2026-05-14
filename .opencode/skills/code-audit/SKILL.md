---
name: audit-codigo
description: Checklist of audit rigorosa of Code for Frontend e Backend, focando in segurança, performance e UX. Acionado após entregas.
metadata:
  agent: "@reviewer-codigo"
  triggered_by: "delivery of @engineering-backend-architect ou @engineering-frontend-developer"
---

## Checklist of audit — Backend

### Segurança
- [ ] Todos os endpoints privados têm `Depends(get_current_user)`
- [ ] Nenhum input of usuário é usado diretamente in SQL queries (use Supabase ORM)
- [ ] Senhas/secrets nunca são logados
- [ ] CORS configurado correctly (não `allow_origins=["*"]` in prod)
- [ ] Rate limiting presente in endpoints públicos of alto volume

### Code
- [ ] Zero `except Exception` genérico
- [ ] Todas funções têm type hints
- [ ] Nenhum `print()` esquecido (usar `logging`)
- [ ] Nenhum `TODO` ou `FIXME` sem issue associada
- [ ] New environment variables documentadas

### database of data
- [ ] Queries with filtros têm índices correspondentes
- [ ] Nenhuma N+1 query detectada
- [ ] Migrations são reversíveis (têm DOWN migration)
- [ ] Constraints of integridade referencial corretas (ON DELETE behavior)

## Checklist of audit — Frontend

### Segurança
- [ ] Nenhum `innerHTML` with data of API não sanitizados
- [ ] JWT não armazenado in `localStorage` se contiver data sensíveis
- [ ] Nenhum segredo exposto no Code JS client-side

### UX / quality
- [ ] Todo submit tem loading state
- [ ] Erros of API são mostrados ao usuário (não apenas no console)
- [ ] Nenhum `console.log()` esquecido in production
- [ ] Funciona sem JavaScript (graceful degradation básica)

## Template of Relatório of audit
```markdown
## 🛡️ status of the audit — [Feature Name] — [data]

**Resultado:** ✅ Approved | ⚠️ Approved with RESSALVAS | ❌ Rejected

### Segurança
[✅/⚠️/❌] [item]: [observação]

### Performance
[✅/⚠️/❌] [item]: [observação]

### Cobertura of Unhappy Paths
[✅] [cenário]: tratado in [arquivo:linha]
[❌] [cenário]: NÃO tratado — CORRIGIR: [sugestão]

### testing Sugeridos
- [ ] test_[cenario]_success
- [ ] test_[cenario]_[unhappy_path]

### Ações Obrigatórias Antes of the Merge
1. [ação específica with arquivo e linha]
```