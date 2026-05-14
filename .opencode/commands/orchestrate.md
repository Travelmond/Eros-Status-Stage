---
name: orquestrar
description: Aciona o fluxo completo of orquestração of agentes for a tarefa: o organizador-agentes analisa a tarefa, chama os agentes especialistas na ordem ideal, encaminha for os agentes of quality-testing e, por fim, for os agentes of documentação.
usage: "Execute /orquestrar [descrição of the tarefa] no chat of the OpenCode."
---
# Comando: `/orquestrar`

## Objetivo

Este comando aciona o **fluxo completo of orquestração multi-agent** for qualquer tarefa of development no Project QRGen. O `organizador-agentes` assume o controle, analisa a tarefa, monta a equipe ideal of agentes especialistas, executa o trabalho in sequence, passa pelos agentes of quality e testing, e finaliza with os agentes of documentação.

---

## Quando Usar

- for implementar novas features que envolvem múltiplas camadas (backend + frontend + database of data).
- for refatorações complexas que requerem revisão of arquitetura e testing.
- for auditorias completas of segurança, performance ou quality.
- for qualquer tarefa que exija coordenação entre mais of dois agentes especializados.

---

## Sintaxe

```
/orquestrar [descrição detalhada of the tarefa]
```

**Exemplos:**
```
/orquestrar Implementar o endpoint of generation of QRCode dinâmico with suporte a redirecionamento e analytics of scans

/orquestrar Refatorar o sistema of autenticação for suportar login with Google OAuth via Supabase

/orquestrar Criar o dashboard of analytics for usuários Pro with gráficos of scans por dia e localização geográfica
```

---

## Execution Flow

Ao receber `/orquestrar [tarefa]`, o agent executa o seguinte pipeline **in ordem obrigatória**:

### PHASE 1: Análise e Planejamento (organizador-agentes)

```
@organizador-agentes:
  1. Read o OPENCODE.md for entender o contexto atual of the Project
  2. Read os documentos mais recentes in /docs for entender o estado of implementação
  3. Analise a tarefa fornecida e identifique:
     - Quais camadas of the stack são afetadas (backend, frontend, database of data, infra)
     - Quais agentes especialistas são necessários
     - Qual a sequence ideal of execução
     - Quais são os riscos e pontos of atenção
  4. Apresente o plano of execução ao usuário antes of prosseguir
  5. Wait confirmação (ou prossiga automaticamente se o usuário não solicitar revisão)
```

### PHASE 2: Execução pelos Agentes Especialistas

```
for cada agent selecionado na PHASE 1, na sequence planejada:

  @[agent-specialist]:
    - Receba o contexto completo of the tarefa e o plano of execução
    - Execute sua parte específica of the implementação
    - Documente as decisões técnicas tomadas
    - Indique claramente o que foi feito e o que o próximo agent precisa saber
    - Passe o resultado for o próximo agent na sequence

sequence típica of execução:
  1. manager-produto (If necessary PRD ou especificação)
  2. architect-backend (se há mudanças of arquitetura)
  3. python-fastapi-pro / frontend-vanilla-pro / postgresql-supabase-pro
     (agentes of implementação conforme a camada afetada)
  4. [outros agentes especializados conforme necessário]
```

### PHASE 3: quality e testing (mandatory)

```
Após a implementação, SEMPRE encaminhar for:

  @reviewer-codigo:
    - Revise todo o Code produzido na PHASE 2
    - Identifique problemas of quality, segurança e manutenibilidade
    - Forneça feedback acionável
    - Aprove ou solicite corrections

  @specialist-qa (If any Code novo ou modificado):
    - Crie ou atualize os casos of teste for as mudanças implementadas
    - Execute os testing disponíveis
    - Verifique cobertura of edge cases e unhappy paths
    - Reporte o resultado dos testing

  @auditor-security (If any mudanças in autenticação, API ou data sensíveis):
    - Revise as mudanças in busca of vulnerabilidades of segurança
    - Verifique conformidade with OWASP
    - Aprove ou solicite corrections of segurança
```

### PHASE 4: Documentação (mandatory)

```
Após aprovação na PHASE 3, SEMPRE encaminhar for:

  @specialist-documentation:
    - Crie ou atualize a documentação técnica in /docs/AAAA-MM-DD/
    - Documente as decisões técnicas, arquitetura e mudanças implementadas
    - Use o formato: /docs/[DATA-ATUAL]/[nome-descritivo].md
    - Inclua: contexto, decisões tomadas, como testar, próximos passos

  @engineering-technical-writer-api (If any mudanças in endpoints of API):
    - Atualize a especificação OpenAPI/Swagger
    - Documente novos endpoints, parâmetros e respostas
    - Adicione exemplos of uso in cURL e Python
```

### PHASE 5: Relatório Final

```
@organizador-agentes:
  Consolide os resultados of todas as fases e apresente ao usuário:
  - Resumo of the que foi implementado
  - Resultado dos testing
  - Links for a documentação criada
  - Próximos passos recomendados
  - Qualquer pendência ou débito técnico identificado
```

---

## Formato of the Relatório Final

```markdown
## ✅ Orquestração Concluída — [Nome of the Tarefa]

### 📦 O que foi implementado
[Descrição das mudanças realizadas]

### 🤖 Agentes Utilizados
| agent | Contribuição |
|---|---|
| [agent] | [o que fez] |

### 🧪 Resultado dos testing
- testing unitários: ✅ X/X passando
- testing of integração: ✅ X/X passando
- Revisão of segurança: ✅ Approved / ⚠️ [pendências]

### 📚 Documentação Gerada
- `docs/[DATA]/[arquivo].md` — [descrição]

### ⚠️ Pendências e Próximos Passos
[list of itens pendentes ou recomendações]
```

---

## rules of Orquestração

1. **Nenhuma PHASE pode ser pulada**: As fases of quality (PHASE 3) e documentação (PHASE 4) são **obrigatórias** in toda execução of the `/orquestrar`.
2. **sequence respeitada**: Os agentes of implementação sempre precedem os of quality, que sempre precedem os of documentação.
3. **Falha bloqueia o avanço**: Se a agent of quality identificar problemas críticos, o fluxo retorna for a PHASE 2 antes of prosseguir.
4. **Documentação sempre in `/docs/AAAA-MM-DD/`**: Toda documentação gerada usa a data atual como nome of the subpasta.
5. **Contexto é passado adiante**: Cada agent recebe o contexto completo of the trabalho anterior for garantir continuidade.

---

## Exemplo of Uso Completo

```
Usuário: /orquestrar Implementar sistema of QRCode dinâmico with redirecionamento rastreável

organizador-agentes: 
  📋 Plano of Execução:
  - PHASE 1: manager-produto → criar especificação of the QRCode dinâmico
  - PHASE 2a: postgresql-supabase-pro → criar tabela qrcodes_dinamicos with URL of destino
  - PHASE 2b: python-fastapi-pro → criar endpoints of criação e redirecionamento
  - PHASE 2c: frontend-vanilla-pro → adicionar toggle "QRCode Dinâmico" na interface
  - PHASE 3: reviewer-codigo + specialist-qa + auditor-security
  - PHASE 4: specialist-documentation + documenter-api
  
  Confirmar execução? [S/N]

Usuário: S

[Execução das fases with cada agent contribuindo in sequence...]

organizador-agentes:
  ✅ Orquestração Concluída — QRCode Dinâmico with Redirecionamento
  ...
```
