# 🔧 Melhorias / Soluções Propostas — Polimento F1–F4

## Ações Obrigatórias (para fechar F1–F4)

### F1 — Migrar hex hardcoded para design tokens (`src/core/parser.ts`)
- **Arquivo:** `src/core/parser.ts`, funções `getSexPhaseColor` (linhas 988–993) e `getMenstrualPhaseInfo` (linhas 995–1003).
- **Ação:** substituir literais hex (`#FF2D78`, `#BF5FFF`, `#FFD700`, `#00FFF5`, `#39FF14`, `#ffffff30`) por tokens existentes (`--neon-pink`, `--neon-green`, `--neon-cyan`, `--neon-*` etc.) ou, se necessário, expor novas variáveis em `src/index.css`.
- **Atenção:** as funções retornam `string` de cor; manter o mesmo contrato de retorno para não quebrar consumidores.
- **Impacto:** elimina a fonte restante de cores hardcoded; consistência de tema.

### F2 — Remover `lodash` não utilizado (`package.json`)
- **Arquivo:** `package.json` (dependências `lodash` e `@types/lodash`).
- **Ação:** remover ambas as entradas; executar `npm install` para sincronizar `package-lock.json`.
- **Verificação:** `grep -r "lodash" src/` já confirmou **zero** importações.
- **Impacto:** reduz árvore de dependências e superfície de build.

### F3 — Eliminar estado local duplicado (`AIProviderSection` / `AIConfigPanel`)
- **Arquivos:** `src/components/terminal/AIConfigPanel.tsx` e `AIProviderSection.tsx`.
- **Problema:** `AIConfigPanel` mantém `model`/`apiKey`; `AIProviderSection` mantém `key`/`selectedModel` (espelhados via `useEffect`), criando **duas fontes de verdade**.
- **Ação:** adotar `config.openRouterModel`/`config.openRouterApiKey` como single source of truth (via `onConfigChange`), tornando `AIProviderSection` controlado (sem `useState` para key/model — apenas `query` e `status` locais são legítimos).
- **Impacto:** remove dessincronização e round-trips de estado desnecessários.

### F4 — Remover round-trip JSON→string→parse (`AIConfigPanel.tsx`)
- **Arquivo:** `src/components/terminal/AIConfigPanel.tsx` (linhas 68–69).
- **Problema:** `extractJsonFromResponse` já retorna `Record<string, unknown>`; o código faz `JSON.stringify(json)` e então `parseErosStatusFromMessage(jsonText)`.
- **Ação:** processar o objeto `json` diretamente (adicionar/ajustar uma função de parsing que aceite o objeto, ou normalizar o payload sem re-stringificar).
- **Impacto:** menos alocações, menos risco de falha de parse, código mais direto.

## Validação pós-correções
1. `npm install` (após F2).
2. `npm run typecheck` + `npm run lint` + `npm run build` + `npm run test` (34+ testes).
3. Acionar `equipe-revisao` (obrigatória e bloqueante).
4. Juiz reavalia e zera/soma o contador de iterações conforme protocolo.
