# Soluções e Recomendações — 2026-08-15_stage_materializar

## Problema Principal
O Juiz foi acionado para avaliar uma execução que ainda não ocorreu. O workspace está vazio e nenhum agente executou as tarefas descritas.

## Soluções Propostas

### 1. Executar o comando antes de auditar
**Ação**: O usuário reenvia a demanda ao Orquestrador para que os agentes executem.
**Impacto**: 100% de relevância no relatório do Juiz.
**Responsável**: Orquestrador + agentes Tier 1/2/3.

### 2. Inicializar contexto do projeto
**Ação**: Executar `/iniciar` para criar `/docs/management/` e `.opencode/context/`.
**Impacto**: reduz 60-80% dos tokens de releitura em rodadas futuras.
**Responsável**: Orquestrador via skill `ler-contexto-projeto`.

### 3. Criar manifesto de intenção
**Ação**: Ativar `@agente-de-intencao` para definir o que é "Stage Chub", escopo, anti-objetivos e critério de fidelidade.
**Impacto**: previne alucinações sobre funcionalidades inexistentes.
**Responsável**: `@agente-de-intencao`.

### 4. Detectar stack real
**Ação**: Ativar `detectar-stack` para confirmar tecnologias antes de materializar código.
**Impacto**: elimina inferências defasadas sobre React/Express/etc.
**Responsável**: Orquestrador ou arquiteto-geral.

### 5. Inicializar Git e definir estratégia de branches
**Ação**: `@devops` verifica/cria repositório Git e define branches old/dev/main antes de gerenciá-las.
**Impacto**: evita operações em repositório inexistente.
**Responsável**: `@devops`.

### 6. Dividir a demanda em fases
**Ação**: Separar em (a) organização de pastas, (b) pesquisa Chub/GitHub, (c) materialização de código, (d) gerenciamento Git.
**Impacto**: reduz janela de contexto e facilita revisão por partes.
**Responsável**: `@planejador-primario`.

## Fluxo de Melhoria Sugerido
```
Usuário reenvia demanda ao Orquestrador
  → /iniciar
    → @agente-de-intencao (manifesto)
      → @planejador-primario (perguntas + plano)
        → tradutor-tiers (contratos JSON)
          → @arquiteto-geral (distribuição)
            → Tier 2/3 executam
              → skill equipe-revisao
                → Juiz avalia execução real
```
