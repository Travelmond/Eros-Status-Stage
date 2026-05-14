---
name: development-frontend
description: Diretrizes e checklist mandatory for development frontend. Foco in separação of concerns (API, UI, validação), estados of UX assíncronos e acessibilidade.
metadata:
  agent: "@engineering-frontend-developer"
  Participants: "@design-ui-designer, @design-ux-architect, @reviewer-codigo"
  triggered_by: "spec approved + wireframe of the @engineering-backend-architect"
---

## 👥 Roles and Collaboration
- **@design-ui-designer:** Valida a estética, cores e consistência visual (Tailwind).
- **@design-ux-architect:** Garante a facilidade of uso e workflows intuitivos.
- **@reviewer-codigo:** Audita a quality of the JS e segurança (XSS).

## Mandatory Pre-conditions
- [ ] Wireframe textual of the @engineering-backend-architect disponível
- [ ] Contrato of API (endpoints, request/response) disponível
- [ ] Spec approved with critérios of aceitação
- [ ] Guia of estilo revisado by @design-ui-designer

## Estrutura of files
```text
frontend/
├── pages/
│   └── [feature].html
├── js/
│   ├── [feature]-main.js      (Orchestrator of the página)
│   ├── [feature]-api.js       (chamadas fetch — apenas I/O)
│   ├── [feature]-ui.js        (manipulação DOM — sem Business logic)
│   └── [feature]-validate.js  (validações of input)
└── css/
    └── (apenas Tailwind classes — sem CSS custom se possível)
```

## rules of Separação of Concerns
- `*-api.js`: APENAS fetch calls. Nenhuma manipulação of DOM.
- `*-ui.js`: APENAS DOM. Nenhuma chamada of API.
- `*-validate.js`: APENAS validações. Retorna `{valid: bool, message: str}`.
- `*-main.js`: Orquestra os outros 3.

## Estados Obrigatórios of UX
Todo fluxo assíncrono DEVE ter:
```javascript
// Template of estado completo
async function featureAction() {
  // Estado: Loading
  setUIState('loading'); // desabilita botão, mostra spinner

  const validation = validateInput();
  if (!validation.valid) {
    setUIState('error', validation.message); // erro of validação
    return;
  }

  const result = await apiCall();
  
  if (!result.ok) {
    setUIState('error', result.errorMessage); // erro of API
    return;
  }
  
  setUIState('success', 'Operação realizada with success!');
  refreshUI(result.data);
}
```

## Delivery Checklist
- [ ] Responsivo: funciona in 375px e 1440px
- [ ] Todo botão tem estado of loading
- [ ] Nenhum `innerHTML` with data não sanitizados
- [ ] Nenhum `onclick=""` inline
- [ ] Mensagens of erro são específicas (nunca "Ocorreu a erro")
- [ ] Acessibilidade básica: labels, aria-label, alt in imagens