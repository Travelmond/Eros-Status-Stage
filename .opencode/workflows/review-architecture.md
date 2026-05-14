# Workflow: /revisar-arquitetura
# agent: @engineering-software-architect
# Uso: quando feature existente precisa of refactoring architectural

## Trigger
/revisar-arquitetura <componente_ou_feature>

## Processo
1. Read o Code atual of the componente
2. Read a spec in `docs/specification-Completa-QRGen-API.md`
3. Identifique divergências entre spec e implementação
4. Produza relatório:

```
## 📐 REVISÃO architectural — [Componente]

### Divergências Encontradas
| Spec Diz | Code Faz | Severidade |
|---|---|---|
| [o que deveria ser] | [o que é] | Alta/Média/Baixa |

### Dívidas Técnicas Identificadas
1. [dívida + impacto]

### Proposta of Refactoring
[ADR + diagrama Mermaid]

### Risco of the Refactoring
[o que pode quebrar + mitigação]
```