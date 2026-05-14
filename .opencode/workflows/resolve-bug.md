# Workflow: /resolver-bug
# agent: @sre
# Participants: @sre → @engineering-backend-architect ou @engineering-frontend-developer → @reality-checker

## Trigger
/resolver-bug <descricao_do_erro>

## Execution Flow

### ETAPA 1 — Triagem [@sre]
**Notify:** "🔍 ETAPA 1/4 — Triagem of the erro..."

Classifique o erro:
- **Tipo A — Backend:** erro 5xx, traceback Python, query falhou
  → Solicite: "Por favor, cole o traceback completo of the terminal of the Uvicorn/Railway"
- **Tipo B — Frontend/Integração:** erro 4xx, CORS, payload incorreto
  → Solicite: "Por favor, abra F12 → Network → copie o Request Payload e a Response completa"
- **Tipo C — database of data:** data incorretos, constraint violation
  → Solicite: "Cole a query exata que está falhando e o erro of the Supabase"

⚠️ NÃO prossiga for a Etapa 2 sem os data solicitados.

### ETAPA 2 — Hipóteses [@sre]
**Notify:** "🧠 ETAPA 2/4 — Análise of hipóteses..."

with base nos logs coletados, liste EXATAMENTE 3 hipóteses:
```
## Hipóteses for [descrição of the erro]

1. **[Hipótese mais provável]:** [justificativa técnica baseada nos logs]
2. **[Segunda hipótese]:** [justificativa técnica]
3. **[Terceira hipótese]:** [justificativa técnica]

**Hipótese escolhida for investigação:** #[número]
**Motivo:** [por que esta é a mais provável]
```

### ETAPA 3 — Correção [@engineering-backend-architect ou @engineering-frontend-developer]
**Notify:** "🔧 ETAPA 3/4 — Aplicando correção..."

O agent of dev relevante aplica correção mínima e cirúrgica:
- Altere APENAS o necessário for corrigir o bug
- Documente a causa-raiz no comentário of the Code corrigido
- Não refatore Code não relacionado ao bug

### ETAPA 4 — Verificação [@reality-checker]
**Notify:** "✅ ETAPA 4/4 — Verificação of the correção..."
1. @reality-checker verifica que o fix resolve o bug
2. @reality-checker sugere teste of regressão for prevenir recorrência
3. Atualiza docs se o comportamento esperado mudou