# 🔧 Soluções e Melhorias Propostas — 2026-08-15

## Problemas Prioritários

### 1. Respostas vagas do planejamento
**Impacto**: Alto (risco de alucinação no arquiteto-geral)
**Solução**: Planejador deve rejeitar ou detalhar respostas "C" antes de prosseguir.

### 2. Falta de checkpoint de confirmação
**Impacto**: Médio (retrabalho potencial)
**Solução**: Inserir etapa explícita: "Plano aprovado? [S/N]" antes do tradutor-tiers.

### 3. Reprocessamento de contexto pelo planejador
**Impacto**: Médio (desperdício de tokens)
**Solução**: Usar resumo estruturado do manifesto em vez do documento completo.

## Ações Recomendadas

| # | Ação | Responsável | Impacto Esperado |
|---|---|---|---|
| 1 | Adicionar validação de respostas vagas | planejador-primario | -10% risco de alucinação |
| 2 | Criar checkpoint de confirmação do plano | orquestrador | -15% retrabalho |
| 3 | Cachear resumo do manifesto | sync-context | -15% tokens |

## Próximos Passos
Se o usuário aceitar, ativar fluxo de melhoria:
```
@planejador-primario → perguntas categorizadas → @arquiteto-geral → skill equipe-revisao
```
