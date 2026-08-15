---
name: equipe-revisao
description: "Audita cada mudança de código antes de torná-la parte definitiva do projeto. Skill bloqueante — 5 revisores em paralelo (critico, critico-usuario, testador, auditor-seguranca, otimizador). Use OBRIGATORIAMENTE após qualquer implementação de código."
license: MIT

compatibility: opencode

---
# Skill: equipe-revisao

## Objetivo

Auditar cada mudança de código antes de torná-la parte definitiva do projeto. Esta skill é **bloqueante** — se qualquer revisor reprovar, o código não entra e o loop de correção é iniciado.

## Quando Ativar

**OBRIGATORIAMENTE** após qualquer implementação de código, seja:
- Nova feature (frontend, backend, banco de dados, API, MCP)
- Correção de bug
- Refatoração
- Alteração de contrato

Não existe implementação sem revisão. Esta skill é a fronteira que o código precisa cruzar.

## Entradas Necessárias

1. **Arquivos modificados** — Lista de arquivos alterados
2. **`manifesto_de_intencao.md`** — O manifesto da tarefa atual (critério de fidelidade)
3. **Especificação técnica** — O contrato gerado pelo `tradutor-tiers`

## A Equipe (Execução em Paralelo)

### 1. Crítico-Usuário (Fidelidade ao Manifesto)
- **Input**: `manifesto_de_intencao.md` + código implementado
- **Foco**: A implementação reflete o sentimento e propósito do manifesto?
- **Verifica**: Textos, fluxos, labels, tom da interface, jornada do usuário
- **Pergunta-chave**: "Se o usuário original lesse isto, reconheceria sua intenção?"

### 2. Crítico (Qualidade Técnica)
- **Input**: Código implementado + especificação técnica
- **Foco**: O código segue boas práticas, padrões e regras de negócio?
- **Verifica**: Lógica, estrutura, consistência, aderência ao contrato
- **Pergunta-chave**: "O código cumpre todos os critérios de aceitação?"

### 3. Testador (Validação Funcional)
- **Input**: Código implementado + casos de teste
- **Foco**: O código funciona e não quebrou o que existia?
- **Verifica**: Testes unitários, integração, regressão
- **Pergunta-chave**: "Os testes passam e cobrem os cenários críticos?"

### 4. Auditor-Segurança (Blindagem)
- **Input**: Código implementado
- **Foco**: A implementação abriu vulnerabilidades?
- **Verifica**: SQL injection, XSS, CSRF, auth, authz, input validation
- **Pergunta-chave**: "Esta mudança é segura para produção?"

### 5. Otimizador (Performance)
- **Input**: Código implementado
- **Foco**: A implementação degradou performance?
- **Verifica**: Queries, bundle size, gargalos, complexidade
- **Pergunta-chave**: "Esta mudança mantém ou melhora a performance?"

## Protocolo de Veredito

### Passo 1: Ativação Paralela
Disparar todos os 5 revisores simultaneamente. Cada um recebe seu input específico.

### Passo 2: Consolidação
Coletar os 5 relatórios. Classificar findings por severidade:
- 🔴 Crítico — Bloqueia merge
- 🟠 Alto — Bloqueia merge
- 🟡 Médio — Permite merge com aviso
- 🟢 Baixo — Apenas registro

### Passo 3: Tomada de Decisão

| Cenário | Ação |
|---|---|
| Todos os 5 aprovam | ✅ **Aprovado** — Código entra |
| Qualquer um reprova (🔴 ou 🟠) | ❌ **Reprovado** — Retorna ao Tier 3 com lista de correções |
| Apenas 🟡 ou 🟢 | ⚠️ **Aprovado com ressalvas** — Registra avisos |

### Passo 4: Loop de Correção (se reprovado)
1. Consolidar todas as correções solicitadas
2. Retornar ao desenvolvedor (Tier 3) com lista unificada
3. Desenvolvedor corrige
4. Reativar skill `equipe-revisao` completa
5. **Contador de iterações**: O Juiz monitora quantas vezes o loop ocorre

### Passo 5: Escalação ao Juiz (3ª iteração)
Se o loop de correção atingir a **3ª iteração** sem aprovação:
1. A skill dispara alerta ao Juiz
2. O Juiz avalia se há padrão de alucinação
3. Se confirmado, o Juiz ativa o **Tribunal**
4. O Tribunal audita e emite veredito

### Passo 6: Sincronização
Após aprovação final:
1. Ativar skill `sync-context`
2. Atualizar `tarefas.md` (mover para "Concluídas")
3. Atualizar `implementacao.md` (mudar fase)
4. Gerar relatório em `/docs/testing/revisao-YYYY-MM-DD_HH-MM.md`

## Saída

```markdown
# Relatório de Revisão — YYYY-MM-DD HH:MM

## Tarefa
[Nome da tarefa]

## Manifesto de Referência
[Link para manifesto_de_intencao.md]

## Vereditos

| Revisor | Veredito | Findings | Severidade |
|---|---|---|---|
| Crítico-Usuário | [✅/❌] | N | [nível] |
| Crítico | [✅/❌] | N | [nível] |
| Testador | [✅/❌] | N | [nível] |
| Auditor-Segurança | [✅/❌] | N | [nível] |
| Otimizador | [✅/❌] | N | [nível] |

## Veredito Consolidado
[APROVADO | REPROVADO | APROVADO COM RESSALVAS]

## Iteração
[Número do loop de correção — se ≥3, alertar Juiz]

## Próximos Passos
- [Ação conforme veredito]
```

## Regras

- **SEMPRE ative em paralelo** — Os 5 revisores rodam simultaneamente
- **NUNCA approve sem os 5 vereditos** — Falta de um revisor bloqueia
- **SEMPRE consulte o manifesto** — A fidelidade à intenção é inegociável
- **SEMPRE registre a iteração** — O contador é vital para o Juiz
- **SEMPRE dispare alerta ao Juiz na 3ª iteração** — Sem exceções
- **NUNCA pule esta skill** — Toda implementação passa por aqui
