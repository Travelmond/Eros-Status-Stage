# 🔧 Soluções Propostas — Validação final e commit F1–F4

## Ações imediatas (bloqueantes)

### 1. Commitar o working tree agora
- **Impacto**: elimina o risco de perda total do polimento F1–F4 (4 findings já aplicados).
- **Como**: `git add -A && git commit -m "feat: polimento F1-F4 — tema de cores central, fim de round-trip JSON e remoção de lodash"`.
- **Responsável sugerido**: `@devops`.

### 2. Re-executar a validação completa e registrar evidência
- **Impacto**: torna a alegação de "36 testes passando" auditável.
- **Como**: rodar `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test`; anexar o output ao commit (ou a um arquivo de evidência em `docs/testing/`).
- **Responsável sugerido**: `@devops`.

### 3. Sincronizar a gestão (skill `sync-context`)
- **Impacto**: elimina as 3 alucinações documentais detectadas.
- **Como**:
  - `tarefas.md`: mover F2 de "Pendentes" para "Concluídas" (com nota de `lodash` removido).
  - `implementacao.md`: atualizar linhas 19/94 (F2 ✅) e linha 117 (observação do Juiz) para refletir o estado real.
- **Responsável sugerido**: qualquer agente, via `sync-context`.

## Recomendações estruturais
1. **Regra: "código sem commit = código inexistente".** Após qualquer aplicação de polimento, o commit é obrigatório e bloqueante, antes de `sync-context`.
2. **Validação deve gerar artefato.** Todo `build/test` de validação final deve salvar log (ex.: `docs/testing/validacao-YYYY-MM-DD.log`) para permitir auditoria do Juiz sem shell.
3. **Consistência docs ↔ filesystem.** `sync-context` deve ser executado **depois** do commit (não antes), garantindo que "concluído" sempre tenha um hash de commit associado.
4. **F2 em observação**: verificar se `lodash.merge` (transitivo) pode ser deduplicado, embora fora do escopo do finding original.
