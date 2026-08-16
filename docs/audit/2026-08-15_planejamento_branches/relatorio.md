# 📊 Relatório do Juiz — Planejamento de Branches (2026-08-15)

**Pasta:** `/docs/audit/2026-08-15_planejamento_branches/`
**Objeto:** Decisão do usuário de renomear branches (`main`→`old-v1`, `master`→`old-v2`) e novas etapas futuras (polir F1–F4, `npm run dev`). Avaliar se o Orquestrador guiou corretamente e se a governança foi respeitada.

---

## Comando Observado
- **Decisão observada:** planejamento de branches + etapas futuras (sem implementação de código nesta rodada).
- **Duração:** ~2 min (avaliação de estado Git e docs de gestão).
- **Tokens (est.):** ~5.000.

## Agentes Ativados
| Agente | Tier | Tempo | Tokens (est.) | Status |
|---|---|---|---|---|
| juiz | Meta | ~2 min | ~5.000 | Avaliando |
| orquestrador | T0 | — | — | Guiou decisão (não implementou) |
| devops | T3 | — | — | Não executado ainda |

---

## Estado Fático do Git (dados crus)

### Remote `origin` (GitHub `Travelmond/Eros-Status-Stage`)
| Ref | Commit |
|---|---|
| `origin/HEAD` | `ref: refs/remotes/origin/main` (default = `main`) |
| `origin/main` | `038a33b20feeb547eaffcd7b6239f05451f8af96` |
| `origin/master` | `f87dcb94af064a14861a88afaa14c95aa588e145` |

> ⚠️ **`main` e `master` têm commits DIFERENTES** — há duas versões antigas distintas no remoto.

### Branches locais (`refs/heads/`)
| Branch | Commit |
|---|---|
| `dev` | `692c5711...` (código novo, pós-Tribunal) |
| `main` | `038a33b...` (= origin/main) |
| `old` | `038a33b...` (duplicata de main) |

> `master` **não existe localmente** — só no remoto.

### `.git/config`
- `[branch "old"] merge = refs/heads/main` — tracking **incorreto** (risco de push de `old` → `origin/main`).
- `[branch "main"] merge = refs/heads/main`.
- `HEAD` → `refs/heads/dev`.

---

## Avaliação da Decisão

### ✅ Acertos do Orquestrador
- **Corrigiu a premissa incompleta da estratégia original** (`old`/`dev`/`main`): o remoto possui **duas** versões antigas (`main` 038a33b e `master` f87dcb94) com conteúdo distinto. A estratégia de um único `old` **ignorava** `master`.
- **Nomenclatura versionada** (`old-v1`/`old-v2`) é mais clara e **fiel ao anti-objetivo** "não descartar a versão antiga do GitHub".
- **Polir F1–F4** alinha-se às ressalvas do Tribunal (M1/M10/M13/README), não bloqueantes.
- **`npm run dev`** atende ao critério de fidelidade nº 2 do manifesto ("executar sem erros fatais").

### ❌ Problemas / Lacunas de Governança
- 🔴 **Manifesto e contrato T04 desatualizados** — `manifesto_de_intencao.md` §5.5/§7, `docs/deployment/branch-strategy.md`, `implementacao.md` e `tarefas.md` ainda descrevem `old`/`dev`/`main`. A mudança de nomenclatura **não foi propagada** (nenhum `sync-context`, nenhuma atualização via `@agente-de-intencao`/`tradutor-tiers`).
- 🟠 **Destino da branch `main` indefinido** — renomear `main`→`old-v1` elimina a branch estável. Não foi definido qual será a nova `main` (recriada vazia? `dev` promovida?). O anti-objetivo "não modificar `main` sem autorização" e o fluxo `dev`→`main` ficam sem ancoragem.
- 🟠 **`master` não existe localmente** — renomear `master`→`old-v2` exige `fetch`/`checkout` do remoto antes; operação não trivial, não detalhada.
- 🟡 **Branch local `old` redundante** — `old` (038a33b) duplica o que será `old-v1`. Destino da `old` local (remover? renomear?) não foi tratado.
- 🟡 **Impacto em workflows** — `.github/workflows/deploy.yml` dispara em `push: [main]`. Renomear `main` quebra o deploy de produção até reconfiguração.
- 🟡 **Default branch do GitHub** — `origin/HEAD`→`origin/main`; renomear exige mudança de default no GitHub.
- 🟡 **Bug de tracking não corrigido** — `[branch "old"] merge = refs/heads/main` persiste; risco de push acidental para `origin/main`.

### 🧠 Alucinações Detectadas
- **Nenhuma alucinação técnica** — a decisão é consistente com o estado real do Git (duas versões antigas distintas). Não houve invenção de branches inexistentes nem negação de `master`.

### 💰 Análise de Tokens
- Total: ~5.000. Desperdício: **baixo** — leitura de `.git/` e docs foi necessária para validar o estado.
- Ponto de atenção: a ausência de `sync-context` gerará re-leitura de contexto em rodadas futuras (custo evitável).

### 📈 Recomendações Estruturais
1. **Atualizar manifesto** (§5.5/§7) e contrato T04 para refletir `old-v1`/`old-v2` + definir a nova branch estável.
2. **Definir explicitamente o destino de `main`** (recriar vazia ou promover `dev`) antes de qualquer push.
3. **Resolver `old` local** (remover/renomear) para evitar duplicata com `old-v1`.
4. **Corrigir tracking** em `.git/config` (remover `merge = refs/heads/main` de `old`).
5. **Atualizar `deploy.yml`** após renomear `main` (novo gatilho de produção).
6. **Executar `sync-context`** ao concluir o planejamento.

---

## Veredito do Juiz

**Governança parcialmente respeitada.** A decisão em si é **tecnicamente correta e fiel ao objetivo de preservação** (identifica as duas versões antigas reais). Contudo, o Orquestrador **não propagou** a mudança para o manifesto, contrato T04 e docs de gestão, e deixou **ambiguidades críticas** sem esclarecer (destino da `main` estável, `master` local, `old` local, workflow de produção). Como esta rodada é de planejamento (sem implementação), **não há loop de revisão nem acionamento do Tribunal**.

**Resumo:**
- Renomear `main`→`old-v1` e `master`→`old-v2`: ✅ correto e preserva as duas versões antigas.
- Polir F1–F4: ✅ alinhado às ressalvas do Tribunal.
- `npm run dev`: ✅ alinhado ao critério de fidelidade.
- Governança (docs/contratos/manifesto): ❌ não sincronizada — pendência bloqueante antes de executar os renames.
- Tribunal: não acionado (não se aplica — sem 3ª iteração).
