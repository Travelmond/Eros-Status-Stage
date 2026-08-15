# 🔧 Soluções e Recomendações — Loop de Correção pós-Revisão ESS v3.0

## Ações Imediatas

1. **Coordenar correções via `@arquiteto-geral`**
   - Responsável: `@orquestrador` → `@arquiteto-geral`.
   - Escopo: distribuir findings críticos/altos para Tier 2/3 conforme atribuições do relatório de revisão.

2. **Endereçar findings críticos primeiro**
   - **C1 — Testes:** adicionar script `test` no `package.json`; criar testes para `parser.ts`, `middleware.ts`, `audit.ts`.
   - **C2 — Deploy separado:** criar workflows distintos para `dev` e `main` com `extension_id` diferentes.
   - **C3 — localStorage:** remover `loadCharacterCache`/`saveCharacterCache` do ciclo de vida do Stage; migrar para message/chat state.

3. **Endereçar findings altos**
   - **A1:** propagar `ntrEnabled` do frontend para `config.enableNTR` e/ou StageBase.
   - **A2:** implementar handlers reais para `onToggleAuditor`/`onToggleImgAuditor`.
   - **A3:** substituir `var(--neon-*)XX` por `color-mix()` ou hex alpha válido.
   - **A4:** atualizar `@chub-ai/stages-ts` e validar tipos.
   - **A5:** limitar/debouncer writes em `localStorage`.

## Melhorias Estruturais

1. **Gatilho automático pós-reprovação**
   - Quando `implementacao.md` contém "REPROVADO", `@arquiteto-geral` deve ser acionado automaticamente.
   - Impacto: elimina observações do Juiz sobre inércia; economiza ~6.000 tokens por ocorrência.

2. **Template de plano de correção**
   - `@arquiteto-geral` deve gerar checklist em `/docs/management/tarefas.md` vinculando cada finding ao dev responsável.
   - Impacto: rastreabilidade e accountability.

3. **Pré-check obrigatório antes de reenviar revisão**
   - `npm run typecheck && npm run lint && npm run build && npm test` devem passar antes de `@coordenador-revisao` reativar a equipe.
   - Impacto: reduz findings técnicos repetidos em ~30%.

4. **Registro do contador de iterações**
   - Toda revisão deve atualizar `implementacao.md` com `Iteração X/3`.
   - Impacto: evita ambiguidade sobre quando ativar o Tribunal.

## Impacto Esperado

- **Tokens:** economia de ~6.000 tokens por observação desnecessária + ~30% na iteração 2 via pré-check.
- **Tempo:** redução de 1 rodada de inércia no ciclo de correção.
- **Qualidade:** findings críticos/altos endereçados antes de nova revisão, reduzindo risco de 3ª iteração e ativação do Tribunal.
