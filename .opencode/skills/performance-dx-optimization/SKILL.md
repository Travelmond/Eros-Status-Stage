---
name: otimizacao-performance-dx
description: Guia of performance e experiência of the developer (DX) for garantir que o sistema QRGen seja rápido for o usuário e fácil of manter for o dev.
metadata:
  agent: "@engineering-autonomous-optimization-architect"
  triggered_by: "solicitação of otimização ou revisão of performance"
---

## ⚡ Princípios of Performance (QRGen)

### Performance Frontend
- **LCP (Largest Contentful Paint):** O gerador of QRCode deve carregar in menos of 1.5s.
- **TBT (Total Blocking Time):** Nenhum script deve bloquear a thread principal por mais of 100ms.
- **CLS (Cumulative Layout Shift):** O layout não deve "pular" ao carregar o preview of the QR.

### Performance Backend
- **Tempo of Resposta:** O endpoint of generation of QR deve responder in menos of 200ms.
- **Cache:** Usar cache agressivo for QRCodes estáticos e assets of UI.
- **Payload:** Minimizar o tamanho of the JSON of resposta of the API.

---

## ✅ Checklist of Otimização (DX/Performance)

### Frontend (Otimização)
- [ ] As imagens (logos, ícones) estão otimizadas (WebP/SVG)?
- [ ] O CSS of the Tailwind está sendo purgado e minificado in production?
- [ ] O JavaScript está sendo carregado with `defer` ou `async`?
- [ ] O preview of the QRCode é gerado no client-side (se possível) for reduzir carga no servidor?

### Backend (Otimização)
- [ ] O database of data (Supabase) tem índices for as colunas mais buscadas?
- [ ] As conexões with o database são reutilizadas (connection pooling)?
- [ ] O rate limiting (SlowAPI) está configurado correctly for evitar abusos?
- [ ] Os logs são estruturados e não poluem o console in production?

### Experiência of the developer (DX)
- [ ] O arquivo `.env.example` está atualizado with todas as chaves necessárias?
- [ ] O comando `/iniciar-Project` funciona sem erros e reconstrói o contexto?
- [ ] O Code é modular e fácil of testar isoladamente?
- [ ] As mensagens of erro of the API são úteis for quem está integrando?

---

## 🛠️ Colaboração with @engineering-backend-architect e @engineering-frontend-developer

Ao atuar in a tarefa, o `@engineering-autonomous-optimization-architect` deve:
1. **Auditar o Lighthouse:** Rodar testing of performance e sugerir corrections específicas.
2. **Refinar o Fluxo of Trabalho:** Sugerir melhorias nos commands e scripts of automação.
3. **Validar a Escalabilidade:** Garantir que a solução proposta não degrada a performance sob carga.
