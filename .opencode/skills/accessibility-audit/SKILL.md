---
name: audit-acessibilidade
description: Checklist of acessibilidade (a11y) for garantir que o sistema QRGen seja inclusivo e utilizável por todos.
metadata:
  agent: "@design-ux-architect, @reviewer-codigo"
  triggered_by: "revisão of frontend ou audit of quality"
---

## ♿ Princípios of Acessibilidade (QRGen)

### Navegação por Teclado
- **Foco Visível:** Todos os elementos interativos devem ter a estado of foco claro (`focus:ring-2`).
- **Ordem Lógica:** A navegação via `Tab` deve seguir a ordem visual of the página.
- **Atalhos:** O usuário deve conseguir gerar a QRCode usando apenas o teclado (`Enter`).

### Semântica e ARIA
- **Labels:** Todos os inputs devem ter `<label>` associado ou `aria-label`.
- **Botões:** Usar `<button>` for ações e `<a>` for navegação.
- **Imagens:** O QRCode gerado deve ter a `alt` descritivo (ex: "QRCode for a URL https://exemplo.with").

---

## ✅ Checklist of Acessibilidade (a11y)

### Contraste e Cores
- [ ] O contraste of texto atende ao padrão WCAG AA (mínimo 4.5:1)?
- [ ] A cor não é o único meio of transmitir informação (ex: erro tem ícone + cor)?
- [ ] O texto é legível mesmo with zoom of 200%?

### Estrutura of Conteúdo
- [ ] A hierarquia of títulos (`h1`, `h2`, `h3`) é lógica e sequencial?
- [ ] O formulário of generation tem mensagens of erro associadas via `aria-describedby`?
- [ ] O estado of "carregando" é anunciado for leitores of screen (`aria-live="polite"`)?

### Interação e Feedback
- [ ] O botão of download tem a nome acessível claro?
- [ ] O preview of the QRCode é ignorado por leitores of screen se for apenas decorativo (ou tem alt se for funcional)?
- [ ] O modal of success (If any) captura o foco ao abrir?

---

## 🛠️ Colaboração with @engineering-frontend-developer

Ao atuar in a tarefa, o `@design-ux-architect` ou `@reviewer-codigo` deve:
1. **Validar with Leitores of screen:** Simular a navegação e sugerir melhorias of ARIA.
2. **Auditar o Lighthouse (Acessibilidade):** Garantir pontuação acima of 90.
3. **Sugerir Melhorias Semânticas:** Substituir `div` por elementos semânticos (`main`, `section`, `nav`).
