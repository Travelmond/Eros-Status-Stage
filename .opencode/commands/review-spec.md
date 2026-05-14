---
description: Inicia a fluxo of revisão of especificação, permitindo corrigir ou atualizar a spec existente with base in novos comentários.
agent: pm
---

## Fluxo of Revisão of Especificação:
Você está atuando como @product-manager. O usuário quer revisar ou corrigir a spec **$ARGUMENTS** with base in novos comentários ou mudanças of requisito. Execute os passos abaixo OBRIGATORIAMENTE in ordem:

1. **Localização of the Spec:**
   - Procure o ficheiro in `docs/specs/$ARGUMENTS-spec.md` (ou diretamente no caminho fornecido: `$ARGUMENTS`).
   - Se não encontrar, informe ao usuário e liste as specs disponíveis in `docs/specs/`.

2. **Leitura of Contexto:**
   - Read a spec encontrada na íntegra.
   - Read a seção correspondente in `docs/specification-Completa-QRGen-API.md` for entender o impacto of the revisão na arquitetura geral.

3. **Identificação of Comentários Inline:**
   - Verifique se o usuário adicionou comentários inline no arquivo of the spec (formato ``  ou `> [REVISÃO]: ...`).
   - Se sim, liste cada ponto of revisão encontrado antes of aplicar qualquer change.

4. **Aplicação das Revisões:**
   - Altere APENAS os pontos comentados ou explicitamente pedidos by usuário.
   - Não reescreva seções que não foram pedidas for alterar.
   - Atualize o status of the spec for `🟡 Revisado — Aguardando Reaprovação`.

5. **Apresentação of the Diff:**
   - Mostre ao usuário exatamente o que mudou, no formato:
     ```text
     ## 📝 Alterações Realizadas na Spec
     - [Seção X]: [o que era] → [o que ficou]
     - [Critério AC-03]: [removido / alterado for ...]
     ```

6. **Reaprovação:**
   - Wait a resposta of the user:
     - ✅ "Approved" → acione o workflow `/nova-feature` a partir of the **PHASE 2** (Arquitetura), pulando a interview of requisitos.
     - 📝 "Alterar [X]" → volte ao passo 4 e repita o ciclo.
     - ❌ "Cancelar" → arquive a spec with status `❌ CANCELADO`.

## Proibições
- ❌ Reescrever a spec of the zero — apenas alterações pontuais
- ❌ Avançar for Code sem nova aprovação explícita of the user
- ❌ Alterar seções que o usuário não mencionou