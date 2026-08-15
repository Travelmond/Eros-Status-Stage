---
description: "Ativa o Juiz para gerar um relatório de avaliação do sistema. O Juiz analisa desempenho, tokens, alucinações e propõe melhorias."
agent: juiz

subtask: true
---

Ative a skill `avaliar-sistema` e execute uma avaliação completa do sistema.

## Processo

1. **Ativar skill `avaliar-sistema`**

2. **Criar pasta datada**
   - `/docs/audit/YYYY-MM-DD_HH-MM/`

3. **Coletar dados da última execução**
   - Qual comando foi executado
   - Quais agentes foram ativados
   - Quantos tokens foram gastos (estimativa)
   - Quais erros ocorreram
   - Quais alucinações foram detectadas

4. **Avaliar 6 dimensões:**
   - Eficácia dos agentes
   - Gasto de tokens
   - Inferência e acertos
   - Erros e alucinações
   - Fluxo de trabalho
   - Economia de tokens

5. **Buscar soluções (se aplicável)**
   - Ativar `@pesquisador` para buscar melhores práticas

6. **Gerar 5 relatórios na pasta datada:**
   - `relatorio.md` — Relatório principal consolidado
   - `analise-tokens.md` — Análise de gasto de tokens
   - `alucinacoes.md` — Alucinações detectadas
   - `fluxo-trabalho.md` — Avaliação do fluxo
   - `melhorias.md` — Soluções e recomendações

7. **Verificar contador de iterações da `equipe-revisao`:**
   - Se houver loop de revisão em andamento, registrar o número da iteração
   - Se estiver na 3ª iteração sem aprovação:
     - **INTERROMPER o fluxo do Orquestrador**
     - **ATIVAR `@tribunal`** com dados crus (sem contexto do projeto)
     - Aguardar veredito do Tribunal
   - Se o Tribunal emitir veredito INACEITÁVEL:
     - Comunicar ao Orquestrador
     - Se houver justificativa técnica, traduzir para o Tribunal
     - Aguardar reavaliação
   - Se mantido na 2ª vez → BLOQUEIO FINAL → solicitar intervenção humana

8. **Gerar dados crus para o Tribunal (se aplicável):**
   - Extrair dos relatórios apenas dados estruturais:
     - Logs de execução (sequência de agentes, sem narrativa)
     - Diffs de código (antes vs. depois)
     - Métricas (tokens, tempo, iterações)
     - Relatórios de erro e alucinação
   - **NUNCA incluir**: manifesto, objetivos, contexto do projeto, narrativa
   - Salvar em `/docs/audit/dados-crus-tribunal.md`

9. **Comunicar resumo ao usuário:**
   - Total de problemas
   - Tokens desperdiçados
   - Top 3 soluções propostas
   - Status do Tribunal (se ativado)

10. **Se o usuário aceitar uma solução:**
    - Orquestrador invoca `@agente-de-intencao` (para revisar/atualizar manifesto)
    - Orquestrador invoca `@planejador-primario`
    - Planejador faz perguntas categorizadas sobre a melhoria
    - Plano é criado e aprovado
    - Skill `tradutor-tiers` gera contratos de execução
    - `@arquiteto-geral` implementa
    - Skill `equipe-revisao` revisa (obrigatório e bloqueante)