# Relatório de Revisão — Iteração 3/3

**Projeto:** Eros Status Terminal (ESS) v3.0  
**Data:** 2026-08-15  
**Agente responsável:** @coordenador-revisao (`equipe-revisao`)  
**Iteração:** 3 de 3  
**Veredito geral:** REPROVADO  
**Ação escalada:** Tribunal convocado pelo Juiz conforme protocolo de governança.

---

## 1. Resumo Executivo

A terceira e última iteração do loop de revisão obrigatória (`equipe-revisao`) reprovou o entregável. Foram levantados findings de severidade Crítica (C), Alta (A) e Média (M), abaixo listados. Como o loop atingiu o limite máximo de 3 iterações sem aprovação, o **Juiz convocou o Tribunal** para auditoria suprema e veredito final.

Findings persistentes da iteração anterior (A4, A6, M9, M10, M12, M14, M1, M13, M15) não foram considerados totalmente resolvidos ou apresentaram regressões, e novos itens críticos (C2) e altos (A3) foram identificados.

---

## 2. Findings

### C2 — Deploy para `dev` vs `main` ainda com risco de colisão de ID
- **Severidade:** Crítica
- **Área:** DevOps / Deploy / Git
- **Descrição:** O workflow `.github/workflows/deploy-dev.yml` continua usando o ID de extensão principal (`CHUB_EXTENSION_ID`) em vez de um ID separado de stage/teste, ou não há validação explícita de que `CHUB_EXTENSION_ID_DEV` está configurado. Isso permite que pushes na branch `dev` sobrescrevam a extensão estável em produção.
- **Evidência:** Ausência de fallback seguro quando `secrets.CHUB_EXTENSION_ID_DEV` está vazio; `CHUB_EXTENSION_ID` default pode ser usado.
- **Responsável sugerido:** @devops
- **Critério de aceitação:** `deploy-dev.yml` deve falhar imediatamente se `CHUB_EXTENSION_ID_DEV` não estiver definido, e nunca usar o ID de produção.

### A3 — CSS inline inválido / classes Tailwind malformadas retornaram
- **Severidade:** Alta
- **Área:** Frontend / UI
- **Descrição:** Novamente detectados padrões `var(--color)NN` e classes Tailwind arbitrárias contendo `color-mix(...)` sem underscore em arquivos `.tsx`/`.ts`/`.css` modificados nesta iteração.
- **Evidência:** Build passa, mas CSS gerado contém regras inválidas que quebram a estética cyberpunk em runtime.
- **Responsável sugerido:** @dev-frontend
- **Critério de aceitação:** `grep -R "var(--color)[0-9]" src/` e `grep -R "color-mix" src/` não devem retornar ocorrências inválidas; todas as classes arbitrárias com `color-mix` usam `_`.

### M9 — Gating de Sex/Reaction incompleto na UI
- **Severidade:** Média
- **Área:** Frontend / UI
- **Descrição:** Embora `enforceSexGate` e `enforceReactionGate` existam no middleware, os tabs/painéis `SexPanel` e `ReactionPanel` ainda são renderizados e permitem interação quando `config.enableSexModule === false` / `config.enableReactionModule === false`.
- **Responsável sugerido:** @dev-frontend
- **Critério de aceitação:** Quando os módulos estão desativados, os respectivos painéis/tabs devem estar ocultos ou desabilitados, e valores zerados não devem ser exibidos de forma editável.

### M12 — Memória no chatState: `ConfigPanel` consome estado desatualizado
- **Severidade:** Média
- **Área:** Frontend + Backend / Integração
- **Descrição:** `ConfigPanel` e `ErosTerminal` recebem `chatState`, mas após `onCondenseMemory`/`onClearMemory` a UI não reflete imediatamente as mudanças; o estado passado é uma referência que pode não ter sido atualizada pelo StageBase.
- **Responsável sugerido:** @dev-frontend + @dev-backend
- **Critério de aceitação:** Ações de condensar/limpar memória devem atualizar a UI em até 1 frame após retorno do callback.

### M14 — Testes insuficientes para gating e persistência de auditoria
- **Severidade:** Média
- **Área:** Testes / Backend
- **Descrição:** Foram adicionados testes para `enforceSexGate`, `enforceReactionGate` e `correctedIds`/`ignoredIds`, mas a cobertura ainda não inclui casos de borda: módulo desativado com valores pré-existentes, toggle reativando valores anteriores, e persistência de issues corrigidas após múltiplos turnos.
- **Responsável sugerido:** @dev-backend
- **Critério de aceitação:** Adicionar pelo menos 4 novos casos de teste cobrindo os cenários de borda acima; todos os testes devem passar.

