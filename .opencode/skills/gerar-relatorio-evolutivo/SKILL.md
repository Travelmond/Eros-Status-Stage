---
name: gerar-relatorio-evolutivo
description: "Cria representação visual clara das evoluções de código/arquitetura com diagramas Mermaid e tabelas comparativas (Antes vs. Depois). Use quando o Tribunal emitir um veredito ou quando o usuário solicitar comparativo visual."
license: MIT

compatibility: opencode

---
# Skill: gerar-relatorio-evolutivo

## Objetivo

Criar uma representação visual clara das evoluções de código/arquitetura, facilitando a decisão do usuário sobre aprovar ou rejeitar uma mudança. Esta skill é ativada pelo Tribunal ao emitir seu veredito.

## Quando Ativar

- Após o Tribunal emitir um veredito
- Quando o usuário solicitar um comparativo visual
- Ao final do loop Juiz-Orquestrador, antes do veredito final

## Entradas Necessárias

1. **Estado Anterior** — Código/diagrama antes da mudança
2. **Estado Posterior** — Código/diagrama após a mudança
3. **Manifesto de Intenção** — O propósito original da mudança
4. **Métricas do Juiz** — Tokens, tempo, iterações
5. **Veredito do Tribunal** — Findings dos 5 sub-agentes

## Protocolo de Geração

### Passo 1: Identificação da Mudança

Extrair do diff ou log de implementação:
- O que existia antes (estado, código, estrutura)
- O que existe agora (estado, código, estrutura)
- O que mudou (lista de alterações)

### Passo 2: Seleção do Gráfico Mermaid

Escolher o tipo de diagrama mais adequado para representar a mudança:

| Tipo de Mudança | Diagrama Mermaid | Quando Usar |
|---|---|---|
| Lógica de fluxo alterada | `sequenceDiagram` | Quando o fluxo de execução mudou |
| Estrutura de componentes | `classDiagram` | Quando classes/módulos foram adicionados/removidos |
| Fluxo de dados/processos | `flowchart LR` | Quando o pipeline de dados mudou |
| Evolução de estados | `stateDiagram-v2` | Quando máquinas de estado mudaram |
| Modelo de dados | `erDiagram` | Quando schema de banco mudou |
| Jornada do usuário | `journey` | Quando a UX mudou |
| Timeline de execução | `gantt` | Quando o processo teve fases temporais |
| Distribuição de tokens | `pie` | Quando queremos mostrar custo |
| Mapa mental de impacto | `mindmap` | Quando a mudança afeta múltiplas áreas |
| Relacionamentos | `graph TD` | Quando queremos mostrar dependências |

### Passo 3: Estrutura do Relatório

```markdown
# 📊 Relatório Evolutivo — [Nome da Tarefa]

## Data
[YYYY-MM-DD HH:MM]

## O Espelho da Narrativa

### O que o humano queria
[Citação do manifesto_de_intencao.md — preservando tom original]

### O que foi entregue
[Resumo técnico do que foi feito]

### A intenção foi preservada?
[Análise de fidelidade baseada no critério do manifesto]

---

## Representação Visual

### Antes
[Diagrama Mermaid do estado anterior]

### Depois
[Diagrama Mermaid do estado posterior]

### O que mudou
[Diagrama Mermaid destacando as diferenças — usar cores/nodes diferentes]

---

## Análise Técnica Comparativa

| Métrica | Antes | Depois | Variação |
|---|---|---|---|
| Complexidade (nº de linhas) | X | Y | ±Z% |
| Tokens gastos | X | Y | ±Z% |
| Tempo de execução | Xs | Ys | ±Z% |
| Iterações de revisão | X | Y | ±Z% |
| Vulnerabilidades | X | Y | ±Z% |
| Cobertura de testes | X% | Y% | ±Z% |
| Fidelidade ao manifesto | — | Y% | — |

---

## Veredito do Tribunal

### Veredito Consolidado
[ACEITÁVEL | INACEITÁVEL | NECESSITA APELAÇÃO]

### Findings dos Sub-Agentes

| Tribunal | Especialidade | Findings | Severidade Máxima |
|---|---|---|---|
| 01 | Semântica e Lógica | N | [nível] |
| 02 | Consistência Estatística | N | [nível] |
| 03 | Detecção de Vieses | N | [nível] |
| 04 | Simplicidade | N | [nível] |
| 05 | Governança | N | [nível] |

### Justificativa do Veredito
[Texto explicando por que o Tribunal chegou a esta conclusão]

---

## Histórico de Iterações

| Iteração | Ação | Resultado | Tokens |
|---|---|---|---|
| 1 | [descrição] | [resultado] | X |
| 2 | [descrição] | [resultado] | X |
| 3 | [descrição] | [resultado] | X |

---

## Pergunta ao Usuário

> Deseja prosseguir com esta mudança?
> 
> - ✅ **Sim** — Aceitar e manter as alterações
> - ❌ **Não** — Reverter (rollback) para o estado anterior
> - ⚖️ **Apelação** — Permitir que o Orquestrador apresente justificativa técnica
```

## Regras

- **SEMPRE use formato Markdown** — Legibilidade é prioridade
- **SEMPRE inclua o "Espelho da Narrativa"** — O manifesto é a referência
- **SEMPRE inclua diagramas Antes e Depois** — A comparação visual é essencial
- **SEMPRE faça a pergunta de prosseguimento** — O usuário decide
- **Mantenha diagramas simplificados** — Máximo 10-15 nós para legibilidade
- **NUNCA omita métricas negativas** — Se piorou, mostre
- **Use todos os tipos de Mermaid quando aplicável** — Escolha o mais expressivo
- **SEMPRE salve em `/docs/audit/tribunal/YYYY-MM-DD_HH-MM/relatorio-evolutivo.md`**

## Referência de Sintaxe Mermaid

Consultar: https://mermaid.ai/open-source/intro/syntax-reference.html

Tipos disponíveis:
- `flowchart` / `graph` — Fluxogramas
- `sequenceDiagram` — Sequências
- `classDiagram` — Classes
- `stateDiagram` / `stateDiagram-v2` — Estados
- `erDiagram` — Entidade-relacionamento
- `gantt` — Gantt
- `pie` — Gráficos de pizza
- `journey` — Jornada do usuário
- `mindmap` — Mapas mentais
- `gitGraph` — Fluxo Git
- `C4Context` / `C4Container` / `C4Component` — Diagramas C4
