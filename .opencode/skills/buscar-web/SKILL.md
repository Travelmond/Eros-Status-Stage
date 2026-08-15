---
name: buscar-web
description: "Pesquisa na internet via MCP web-search por soluções, referências e melhores práticas. Sempre cita fontes."
license: MIT

compatibility: opencode

---

# Skill: Buscar na Web

## Objetivo

Pesquisar informações na internet para resolver erros, encontrar melhores práticas e validar soluções.

## Quando Usar

- Quando um erro é encontrado e a solução não é óbvia
- Quando se precisa de referências para uma implementação
- Quando se quer validar se uma abordagem é melhor prática
- Quando o usuário pede para pesquisar algo

## Processo

1. **Receber query de pesquisa**
   - Formulação da dúvida em termos pesquisáveis
   - Identificar palavras-chave principais

2. **Formular queries eficientes**
   - Usar termos técnicos específicos
   - Incluir versão da tecnologia quando relevante
   - Adicionar "best practices" ou "example" quando apropriado

3. **Usar MCP de busca**
   - Usar `web-search` (Brave Search ou similar)
   - Executar query
   - Coletar resultados

4. **Filtrar e ranquear resultados**
   - Priorizar documentação oficial
   - Priorizar Stack Overflow com high votes
   - Priorizar artigos recentes
   - Descartar resultados irrelevantes

5. **Extrair informações relevantes**
   - Ler conteúdo dos melhores resultados
   - Sintetizar informações
   - Identificar padrões nas soluções

6. **Apresentar com citações**
   - Solução encontrada
   - Código de exemplo (se aplicável)
   - Fontes citadas (URL + título)

## Regras

- **SEMPRE cite fontes** — URL e título de cada referência
- **VALIDE em múltiplas fontes** — Não confie em um único resultado
- **PRIORIZE fontes oficiais** — Documentação > Blog > Fórum
- **SINTETIZE** — Não copie, interprete
- **SEJA rápido** — Não passe muito tempo em uma query

## Output Esperado

- Solução ou referência encontrada
- Código de exemplo (se aplicável)
- Fontes citadas (URL + título)
- Recomendação de aplicação