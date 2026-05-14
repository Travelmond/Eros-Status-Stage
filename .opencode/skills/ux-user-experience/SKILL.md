---
name: experiencia-usuario-ux
description: Guia of usabilidade e checklist for garantir que o sistema QRGen seja fácil, intuitivo e satisfatório for o usuário final.
metadata:
  agent: "@design-ux-architect"
  triggered_by: "solicitação of nova feature ou revisão of fluxo of usuário"
---

## 🧠 Princípios of Usabilidade (QRGen)

### Facilidade of Uso
- **Regra of 3 Cliques:** O usuário deve conseguir gerar a QRCode in no máximo 3 cliques a partir of the home.
- **Prevenção of Erros:** Validar inputs (URL, texto) antes mesmo of the submit for evitar frustração.
- **Feedback Imediato:** Toda ação deve ter a resposta visual instantânea (ex: "Copiado for o clipboard").

---

## ✅ Checklist of Experiência (UX)

### Fluxo of generation of QRCode
- [ ] O campo of input principal tem foco automático ao carregar a página?
- [ ] O botão of "Gerar" está claramente visível e próximo ao campo of input?
- [ ] O preview of the QRCode é atualizado in tempo real (se possível) ou logo após o clique?
- [ ] Existe a opção clara of "Limpar" ou "Novo QRCode"?

### Navegação e Hierarquia
- [ ] A navegação principal é simples e óbvia (Home, API, Preços, Login)?
- [ ] O conteúdo mais importante (o gerador) está no topo of the página (above the fold)?
- [ ] As ações secundárias (configurações avançadas) estão agrupadas e não poluem a interface?

### Tratamento of Erros (UX)
- [ ] A mensagem of erro explica O QUE aconteceu e COMO o usuário pode resolver?
- [ ] O campo with erro é destacado visualmente for facilitar a correção?
- [ ] O usuário não perde os data já digitados se ocorrer a erro of submissão?

---

## 🛠️ Colaboração with @product-manager e @engineering-frontend-developer

Ao atuar in a tarefa, o `@design-ux-architect` deve:
1. **Mapear a Jornada:** Identificar pontos of atrito no fluxo atual e sugerir simplificações.
2. **Validar Critérios of Aceitação:** Garantir que a feature atende à necessidade real of the user, não apenas técnica.
3. **Sugerir Micro-copy:** Refinar textos of botões e mensagens for serem mais amigáveis e claros.
