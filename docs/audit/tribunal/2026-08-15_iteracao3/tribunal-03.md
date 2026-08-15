# Sub-Tribunal 03 — Detecção de Vieses

**Data da análise:** 2026-08-15  
**Iteração auditada:** 3ª revisão do Eros Stage Terminal (ESS) v3.0

## Escopo
Identificar vieses sistemáticos, evitação de padrões e favorecimento indevido nas avaliações dos revisores.

## Vieses detectados

### 1. Viés de confirmação / memória de iteração anterior
- Revisores parecem ter reutilizado findings de revisões anteriores sem revalidar o estado atual do repositório.
- C2 (workflows ausentes) e A3 (padrão CSS inválido) são exemplos claros de afirmações que podem ter sido verdadeiras em iteração passada, mas não mais.
- M15 repete a premissa falsa de C2, reforçando o padrão de confirmação mútua entre revisores.

### 2. Viés de inflação de severidade
- M12 (`Stage.load()` sem validação de schema) foi classificado como "Alto".
- Tecnicamente, trata-se de defesa adicional; não há evidência de falha funcional ou corrupção ativa de dados.
- A classificação como "Alto" sugere tendência de maximizar o impacto de findings técnicos menores.

### 3. Viés negativo sistemático (pessimismo)
- 3 de 5 revisores reprovaram.
- No entanto, as métricas objetivas do sistema são positivas:
  - `npm run typecheck`: passou
  - `npm run lint`: passou
  - `npm run build`: passou
  - `npm run test`: 34 testes passando
- O descompasso entre métricas objetivas e vereditos majoritariamente negativos indica viés pessimista.

### 4. Viés de documentação sobre funcionamento
- M14 (plano de testes ausente), M15 (docs de deploy desatualizadas) e README desatualizado são findings de documentação.
- Embora importantes, esses findings não refletem falhas de funcionamento do código.
- A ênfase excessiva em documentação pode distrair da avaliação do comportamento real do sistema.

### 5. Viés de ancoragem em findings antigos
- A3 menciona `var(--neon-${color})15` com especificidade que sugere ancoragem em um problema anteriormente conhecido.
- A ausência de ocorrências no grep indica que o problema foi corrigido, mas o revisor manteve a âncora.

## Findings do sub-tribunal
| ID | Finding | Severidade |
|---|---|---|
| T03-F1 | Revisores reutilizaram findings desatualizados sem revalidação | 🔴 Crítico |
| T03-F2 | Severidade de M12 foi inflacionada por viés técnico | 🟡 Médio |
| T03-F3 | Descompasso entre métricas objetivas positivas e vereditos negativos | 🟡 Médio |
| T03-F4 | Ênfase desproporcional em findings de documentação | 🟢 Baixo |

## Conclusão parcial
Há evidências de vieses sistemáticos que distorcem a avaliação. A reprovação não reflete exclusivamente o estado atual do sistema, mas também resíduos de iterações anteriores e tendências de inflação de severidade.
