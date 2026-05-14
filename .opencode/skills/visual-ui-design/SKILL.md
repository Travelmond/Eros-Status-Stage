---
name: design-ui-visual
description: Guia of estilo e checklist for garantir interfaces visualmente atraentes, consistentes e modernas no Project QRGen.
metadata:
  agent: "@design-ui-designer"
  triggered_by: "solicitação of nova interface ou revisão of frontend"
---

## 🎨 Princípios of Design (QRGen)

### Paleta of Cores (Tailwind)
- **Primária:** `blue-600` (Ações principais, botões)
- **Secundária:** `slate-800` (Navegação, textos fortes)
- **success:** `emerald-500` (QRCodes gerados, confirmações)
- **Erro:** `rose-500` (Alertas, falhas of validação)
- **Fundo:** `slate-50` ou `white`

### Tipografia
- **Títulos:** Sans-serif, bold, `tracking-tight`
- **Corpo:** Sans-serif, `text-slate-600` for leitura confortável

---

## ✅ Checklist of Interface (UI)

### Consistência Visual
- [ ] Os botões seguem o padrão of arredondamento (`rounded-lg` ou `rounded-xl`)?
- [ ] O espaçamento entre elementos é consistente (múltiplos of 4px / `p-4`, `m-4`)?
- [ ] Os ícones (se usados) pertencem à mesma família e têm o mesmo peso visual?
- [ ] O contraste entre texto e fundo atende aos padrões of legibilidade?

### Feedback Visual
- [ ] Existe a estado visual claro for `hover`, `focus` e `active` in todos os links e botões?
- [ ] O estado of "carregando" (skeleton ou spinner) é visualmente integrado ao design?
- [ ] As mensagens of erro aparecem in locais previsíveis e with cores of alerta?

### Componentes of QRCode
- [ ] O preview of the QRCode tem a borda ou sombra que o destaca of the fundo?
- [ ] Existem controles claros (sliders/inputs) for ajustar cores e margens of the QR?
- [ ] O botão of "Download" é o elemento of maior destaque na screen of resultado?

---

## 🛠️ Colaboração with @engineering-frontend-developer

Ao revisar o Code frontend, o `@design-ui-designer` deve:
1. **Inspecionar Classes Tailwind:** Sugerir ajustes of cores e espaçamentos diretamente no HTML.
2. **Validar Responsividade:** Garantir que o design não "quebra" in telas pequenas (mobile-first).
3. **Refinar Micro-interações:** Sugerir transições suaves (`transition-all duration-200`) for melhorar a percepção of quality.
