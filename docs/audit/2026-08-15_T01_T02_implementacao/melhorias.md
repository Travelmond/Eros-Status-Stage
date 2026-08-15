# 🔧 Melhorias Propostas — T01/T02 Implementação

## 1. Desbloquear T02 com stub de T01
- Criar um componente `ErosTerminalStub` que aceite as mesmas props definidas no contrato T01.
- Permitir que T02 valide o `render()` do StageBase sem depender da UI final.
- Impacto: paralelismo real, redução de ~20-30% no tempo total.

## 2. Congelar tipagens de T03 antes da execução
- Garantir que `src/types/eros-status.ts` não seja alterado durante T01/T02 sem aviso.
- Impacto: evita retrabalho e inconsistências entre frontend e backend.

## 3. Revisão contínua em vez de revisão única no final
- Aplicar `equipe-revisao` após cada arquivo crítico (`parser.ts`, `middleware.ts`, `ErosTerminal.tsx`).
- Impacto: captura de alucinações e violações de hard rules mais cedo.

## 4. Atualização obrigatória dos arquivos vivos
- Todo agente deve executar `sync-context` ao concluir uma sub-tarefa.
- Impacto: economia de 70-90% de tokens de contexto nas rodadas seguintes.

## 5. Monitoramento do contador de iterações
- O Juiz continuará monitorando o contador da `equipe-revisao`.
- Se atingir 3 iterações sem aprovação, o Tribunal será ativado automaticamente.
