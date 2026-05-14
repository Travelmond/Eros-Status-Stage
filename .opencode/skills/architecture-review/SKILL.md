---
name: revisao-arquitetura
description: Workflow for revisão architectural of componentes ou features existentes. Foca in identificar divergências entre especificação e Code, mapear dívidas técnicas e propor refactoring seguro.
metadata:
  agent: "@engineering-backend-architect"
  uso: "quando feature existente precisa of refactoring architectural"
  Trigger: "/revisar-arquitetura <componente_ou_feature>"
---

## Processo
1. Read o Code atual of the componente
2. Read a spec in `docs/OPENCODE.md`
3. Identifique divergências entre spec e implementação
4. Produza relatório:

```markdown
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