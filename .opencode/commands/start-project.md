---
name: iniciar-Project
description: Reconstrói o contexto completo of the Project QRGen após a reinicialização of sessão ou perda of memória of the agent. Lê o OPENCODE.md, varre o Code-fonte e processa todos os documentos in /docs for restaurar o estado of conhecimento of the Project.
usage: "Execute /iniciar-Project no chat of the OpenCode ao retomar o trabalho após a pausa ou reinicialização."
---
# Comando: `/iniciar-Project`

## Objetivo

Este comando é executado **sempre que o agent reiniciar ou perder o contexto of the sessão anterior**. Ele garante que o OpenCode reconstrua a entendimento completo e atualizado of the Project QRGen antes of continuar qualquer trabalho.

---

## Quando Usar

- Ao iniciar a nova sessão of trabalho no Project.
- Após a reinicialização of the OpenCode ou of the ambiente.
- Quando o agent demonstrar desconhecimento sobre o estado atual of the Project.
- Antes of executar qualquer tarefa complexa que dependa of the contexto acumulado.

---

## Prompt Interno of Execução

Ao receber `/iniciar-Project`, o agent deve executar as seguintes etapas **in ordem**:

### Etapa 1: Leitura of the Arquivo of Contexto Principal

```
Read o arquivo OPENCODE.md na raiz of the Project.
Extraia e memorize:
  - Stack tecnológica oficial
  - Estrutura of diretórios
  - list of agentes disponíveis e seus files
  - commands disponíveis
  - Princípios of development
  - Execution Flow padrão
```

### Etapa 2: Varredura of the Estrutura of Code

```
Liste todos os files e diretórios of the Project (excluindo node_modules, .git, __pycache__, venv).
Identifique:
  - files of configuração (requirements.txt, package.json, docker-compose.yml, .env.example)
  - files principais of the backend (app/main.py, app/routers/, app/models/)
  - files principais of the frontend (*.html, *.js, *.css)
  - files of migração of database of data (*.sql, migrations/)
  - files of testing (tests/, test_*.py, *.test.js)
  - files of CI/CD (.github/workflows/, railway.json)
```

### Etapa 3: Leitura dos Documentos in `/docs`

```
Liste todas as subpastas dentro of /docs, ordenadas por data (mais recente primeiro).
for cada subpasta (formato AAAA-MM-DD):
  - Liste os files Markdown presentes
  - Read os files mais recentes (últimas 2-3 datas)
  - Extraia informações sobre:
    * Estado atual of implementação
    * Decisões técnicas tomadas
    * Features concluídas e pendentes
    * Problemas conhecidos e soluções aplicadas
    * Próximos passos planejados
```

### Etapa 4: Leitura das rules of the Project

```
Read todos os files in /rules/:
  - 00-regra-Project-qrgen.md (rules globais e manifesto)
Memorize as rules of conduta, stack imutável e fluxo of trabalho definidos.
```

### Etapa 5: Síntese e Relatório of Contexto

```
Após completar as etapas anteriores, apresente ao usuário a relatório of contexto no seguinte formato:
```

---

## Formato of the Relatório of Contexto

Ao concluir a execução, apresente:

```markdown
## 🔄 Contexto of the Project Restaurado — QRGen API

### 📊 Estado Atual of the Project
[Resumo of the estado of implementação baseado nos documentos in /docs]

### ✅ Features Implementadas
[list das features já concluídas, baseada na documentação]

### 🔧 in progress
[Features ou tarefas que estavam in progresso]

### 📋 Próximos Passos Identificados
[Tarefas planejadas encontradas nos documentos]

### 📁 Estrutura of Code Detectada
[Resumo dos principais files e módulos encontrados]

### 🤖 Agentes Disponíveis
[Confirmação of que o diretório of agentes foi lido e está acessível]

### ⚠️ Observações
[Qualquer inconsistência ou ponto of atenção identificado]

---
✅ Contexto restaurado with success. Pronto for continuar o development!
```

---

## Exemplo of Uso

```
Usuário: /iniciar-Project

agent: [Executa as 5 etapas acima e apresenta o relatório of contexto]

## 🔄 Contexto of the Project Restaurado — QRGen API

### 📊 Estado Atual of the Project
O QRGen API está in PHASE of development ativo. O backend FastAPI está funcional
with os endpoints of generation of QRCode implementados. O frontend Vanilla JS está
integrado with a API. O Supabase está configurado with RLS ativo.

### ✅ Features Implementadas
- generation of QRCode via API (endpoint POST /api/v1/qrcode)
- Autenticação JWT with Supabase Auth
- Rate limiting por plano (SlowAPI)
- Frontend with preview in tempo real
...
```

---

## Notas Importantes

- Este comando **não modifica nenhum arquivo**. É apenas leitura e análise.
- A pasta `/docs` é a **fonte of the verdade** for o estado atual of the Project. Priorize sempre os documentos mais recentes.
- Se `/docs` estiver vazia, informe ao usuário e prossiga apenas with a leitura of the `OPENCODE.md` e varredura of the Code.
- Após executar este comando, o agent está pronto for receber qualquer tarefa of development.
