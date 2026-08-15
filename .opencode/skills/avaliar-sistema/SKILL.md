---
name: avaliar-sistema
description: "Skill do Juiz para avaliar desempenho dos agentes, gasto de tokens, alucinações e eficácia do fluxo. Cria relatórios datados em /docs/audit/."
license: MIT

compatibility: opencode

---

# Skill: Avaliar Sistema

## Objetivo

Instruir o Juiz sobre como avaliar o funcionamento do sistema de agentes, criar relatórios estruturados e propor melhorias.

## Quando Usar

- Sempre que o Juiz é ativado (automaticamente ou via `/juiz`)
- Ao final de cada comando executado
- Quando um agente detecta anomalia e pede avaliação

## Processo

### Passo 1: Criar Pasta Datada

```
/docs/audit/YYYY-MM-DD_HH-MM/
```

Exemplo: `/docs/audit/2026-06-30_14-30/`

### Passo 2: Coletar Dados da Execução

Registrar:
- Comando executado
- Agentes ativados (em ordem)
- Duração de cada agente
- Tokens estimados por agente
- Skills utilizadas
- Erros encontrados
- Interações entre agentes

### Passo 3: Avaliar 6 Dimensões

#### Dimensão 1 — Eficácia dos Agentes
- Agente certo para a tarefa?
- Hierarquia respeitada?
- Missão cumprida sem extrapolar?

#### Dimensão 2 — Gasto de Tokens
- Quem consumiu mais?
- Houve redundância?
- Contexto bem gerenciado?
- Skills reduziram gasto?

#### Dimensão 3 — Inferência e Acertos
- Inferências corretas?
- Perguntas desnecessárias?
- Contratos alinhados?
- Críticos encontraram problemas reais?

#### Dimensão 4 — Erros e Alucinações
- Onde houve alucinação?
- Qual agente alucinou?
- Tipo e frequência?
- Severidade?

#### Dimensão 5 — Fluxo de Trabalho
- Sequência lógica?
- Gargalos?
- Loop de revisão eficiente?
- Comandos no momento certo?

#### Dimensão 6 — Economia de Tokens
- Otimizações possíveis?
- Skills melhor usáveis?
- Contexto mais enxuto?
- Agentes fundíveis?

### Passo 4: Buscar Soluções (se aplicável)

Ativar `@pesquisador` para:
- Melhores práticas do OpenCode
- Soluções para alucinações recorrentes
- Otimizações de prompt/temperatura
- Padrões de orquestração eficientes

### Passo 5: Gerar Relatórios

Criar na pasta datada:

```
/docs/audit/YYYY-MM-DD_HH-MM/
├── relatorio.md          # Relatório principal consolidado
├── analise-tokens.md     # Análise detalhada de tokens
├── alucinacoes.md        # Lista de alucinações detectadas
├── fluxo-trabalho.md     # Avaliação do fluxo
└── melhorias.md          # Soluções e recomendações
```

### Passo 6: Comunicar ao Orquestrador

Resumo executivo:
- Total de problemas: X
- Críticos: X | Altos: X | Médios: X | Baixos: X
- Tokens desperdiçados: X
- Top 3 soluções propostas

### Passo 7: Se usuário aceitar soluções

- Orquestrador invoca `@planejador-primario`
- Planejador faz perguntas categorizadas sobre a melhoria
- Plano é criado e aprovado
- `@arquiteto-geral` implementa a melhoria
- `@coordenador-revisao` revisa
- Juiz reavalia na próxima rodada

## Output Esperado

- Pasta datada criada em `/docs/audit/`
- 5 arquivos de relatório gerados
- Resumo comunicado ao Orquestrador
- Soluções acionáveis propostas
- Fluxo de melhoria acionado se aceito