# Sub-Tribunal 02 — Consistência Estatística

**Data da análise:** 2026-08-15  
**Iteração auditada:** 3ª revisão do Eros Stage Terminal (ESS) v3.0

## Escopo
Avaliar padrões de repetição, "chutes" disfarçados de findings e variância nas respostas dos revisores.

## Distribuição dos vereditos
| Revisor | Veredito | Severidade máxima |
|---|---|---|
| @critico-usuario | REPROVADO | Alto |
| @critico | REPROVADO | Crítico/Alto |
| @testador | APROVADO COM RESSALVAS | Médio |
| @auditor-seguranca | APROVADO COM RESSALVAS | Médio |
| @otimizador | REPROVADO | Alto |

## Análise estatística

### Taxa de discordância factual
- Total de findings Críticos/Altos: 5 (C2, A3, M9, M12, M14).
- Findings demonstravelmente falsos: 2 (C2, A3) = **40%** dos findings de maior severidade.
- Findings com severidade questionável: 1 (M12) = **20%** adicional.
- Findings altos/críticos inequívocos: 0.

### Padrão de repetição de tema
Findings relacionados a "ausência de arquivo/documento" aparecem múltiplas vezes:
- C2: workflows ausentes (falso).
- M14: plano de testes ausente (verdadeiro).
- M15: documentação descreve workflows inexistentes (falso).
- README desatualizado sobre testes (verdadeiro, médio).

Esse padrão sugere que os revisores reutilizaram um checklist desatualizado sem revalidação factual.

### Variância nas respostas
- 3 revisores reprovaram; 2 aprovaram com ressalvas.
- Os dois aprovadores (@testador, @auditor-seguranca) atribuíram no máximo severidade média.
- Os três reprovadores basearam parte de suas críticas em findings que não resistem à verificação factual.

A alta variância entre revisores indica que a reprovação não é consensual nem robustamente fundamentada.

### Indicadores de "chute" disfarçado
1. **C2:** afirmação absoluta de ausência de arquivos sem verificação real.
2. **A3:** citação de padrão específico (`var(--neon-${color})15`) sem confirmar presença no código.
3. **M15:** repetição da premissa falsa de C2.

Esses três findings têm características de inferência baseada em memória de iteração anterior, não em inspeção atual.

## Findings do sub-tribunal
| ID | Finding | Severidade |
|---|---|---|
| T02-F1 | 40% dos findings críticos/altos são factuaismente falsos | 🔴 Crítico |
| T02-F2 | Padrão de "ausência de arquivo" indica checklist desatualizado | 🟡 Médio |
| T02-F3 | Alta variância entre revisores reduz confiabilidade do veredito de reprovação | 🟡 Médio |

## Conclusão parcial
A revisão apresenta inconsistência estatística significativa: findings de maior severidade são frequentemente baseados em dados incorretos. Isso mina a credibilidade do veredito de reprovação majoritário.
