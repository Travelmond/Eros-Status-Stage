# 🧠 Alucinações Detectadas — Correções Iter2 → Iter3

## Alucinações Confirmadas

### 1. Estado de A4 distorcido na documentação
- **Onde:** `docs/architecture/tech-debt.md` (seção 2.1) e `docs/management/implementacao.md` (decisão 20).
- **O que alucinou:** documentação afirma que `@chub-ai/stages-ts` está em `^0.3.7` e que A4 é pendente.
- **Realidade:** `package.json` já especifica `^0.4.0`.
- **Severidade:** Média — pode gerar falso finding na iter3 ou re-trabalho desnecessário.
- **Agente responsável:** @dev-backend / @documentacao (falha no `sync-context`).

### 2. Presunção de que A6 está completo
- **Onde:** `src/components/terminal/AIConfigPanel.tsx` atualizado, mas `src/components/terminal/ErosTerminal.tsx` linha 281.
- **O que alucinou:** como `AIConfigPanel` recebe `config`/`onConfigChange` e chama `callOpenRouter`, assume-se que o finding A6 foi resolvido.
- **Realidade:** `ErosTerminal` não propaga `config` nem `onConfigChange` para `AIConfigPanel`; no ciclo de vida real do Stage as alterações do painel de AI não alcançam `Stage.tsx`.
- **Severidade:** Alta — finding alto permanece parcialmente não endereçado.
- **Agente responsável:** @dev-frontend (falta de integração cruzada).

### 3. Rastreamento de tarefas impreciso
- **Onde:** `docs/management/tarefas.md` linha 77.
- **O que alucinou:** tarefa "Documentar débito técnico @chub-ai/stages-ts (A4)" marcada como concluída confunde-se com a atualização real da dependência.
- **Realidade:** a documentação foi feita, mas a atualização do pacote não está explicitamente rastreada como tarefa concluída.
- **Severidade:** Baixa/Média — risco de dupla contagem ou esquecimento.
- **Agente responsável:** @dev-backend / @documentacao.

## Alucinações em Risco de Ocorrer na Iter3

1. **Assumir que M11 ainda existe:** o código atual de `NeonProgressBar.tsx` não usa `requestAnimationFrame`; um revisor pode reabrir M11 se não comparar com o diff da iter2.
2. **Ignorar M9 porque os arquivos são re-exports:** o critério de aceite exige `@deprecated`; sem a anotação, M9 continua válido.
3. **Considerar M15 resolvido apenas porque `secret: true` existe:** a revisão pediu documentação de staging vs. produção no tratamento do secret, não apenas a flag no YAML.

## Mitigações Recomendadas

- Atualizar `tech-debt.md` e `implementacao.md` imediatamente após qualquer mudança de dependência.
- Garantir que o componente pai receba e propague novas props antes de marcar finding de UI como resolvido.
- Manter checklist explícito de critérios de aceite de cada finding em `tarefas.md`.
