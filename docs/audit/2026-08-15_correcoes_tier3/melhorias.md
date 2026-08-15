# 🔧 Soluções e Recomendações — Correções Tier 3 pós-Revisão 1/3

## Soluções Imediatas

### 1. Acionar `@arquiteto-geral` para coordenar correções
- **Responsável:** Orquestrador.
- **Ação:** delegar ao `@arquiteto-geral` o relatório de revisão e os contratos T01–T04.
- **Impacto:** desbloqueia iteração 2/3; economia de ~4.800 tokens por rodada de observação ociosa.

### 2. Corrigir findings críticos/altos conforme atribuições
| Agente | Findings | Ação concreta |
|---|---|---|
| @dev-backend + @testador | C1 | Criar scripts de teste (`vitest`/`jest`) para `parser.ts`, `middleware.ts`, `audit.ts`. |
| @devops | C2 | Criar `.github/workflows/deploy-dev.yml` e `.github/workflows/deploy.yml` com `extension_id` distintos. |
| @dev-backend | C3 | Remover `loadCharacterCache`/`saveCharacterCache` do ciclo de vida do Stage; migrar estado crítico para `messageState`. |
| @dev-frontend | A1 | Conectar `ntrEnabled` a `config.enableNTR` e propagar alteração via callback para o middleware. |
| @dev-frontend | A2 | Implementar `onToggleAuditor`/`onToggleImgAuditor` em `ErosTerminal.tsx`. |
| @dev-frontend | A3 | Substituir `var(--neon-*)XX` por `rgba(var(--neon-*-rgb), 0.XX)` ou classes Tailwind. |
| @dev-backend | A4 | Verificar versão atual de `@chub-ai/stages-ts` e atualizar `package.json`. |
| @dev-backend | A5 | Rate-limitar ou eliminar writes em `localStorage`; usar apenas para preferências. |
| @documentacao | — | Atualizar README com ausência de testes e risco de localStorage no Chub. |

### 3. Corrigir inconsistência de registro
- **Ação:** verificar se `.github/workflows/` existe; se não existir, remover afirmação de entrega em `tarefas.md` e `implementacao.md`.
- **Impacto:** elimina alucinação de estado do projeto.

## Recomendações Estruturais
1. **Gatilho automático de correção:** ao detectar "REPROVADO", o Orquestrador deve acionar `@arquiteto-geral` sem aguardar comando extra.
2. **Validação pré-revisão:** a `equipe-revisao` deve recusar reenvio se findings críticos/altos não tiverem evidências de correção (commits, diffs, testes).
3. **Contador de iterações visível:** adicionar campo em `implementacao.md` para acompanhamento do Juiz e do Tribunal.
4. **Supressão de observações redundantes:** o Juiz deve consolidar observações consecutivas sobre o mesmo estado estagnado em um único relatório atualizado.

## Próximos Passos
1. Orquestrador ativa `@arquiteto-geral`.
2. `@arquiteto-geral` distribui correções para Tier 3.
3. Tier 3 executa correções e atualiza `tarefas.md`.
4. Executar build, lint e testes.
5. Reativar `@coordenador-revisao` com `equipe-revisao` para iteração 2/3.
