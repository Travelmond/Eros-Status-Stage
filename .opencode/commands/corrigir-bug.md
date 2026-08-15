---
description: "Corrige bugs via RCA, testes de regressão e revisão paralela Tier 4. O coordenador-revisao orquestra diagnóstico, pesquisa, implementação e validação."
agent: coordenador-revisao
subtask: true
---

Ative a skill `loop-revisao` e execute o fluxo de correção de bugs abaixo.

## $ARGUMENTS

O usuário deve fornecer a descrição do bug. Se vazio, pergunte: "Descreva o bug: o que aconteceu, onde e o que você esperava?"

## Fluxo de Trabalho — /corrigir-bug

### Passo 1: Diagnóstico (Root Cause Analysis — RCA)

1. Receber a descrição do bug do usuário
2. Invocar `@critico` para localizar a falha no código
3. Classificar a causa raiz em um dos 4 pilares:
   - **Lógica** — Erro em regra de negócio ou fluxo de dados
   - **Arquitetura** — Violação de camadas, acoplamento, contrato quebrado
   - **Dependência** — API externa, biblioteca, configuração de ambiente
   - **Regressão** — Código que funcionava e parou após mudança recente
4. Documentar a classificação no relatório

### Passo 2: Contextualização (Anti-Alucinação + Manifesto)

1. **Ler `manifesto_de_intencao.md`** em `/docs/management/`:
   - Identificar qual objetivo humano foi violado pelo bug
   - Extrair o "critério de fidelidade" do manifesto
   - Usar o manifesto como referência para a correção (o bug é uma quebra da intenção original)
2. Verificar `/docs/audit/` — ler o `alucinacoes.md` mais recente
3. Verificar se há padrões de alucinação conhecidos para a área do bug
4. Se houver padrão registrado, alertar o desenvolvedor responsável

### Passo 3: Pesquisa (se bug complexo ou dependência externa)

1. Se a causa for classificada como **Dependência** ou **Arquitetura**:
   - Invocar `@pesquisador` para buscar soluções similares na web
   - Validar solução com fontes oficiais
2. Se a causa for **Lógica** ou **Regressão**:
   - Pular pesquisa — ir direto para planejamento de correção

### Passo 4: Planejamento de Correção

1. Invocar `@arquiteto-geral` com:
   - Descrição do bug
   - Classificação RCA
   - Solução pesquisada (se aplicável)
   - Padrões de alucinação identificados
2. `@arquiteto-geral` valida a solução e delega para o arquiteto da área:
   - Bug de frontend → `@arquiteto-ui-ux` → `@dev-frontend`
   - Bug de backend → `@arquiteto-backend` → `@dev-backend`
   - Bug de banco → `@arquiteto-banco-de-dados` → `@dev-banco-de-dados`

### Passo 5: Teste de Regressão Obrigatório

1. Antes da correção, `@testador` cria um caso de teste que:
   - Reproduz o bug exatamente (deve FALHAR no estado atual)
   - Valida o comportamento esperado (deve PASSAR após correção)
2. O teste é registrado em `/docs/testing/`

### Passo 6: Implementação da Correção

1. O desenvolvedor responsável (Tier 3) aplica a correção
2. O desenvolvedor executa a skill `sync-context` ao concluir

### Passo 7: Revisão Obrigatória (skill `equipe-revisao`)

1. **Ativar skill `equipe-revisao`** — Substitui o `@coordenador-revisao` manual
2. A skill dispara revisão paralela com 5 revisores:
   - `@critico-usuario` — valida fidelidade ao `manifesto_de_intencao.md` (a correção restaura a intenção original?)
   - `@critico` — valida que a correção resolve o bug tecnicamente
   - `@testador` — executa o teste de regressão (DEVE passar agora)
   - `@auditor-seguranca` — verifica se a correção não abriu vulnerabilidade
   - `@otimizador` — verifica se a correção não degradou performance
3. **Veredito bloqueante:**
   - Todos aprovam → ✅ Prosseguir
   - Qualquer um reprova → ❌ Retornar ao desenvolvedor com lista de correções
   - Apenas 🟡/🟢 → ⚠️ Aprovado com ressalvas (registrar avisos)
4. **Loop de correção:**
   - Se reprovado, desenvolvedor corrige
   - Reativar skill `equipe-revisao` completa
   - **Contador de iterações monitorado pelo Juiz**
   - Se 3ª iteração sem aprovação → **Juiz ativa o Tribunal**

### Passo 8: Verificação de Contratos

1. Verificar se a correção alterou algum "contrato":
   - Formato de API (JSON structure, endpoints)
   - Schema de banco de dados
   - Interface de componente (props, eventos)
2. Se houve alteração de contrato:
   - Invocar `@documentacao` para atualizar `/docs/architecture/`
   - Invocar `@documentacao` para atualizar `/docs/design/` (se UI)
3. Se não houve alteração de contrato:
   - Pular documentação

### Passo 9: Sincronização de Contexto

1. Ativar skill `sync-context`
2. Atualizar `tarefas.md`:
   - Mover tarefa de bug para "Concluídas"
   - Adicionar nota sobre a classificação RCA
3. Atualizar `implementacao.md`:
   - Adicionar decisão sobre a correção
   - Atualizar "Próximos Passos" se necessário

### Passo 10: Relatório Final ao Usuário

```markdown
## 🐛 Bug Corrigido

### Diagnóstico (RCA)
- **Causa raiz**: [Lógica | Arquitetura | Dependência | Regressão]
- **Descrição**: [resumo da causa]

### Correção
- **Arquivo alterado**: `arquivo.ext:linha`
- **O que foi feito**: [resumo da correção]
- **Desenvolvedor**: @dev-*

### Validação
- ✅ Teste de regressão: PASSOU
- ✅ @critico: Aprovado
- ✅ @critico-usuario: Aprovado
- ✅ @auditor-seguranca: Aprovado
- ✅ @otimizador: Aprovado

### Contratos
- [ ] Sem alteração de contrato
- [x] Contrato alterado — documentação atualizada em /docs/architecture/

### Contexto
- `/docs/management/tarefas.md` atualizado
- `/docs/management/implementacao.md` atualizado
```

## Regras

- **NUNCA pule o Teste de Regressão** — é obrigatório
- **NUNCA pule a RCA** — classificar a causa raiz antes de corrigir
- **SEMPRE verifique alucinações** anteriores na mesma área
- **SEMPRE ative skill `sync-context`** ao concluir
- **SEMPRE verifique alterações de contrato** e atualize documentação
- **SEMPRE ative `@juiz` em paralelo** para observar a correção