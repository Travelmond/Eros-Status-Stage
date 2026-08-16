# 💰 Análise de Tokens — 2026-08-15 (ReactRunner + modelos)

> Estimativa qualitativa (o Juiz não dispôs de telemetria de tokens por agente nesta sessão).

## Observação principal

As duas features alegadas ("fix do ReactRunner" e "listagem dinâmica") **não geraram nenhum artefato de código**. Portanto:

- Qualquer custo de tokens associado a "implementação" dessas features seria **desperdício puro** (trabalho reportado sem saída no repositório).
- O `dist/` existente é o artefato do TestRunner — produzido antes e sem relação com o trabalho alegado.

## Desperdício estimado

| Item | Estimativa | Tipo |
|---|---|---|
| "Implementação" do ReactRunner (inexistente) | 100% do suposto custo | Desperdício (sem saída) |
| "Implementação" da listagem dinâmica (inexistente) | 100% do suposto custo | Desperdício (sem saída) |
| `AVAILABLE_MODELS` (8 itens, código morto) | ~1% do `openRouter.ts` | Superfície morta |

## Onde há redundância real (código atual)

- **Duas listas de modelos hardcoded** desconexas: `DEFAULT_MODELS` (3, em `AIProviderSection.tsx`) e `AVAILABLE_MODELS` (8, em `openRouter.ts`, não usado). Consolidar em uma fonte única via `fetchModels` eliminaria a duplicação.
- **`dist/` stale**: build gerado sem refletir o estado desejado → tokens de CI/build desperdiçados ao re-empacotar um artefato que não é o Stage.

## Recomendação de economia

1. Consolidar modelos em `fetchModels()` (uma única fonte + cache) → remove 2 listas redundantes.
2. Definir entry de produção correto (`ReactRunner`) → evita builds/iterações de TestRunner que não servem ao Chub.
3. Sincronizar `tarefas.md`/`implementacao.md` → evita re-investigação e retrabalho de agentes que confiem em estado desatualizado (alucinação de estado).

> **Resumo**: o custo relevante aqui não é de tokens mal gastos em código real, mas de **trabalho reportado sem correspondência no repositório**, o que é um sinal de alucinação de entrega — mais grave que desperdício de tokens.
