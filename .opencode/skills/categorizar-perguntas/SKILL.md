---
name: categorizar-perguntas
description: "Instrui o planejador a organizar perguntas ao usuário em 5 categorias distintas: Escopo, Stack, Usuários, Dados, Infra. Nunca misturar categorias."
license: MIT

compatibility: opencode

---

# Skill: Categorizar Perguntas

## Objetivo

Garantir que o planejador organize suas perguntas ao usuário em 5 categorias distintas, apresentadas uma de cada vez, nunca misturadas.

## Quando Usar

- Sempre que o `planejador-primario` precisa fazer perguntas ao usuário
- Sempre que se está na fase de planejamento

## As 5 Categorias

### Categoria 1 — Escopo e Objetivo
**Fazer primeiro. Define o que será feito.**

Perguntas exemplo:
- O que exatamente precisa ser feito?
- Qual é o resultado esperado ao final?
- O que está explicitamente fora do escopo?
- Existem funcionalidades que podem esperar para uma v2?

### Categoria 2 — Stack e Tecnologia
**Fazer segundo. Define com o quê será feito.**

Perguntas exemplo:
- Quais tecnologias/frameworks você prefere?
- Existem restrições técnicas (versão, compatibilidade)?
- Há integrações com APIs externas necessárias?
- Há bibliotecas específicas que devem ser usadas ou evitadas?

### Categoria 3 — Usuários e Permissões
**Fazer terceiro. Define para quem será feito.**

Perguntas exemplo:
- Quem vai usar o sistema?
- Há múltiplos tipos/papéis de usuário?
- Quais permissões cada papel tem?
- Precisa de autenticação? Qual método?

### Categoria 4 — Dados e Persistência
**Fazer quarto. Define o que será armazenado.**

Perguntas exemplo:
- Quais dados precisam ser armazenados?
- Há requisitos de performance para leitura/escrita?
- Precisa de banco de dados específico?
- Há dados sensíveis que precisam de criptografia?

### Categoria 5 — Infraestrutura e Deploy
**Fazer por último. Define onde vai rodar.**

Perguntas exemplo:
- Onde será hospedado?
- Precisa de CI/CD automatizado?
- Há orçamento para serviços pagos?
- Precisa de monitoramento e alertas?

## Regras de Aplicação

1. **Máximo 3-4 perguntas por categoria por rodada**
2. **Tarefas simples**: pular categorias 4 e 5 na primeira rodada
3. **Sempre apresentar uma categoria por vez** — nunca misturar
4. **Confirmar entendimento** antes de passar para a próxima categoria
5. **Usar linguagem clara** — não técnica quando o usuário não for técnico

## Formato de Apresentação

```markdown
## 📋 Categoria 1 de 5: Escopo e Objetivo

Antes de começar, preciso entender melhor o que você quer:

1. [Pergunta 1]
2. [Pergunta 2]
3. [Pergunta 3]

Por favor, responda e eu passarei para a próxima categoria.
```

## Output Esperado

- Perguntas organizadas por categoria
- Uma categoria apresentada por vez
- Entendimento confirmado antes de prosseguir
- Plano de ação baseado nas respostas de todas as categorias