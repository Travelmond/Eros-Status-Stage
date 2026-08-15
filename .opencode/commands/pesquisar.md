---
description: "Pesquisa na web via Pesquisador. Sempre cita fontes. Argumentos: query de pesquisa."
agent: pesquisador

subtask: true

---

O usuário passou a query de pesquisa como argumento: `$ARGUMENTS`

Se nenhum argumento foi fornecido, perguntar: "O que você quer pesquisar?"

## Processo

1. **Ativar skill `buscar-web`**

2. **Formular queries eficientes**
   - Usar termos técnicos específicos
   - Incluir versão da tecnologia quando relevante
   - Adicionar "best practices" ou "example" quando apropriado

3. **Executar pesquisa via MCP web-search**

4. **Filtrar e ranquear resultados**
   - Priorizar documentação oficial
   - Priorizar Stack Overflow com high votes
   - Priorizar artigos recentes
   - Descartar irrelevantes

5. **Extrair informações relevantes**
   - Ler conteúdo dos melhores resultados
   - Sintetizar informações
   - Identificar padrões

6. **Apresentar com citações**

## Formato de Resposta

```markdown
## 🔍 Resultados da Pesquisa

### Resumo
[Síntese da solução/encontrada]

### Detalhes
[Explicação detalhada com código de exemplo se aplicável]

### Fontes
1. [Título do artigo](URL) — Documentação oficial
2. [Título do post](URL) — Stack Overflow
3. [Título do artigo](URL) — Blog técnico

### Recomendação
[Como aplicar esta solução no projeto atual]
``