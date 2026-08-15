# Soluções e Recomendações — 2026-08-15_iniciar

## 1. Criar contexto vivo imediatamente
- **Ação**: Criar `/docs/management/implementacao.md`, `/docs/management/tarefas.md` e arquivos em `.opencode/context/`.
- **Responsável**: `@documentacao` ou `@planejador-primario`
- **Impacto**: Reduz 60-80% dos tokens de releitura em reinicializações.

## 2. Normalizar estrutura de `/docs`
- **Ação**: Migrar os arquivos numerados (`00-INDICE.md` … `10-MISC.md`) para as pastas `requirements/`, `architecture/`, `design/`, `testing/`, `deployment/` conforme `AGENTS.md`, mantendo `00-INDICE.md` como índice.
- **Responsável**: `@arquiteto-geral` → `@documentacao`
- **Impacto**: Skills de documentação e revisão funcionam sem customização.

## 3. Validar stack real
- **Ação**: Executar skill `detectar-stack` e atualizar `AGENTS.md` com as tecnologias efetivamente presentes.
- **Responsável**: `@pesquisador` + `@arquiteto-geral`
- **Impacto**: Elimina risco de implementação na stack incorreta.

## 4. Reforçar gatekeeper
- **Ação**: Ao receber mensagem sem comando slash, o Orquestrador deve priorizar `@agente-de-intencao`; para recarga de contexto, deve exigir/aceitar `/iniciar`.
- **Responsável**: `@orquestrador` (ajuste de prompt interno)
- **Impacto**: Reduz desvios de fluxo e ativações desnecessárias do Juiz.

## 5. Ativar `sync-context` como padrão
- **Ação**: Todo agente que concluir tarefa deve executar `sync-context`.
- **Responsável**: `@orquestrador` + todos os agentes Tier 2/3
- **Impacto**: Mantém estado do projeto persistente e barato de recarregar.

## Próximos Passos Sugeridos
1. Usuário executar `/iniciar` corretamente.
2. Orquestrador ativar `ler-contexto-projeto` → `detectar-stack`.
3. Criar arquivos de contexto vivo.
4. Juiz reavaliar em nova rodada.