### M1 — Cores hardcoded residuais
- **Severidade:** Média
- **Área:** Frontend / Design System
- **Descrição:** Ainda existem cores hardcoded (`#0f172a`, `bg-slate-*`, `text-zinc-*`) em componentes secundários e no `index.css`, fora dos design tokens definidos.
- **Responsável sugerido:** @dev-frontend
- **Critério de aceitação:** Todas as cores de UI devem vir de `--terminal-*` ou `--neon-*` tokens; nenhuma cor literal deve aparecer em `.tsx`/`.css` do tema.

### M10 — Sincronização de config OpenRouter inconsistente
- **Severidade:** Média
- **Área:** Frontend / State
- **Descrição:** `AIProviderSection` e `AIConfigPanel` propagam `onConfigChange`, mas `ConfigPanel` principal não reflete `openRouterModel`/`openRouterApiKey` quando alterados dentro do painel de AI, causando estado temporariamente divergente.
- **Responsável sugerido:** @dev-frontend
- **Critério de aceitação:** Alterar modelo ou API key em qualquer subpainel deve atualizar imediatamente o estado global e todos os campos que os exibem.

### M13 — Dependências não utilizadas: resíduos indiretos
- **Severidade:** Média
- **Área:** DevOps / Build
- **Descrição:** Embora `recharts`, `date-fns`, `cmdk`, `vaul`, `sonner` e `zod` tenham sido removidos do `package.json`, resquícios ainda aparecem no `package-lock.json` (transitivos não limpos) e há imports comentados em arquivos de UI.
- **Responsável sugerido:** @devops
- **Critério de aceitação:** `npm install` não reinstala os pacotes removidos; `package-lock.json` não contém entradas diretas dos pacotes excluídos; nenhum import comentado remanescente.

### M15 — Tokens de gradiente neon aplicados de forma inconsistente
- **Severidade:** Média
- **Área:** Frontend / Design System
- **Descrição:** As variáveis `--neon-*-soft` foram criadas, mas nem todos os painéis que possuem gradientes as utilizam; alguns ainda usam `bg-gradient-to-*` com cores hardcoded.
- **Responsável sugerido:** @dev-frontend
- **Critério de aceitação:** Todos os gradientes cyberpunk devem usar as tokens `--neon-*-soft`; nenhuma declaração `bg-gradient-to-*` com cores literais deve permanecer.

---

## 3. Veredito por Revisor

| Revisor | Status | Findings principais |
|---|---|---|
| `critico` | REPROVADO | C2, A3, M13 |
| `critico-usuario` | REPROVADO | M9, M12, M15 |
| `testador` | REPROVADO | M14, M12 |
| `auditor-seguranca` | REPROVADO | C2, M10 |
| `otimizador` | REPROVADO | M1, M15, M13 |

**Consenso:** REPROVADO.

---

## 4. Estado da Validação Local

- `npm install`: ✅ passou
- `npm run typecheck`: ✅ passou
- `npm run lint`: ✅ passou
- `npm run build`: ✅ passou
- `npm run test`: ✅ 34 testes passando

> Nota: validação local passou, mas findings de UX, segurança e design system impedem aprovação.

---

## 5. Ação Escalada — Tribunal

Conforme protocolo de governança do projeto, ao atingir a 3ª iteração de revisão sem aprovação, o **Juiz convocou o Tribunal** para análise dos dados crus e emissão de veredito final.

- **Status:** Tribunal convocado
- **Findings submetidos ao Tribunal:** C2, A3, M9, M12, M14, M1, M10, M13, M15
- **Possíveis desfechos:**
  1. **ACEITÁVEL:** Projeto segue para deploy/teste apesar dos findings.
  2. **INACEITÁVEL:** Correções obrigatórias; após correções, reativação do Tribunal ou da `equipe-revisao` conforme determinação.
  3. **NECESSITA APELAÇÃO:** Orquestrador pode apresentar justificativa técnica via Juiz.

---

## 6. Próximos Passos

1. Aguardar veredito do Tribunal.
2. Se o Tribunal ordenar correções:
   - @dev-frontend corrige A3, M1, M9, M10, M12 UI, M15.
   - @dev-backend corrige M12 backend, M14.
   - @devops corrige C2, M13.
   - Após correções, reativação da `equipe-revisao` ou reavaliação pelo Tribunal conforme determinação.
3. Se o Tribunal aceitar apelação: reativar `equipe-revisao` para validação final.
4. Após aprovação final: push de `dev` para `origin/dev` e deploy de teste no Chub.
5. Promoção `dev` → `main` somente mediante aprovação explícita do usuário.

---

## 7. Referências

- Relatório da iteração 2: `/docs/testing/revisao-2026-08-15_iteracao2.md`
- Relatório da iteração 1: `/docs/testing/revisao-2026-08-15_00-00.md`
- Plano de implementação: `/docs/management/implementacao.md`
- Checklist de tarefas: `/docs/management/tarefas.md`
