# 🔧 Soluções e Recomendações — 3ª Iteração `equipe-revisao` (ESS v3.0)

**Data:** 2026-08-15  
**Pasta:** `/docs/audit/2026-08-15_equipe_revisao_iter3/`

---

## Soluções Imediatas

### 1. Reativar `@coordenador-revisao` com skill `equipe-revisao` para iter3
- **Impacto:** desbloqueia a fronteira de revisão obrigatória.
- **Responsável:** `@orquestrador` → `@coordenador-revisao`.
- **Entradas:** arquivos modificados na iter2 → iter3, `manifesto_de_intencao.md`, contratos JSON.

### 2. Executar validação local antes da revisão
```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run test
```
- **Impacto:** reduz findings falsos e economiza tokens dos revisores.
- **Artefato:** salvar log em `/docs/testing/validacao-iter3.log`.

### 3. Sincronizar documentação de gerenciamento
- Atualizar `docs/architecture/tech-debt.md` para refletir `@chub-ai/stages-ts ^0.4.0`.
- Atualizar `implementacao.md` decisão 20 para marcar A4 como resolvido.
- **Impacto:** elimina alucinação de estado para a equipe de revisão.

---

## Recomendações Estruturais

### Curto Prazo
1. **Gatilho automático de revisão:** o Orquestrador deve acionar `@coordenador-revisao` quando `implementacao.md` indicar "Pronto para reativar `equipe-revisao`".
2. **Checklist de pré-revisão obrigatório:** build, lint, typecheck e testes passando antes de acionar a `equipe-revisao`.
3. **Validação cruzada de wiring:** após correções de componente (`AIConfigPanel`), o `@arquiteto-geral` deve verificar se o pai (`ErosTerminal.tsx`) propaga as props necessárias.

### Médio Prazo
4. **Contador de iterações explícito:** adicionar campo `iteracao_atual` e `max_iteracoes` em `implementacao.md`, atualizado automaticamente pela skill `equipe-revisao`.
5. **Dados crus do Tribunal pré-montados:** gerar `/docs/audit/dados-crus-tribunal.md` ao atingir a iter3, agilizando a escalação se necessário.
6. **Skill de pós-correção:** criar mini-skill para validar que findings 🔴/🟠 foram endereçados antes de reativar a `equipe-revisao`.

### Longo Prazo
7. **Dashboard de auditoria do Juiz:** arquivo `/docs/management/juiz-dashboard.md` com histórico de iterações, tokens gastos e status de cada revisor.
8. **Integração CI:** fazer com que o GitHub Actions execute lint/typecheck/test em PRs para `dev`, bloqueando merge até aprovação da `equipe-revisao`.

---

## Preparação para o Tribunal

Se a iter3 reprovar com findings Alto/Crítico, o Juiz deve preparar e enviar ao Tribunal:

1. **Logs de execução:** sequência de agentes ativados em cada iteração.
2. **Diffs de código:** estado antes da iter1, após correções iter1 → iter2, após correções iter2 → iter3.
3. **Métricas:** tokens estimados por iteração, tempo total, número de findings por severidade.
4. **Relatórios de revisão:** `/docs/testing/revisao-2026-08-15_00-00.md`, `/docs/testing/revisao-2026-08-15_iteracao2.md` e o futuro relatório da iter3.
5. **Relatórios do Juiz:** auditorias anteriores (`2026-08-15_equipe_revisao`, `2026-08-15_equipe_revisao_iter2`, `2026-08-15_correcoes_iter3`).

**Importante:** não incluir manifesto, objetivos do projeto ou narrativa do usuário.
