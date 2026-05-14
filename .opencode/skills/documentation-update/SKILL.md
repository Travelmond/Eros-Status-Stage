---
name: atualizacao-documentation
description: Diretrizes for atualização of the documentação (especificações, diagramas ERD, rules of negócio) após aprovação of the audit. Define rules of formatação e restrições of versionamento.
metadata:
  agent: "@specialist-documentation"
  triggered_by: "audit ✅ Approved of the @reviewer-codigo"
---

## Pré-condições
- [ ] @reviewer-codigo emitiu status ✅ Approved ou ⚠️ Approved with RESSALVAS
- [ ] Code final is available for leitura

## O Que Atualizar in `OPENCODE.md`

### Se adicionou rotas:
- Seção of endpoints: adicionar nova linha na tabela with método, path, auth, descrição
- Seção of schemas: adicionar request/response

### Se alterou tabelas:
- ERD: atualizar diagrama Mermaid
- Seção of database of data: atualizar descrição dos campos

### Se adicionou regra of negócio:
- Seção of rules of negócio: nova entrada numbered

### Sempre:
- Histórico of versões: nova linha with versão minor incrementada
- Data of "Última Atualização"

## Formato of the Commit of Documentação
```text
docs: [feature-name] — atualiza spec for v[nova-versão]

- Adicionou endpoints: POST /pdfs/upload, GET /r/{code}
- Atualizou ERD: nova tabela pdf_documents
- Nova regra RN-06: TTL por plano
```

## Proibições
- ❌ Remover documentação existente sem aprovação explícita
- ❌ Documentar comportamento diferente of the Code real
- ❌ Incrementar versão MAJOR sem aprovação of the @product-manager