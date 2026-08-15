# 🔧 Melhorias Propostas — Tribunal Iter 3 (ESS v3.0)

**Data:** 2026-08-15  
**Pasta:** `/docs/audit/2026-08-15_tribunal_iter3/`

---

## 1. Corrigir Imprecisões nos Documentos do Tribunal

**Problema:** C2 foi descrito como “workflows ausentes” e M10 como “AuditPanel não reage a toggles”, quando os findings originais tratam de colisão de ID e sincronização OpenRouter.  
**Solução:** adicionar nota de correção em `veredito.md` e `comparativo.md` citando os textos originais.  
**Impacto:** evita que o Orquestrador execute correções no lugar errado.

## 2. Gerar `relatorio-evolutivo.md` Obrigatoriamente

**Problema:** o Tribunal emitiu veredito mas não acionou a skill `gerar-relatorio-evolutivo`.  
**Solução:** incluir geração de diagrama Mermaid Antes/Depois e tabela comparativa conforme protocolo.  
**Impacto:** conformidade total com AGENTS.md e melhor rastreabilidade.

## 3. Verificar Ressalvas antes de Classificá-las

**Problema:** M1, M10 e M13 foram classificados como ressalvas sem verificação factual citada.  
**Solução:** exigir que cada sub-tribunal registre evidência (grep, trecho de código, métrica) mesmo para itens de baixa severidade.  
**Impacto:** aumenta a qualidade técnica e a defesa do veredito.

## 4. Padronizar Pacote de Dados Crus

**Problema:** o Juiz envia dados crus, mas os sub-tribunais reformulam os findings.  
**Solução:** criar template fixo com: ID do finding, texto literal, severidade original, evidência anexada.  
**Impacto:** reduz distorções e economiza tokens de reconciliação.

## 5. Revalidação Factual na Próxima Iteração

**Problema:** revisores reprovaram com base em C2, A3 e M15 falsos.  
**Solução:** o coordenador-revisao deve exigir de cada revisor evidência factual (comando grep, trecho de código) antes de aceitar findings Crítico/Alto.  
**Impacto:** reduz alucinações e evita novo ciclo de Tribunal.
