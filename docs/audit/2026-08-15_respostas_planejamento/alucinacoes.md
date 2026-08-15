# 🧠 Alucinações Detectadas — 2026-08-15

## Resumo
- **Alucinações confirmadas**: 0
- **Riscos de alucinação**: 2
- **Severidade máxima**: Média

## Riscos Identificados

### Risco 1: Inferência de stack padrão
- **Agente**: arquiteto-geral (potencial)
- **Causa**: Resposta "stack C" (comum/padrão) sem especificação técnica.
- **Impacto**: Pode assumir Vite + Express + PostgreSQL por padrão do projeto, sem validar se o usuário quer isso.
- **Prevenção**: Converter "C" em especificação mínima obrigatória.

### Risco 2: Configuração padrão
- **Agente**: arquiteto-geral / arquiteto-backend (potencial)
- **Causa**: Resposta "config C".
- **Impacto**: Pode usar variáveis de ambiente padrão sem perguntar ao usuário.
- **Prevenção**: Planejador deve detalhar config obrigatória vs. opcional.

## Observações
Nenhuma alucinação concreta foi detectada porque o fluxo parou na entrega ao arquiteto-geral. Os riscos são preventivos.
