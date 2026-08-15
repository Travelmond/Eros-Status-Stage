# 🔧 Melhorias Propostas — T03 Schemas

## 1. Ativar a Hierarquia de Execução
**Ação**: Orquestrador deve chamar `@arquiteto-geral` com os 4 contratos (T01–T04) e este deve delegar T03 a `@arquiteto-banco-de-dados`.
**Impacto**: desbloqueia produção real de artefatos; reduz de ~75% para ~15% o desperdício de tokens em auditorias posteriores.

## 2. Criar Estrutura do Projeto Antes dos Schemas
**Ação**: executar `detectar-stack` e inicializar Vite + React + TypeScript + `public/` e `src/`.
**Impacto**: permite validar `chub_meta.yaml` com parser YAML e compilar `src/types/*.ts` com `tsc`.

## 3. Revisar o Contrato de Persistência
**Ação**: atualizar `docs/01-ARQUITETURA.md` e manifesto para refletir que estado crítico vai para `messageState`/`chatState`, e `localStorage` fica apenas para preferências locais.
**Impacto**: elimina risco de alucinação sobre persistência no Chub; garante conformidade com hard rules do T03.

## 4. Gerar `docs/architecture/state-mapping.md`
**Ação**: incluir como entregável obrigatório do T03, mapeando cada campo de `ErosStatusState` para `initState`/`messageState`/`chatState`.
**Impacto**: atende critério de aceite do contrato e serve como contrato de dados para T01 e T02.

## 5. Validação Automatizada no Loop de Revisão
**Ação**: quando `equipe-revisao` auditar T03, incluir checks:
- `npx yaml-lint public/chub_meta.yaml` ou parser equivalente.
- `npx tsc --noEmit` para `src/types/`.
- Busca por `localStorage.setItem` em estado crítico.
- Verificação de campo `secret: true` para `api_key`.
**Impacto**: reduz falhas de conformidade com a API do StageBase.

## Próxima Avaliação do Juiz
Recomenda-se reativar o Juiz somente após entrega dos seguintes artefatos:
1. `public/chub_meta.yaml`
2. `src/types/chub.ts`
3. `src/types/eros-status.ts`
4. `src/types/config.ts`
5. `src/types/index.ts`
6. `docs/architecture/state-mapping.md`
