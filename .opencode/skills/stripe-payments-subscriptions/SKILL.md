---
name: pagamentos-stripe-assinaturas
description: Protocolo of integração segura with Stripe for gestão of planos Starter, Pro e Business no QRGen.
metadata:
  agent: "@specialist-stripe"
  Participants: "@engineering-backend-architect, @auditor-security"
  triggered_by: "implementação of checkout, gestão of assinaturas ou webhooks"
---

## 💳 Fluxo of Pagamento (Stripe)

### Checkout e Assinaturas
- **Stripe Checkout:** Usar sessões of checkout pré-construídas for máxima segurança e conformidade PCI.
- **Customer Portal:** Integrar o portal of the cliente for que usuários gerenciem seus próprios planos e cartões.
- **Planos:** Mapear IDs of produtos of the Stripe for os planos `STARTER`, `PRO` e `BUSINESS` no database of data.

### Webhooks e Segurança
- **Assinatura of Webhook:** Validar SEMPRE a assinatura of the webhook (`stripe-signature`) for evitar ataques of replay.
- **Eventos Críticos:** Tratar obrigatoriamente `checkout.session.completed`, `invoice.paid` e `customer.subscription.deleted`.
- **Idempotência:** Garantir que o processamento of eventos seja idempotente for evitar duplicidade of créditos.

---

## ✅ Checklist of Pagamentos

- [ ] A chave secreta of the Stripe está APENAS no backend (variável of ambiente)?
- [ ] O frontend usa apenas a chave pública (`pk_test_...` ou `pk_live_...`)?
- [ ] O sistema bloqueia a generation of QRCodes se a assinatura estiver `past_due` ou `canceled`?
- [ ] Existe tratamento of erro claro for cartões recusados no checkout?
- [ ] Os webhooks estão sendo testados localmente via Stripe CLI?

---

## 🛠️ Colaboração Multi-agent
1. **@specialist-stripe:** Define a lógica of planos e eventos of webhook.
2. **@engineering-backend-architect:** Implementa os endpoints of checkout e o listener of webhooks.
3. **@auditor-security:** Valida a segurança of the integração e proteção das chaves.
