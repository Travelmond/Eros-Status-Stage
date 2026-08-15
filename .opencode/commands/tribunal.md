---
description: "Ativa o Tribunal para auditoria suprema. O Tribunal analisa dados crus sem contexto do projeto e emite veredito final sobre alucinações e eficácia."
agent: tribunal

subtask: true
---

Ative a skill `gerar-relatorio-evolutivo` e execute a auditoria suprema do sistema.

## $ARGUMENTS

O usuário pode fornecer um escopo de auditoria. Se vazio, auditar a última execução completa.

## Pré-Requisitos

1. Verificar se há relatórios do Juiz em `/docs/audit/`
2. Se não houver, informar: "Não há dados para auditar. Execute uma tarefa primeiro."
3. Se houver, prosseguir com a auditoria

## Fluxo de Trabalho — /tribunal

### Passo 1: Coleta de Dados Crus

1. Ler o relatório mais recente do Juiz em `/docs/audit/`
2. Extrair apenas dados estruturais (sem narrativa de contexto):
   - Logs de execução (sequência de agentes ativados)
   - Diffs de código (antes vs. depois)
   - Métricas (tokens, tempo, iterações)
   - Relatórios de erro e alucinação
   - Relatórios da Equipe de Revisão
3. **NÃO incluir** contexto do projeto, manifesto, ou objetivos

### Passo 2: Ativação dos 5 Sub-Agentes

Distribuir dados crus em paralelo:

```
@tribunal-01 → "Analise semântica e lógica dos logs"
@tribunal-02 → "Analise consistência estatística"
@tribunal-03 → "Detecte vieses sistemáticos"
@tribunal-04 → "Avalie simplicidade de raciocínio"
@tribunal-05 → "Verifique conformidade com governança"
```

### Passo 3: Consolidação do Veredito

1. Coletar os 5 relatórios parciais
2. Compilar em um **Veredito Consolidado**
3. Classificar findings por severidade
4. Emitir veredito final:
   - ✅ **ACEITÁVEL** — Mudanças são melhorias reais
   - ❌ **INACEITÁVEL** — Mudanças pioraram o sistema
   - ⚖️ **NECESSITA APELAÇÃO** — Há dúvida, Orquestrador pode se defender

### Passo 4: Geração do Relatório Evolutivo

Ativar skill `gerar-relatorio-evolutivo`:
- Diagramas Mermaid (Antes vs. Depois)
- Tabela comparativa de métricas
- Justificativa visual das mudanças
- Pergunta ao usuário: "Deseja prosseguir com esta mudança?"

### Passo 5: Salvamento

Criar pasta datada:
```
/docs/audit/tribunal/YYYY-MM-DD_HH-MM/
├── veredito.md
├── tribunal-01.md
├── tribunal-02.md
├── tribunal-03.md
├── tribunal-04.md
├── tribunal-05.md
├── comparativo.md
└── relatorio-evolutivo.md
```

### Passo 6: Apresentação ao Usuário

```markdown
## ⚖️ Veredito do Tribunal

### Veredito Consolidado
[ACEITÁVEL | INACEITÁVEL | NECESSITA APELAÇÃO]

### Findings por Severidade
- 🔴 Críticos: N
- 🟠 Altos: N
- 🟡 Médios: N
- 🟢 Baixos: N

### Resumo dos Sub-Agentes
| Tribunal | Especialidade | Veredito Parcial |
|---|---|---|
| 01 | Semântica e Lógica | [veredito] |
| 02 | Consistência Estatística | [veredito] |
| 03 | Detecção de Vieses | [veredito] |
| 04 | Simplicidade | [veredito] |
| 05 | Governança | [veredito] |

### Relatório Evolutivo
[Mermaid diagram e tabela comparativa]

### Próximos Passos
- Se ACEITÁVEL: Prosseguir com a mudança
- Se INACEITÁVEL: Orquestrador pode apresentar justificativa técnica (via Juiz)
- Se NECESSITA APELAÇÃO: Aguardar defesa do Orquestrador
```

## Protocolo de Apelação

Se o veredito for **INACEITÁVEL** ou **NECESSITA APELAÇÃO**:

1. Perguntar ao usuário: "Deseja permitir que o Orquestrador apresente justificativa técnica?"
2. Se sim:
   - Orquestrador prepara justificativa
   - Juiz traduz para linguagem lógica
   - Tribunal reavalia
   - Se mantiver INACEITÁVEL pela 2ª vez → **BLOQUEIO FINAL**
   - Solicitar intervenção humana
3. Se não:
   - Rollback automático
   - Registrar bloqueio em `/docs/audit/tribunal/`

## Regras

- **NUNCA aceite contexto do projeto** — Dados crus apenas
- **NUNCA fale com o Orquestrador diretamente** — Apenas via Juiz
- **SEMPRE gere relatório evolutivo visual** — Mermaid + tabela
- **SEMPRE apresente a pergunta de prosseguimento ao usuário**
- **SEMPRE salve em `/docs/audit/tribunal/`**
- **Após veredito, retornar ao estado dormente**