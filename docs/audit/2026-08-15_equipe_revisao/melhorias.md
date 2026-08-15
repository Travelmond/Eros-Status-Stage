# 🔧 Soluções Propostas — Observação `equipe-revisao`

## 1. Acionar `equipe-revisao` imediatamente
- **Ação:** o Orquestrador deve invocar `@coordenador-revisao` com a skill `equipe-revisao` sobre o entregável integrado.
- **Impacto:** desbloqueia o fluxo de deploy e garante conformidade com `AGENTS.md`.

## 2. Validar build antes da revisão
- **Ação:** executar `npm run typecheck`, `npm run lint` e `npm run build` antes de acionar os revisores.
- **Impacto:** reduz findings técnicos repetidos e economiza ~20–30% de tokens.

## 3. Garantir inputs específicos para cada revisor
- **Ação:** o `coordenador-revisao` deve fornecer:
  - `@critico-usuario` → `manifesto_de_intencao.md` + interface implementada.
  - `@critico` → código + contratos JSON.
  - `@testador` → código + casos de teste esperados.
  - `@auditor-seguranca` → código + foco em API key e localStorage.
  - `@otimizador` → código + bundle inicial.
- **Impacto:** vereditos mais precisos e menos falsos positivos.

## 4. Registrar contador de iterações
- **Ação:** o relatório de revisão deve conter campo explícito `Iteração`.
- **Impacto:** permite ativação correta do Tribunal na 3ª iteração.

## 5. Automatizar gatilho de revisão
- **Ação:** ao detectar em `tarefas.md` que todas as tarefas de um contrato foram marcadas como concluídas, o Orquestrador sugere `/revisar`.
- **Impacto:** evita que a skill obrigatória seja esquecida.

## Fluxo de Melhoria (se aceito)
```
Juiz propõe solução
  → Usuário aceita
    → @planejador-primario valida escopo da melhoria
      → @arquiteto-geral orquestra execução
        → @coordenador-revisao executa `equipe-revisao`
          → Juiz reavalia
```
