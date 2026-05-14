---

name: commands-otimizacao
description: commands automáticos for otimizar o fluxo of trabalho dos agentes no OpenCode.
usage: "Execute o comando `/otimizar-[tipo]` no chat of the OpenCode."

---

# commands of Otimização Automática (QRGen API)

Estes commands são atalhos for os agentes realizarem tarefas repetitivas e garantirem a quality of the sistema QRGen. for o fluxo completo of orquestração, utilize `/orquestrar`. for restaurar o contexto após reinicialização, utilize `/iniciar-Project`.

## 🚀 commands Disponíveis

### `/iniciar-Project`

- **Ação**: Reconstrói o contexto completo of the Project após reinicialização ou perda of memória.
- **Objetivo**: Lê o `OPENCODE.md`, varre o Code-fonte e processa todos os documentos in `/docs` for restaurar o estado of conhecimento of the Project.
- **Quando usar**: Sempre ao iniciar a nova sessão ou quando o agent demonstrar desconhecimento sobre o estado atual.
- **Detalhes**: Consulte `commands/iniciar-Project.md`.

### `/orquestrar [tarefa]`

- **Ação**: Aciona o fluxo completo of orquestração multi-agent.
- **Objetivo**: O `organizador-agentes` analisa a tarefa, chama os agentes especialistas na ordem ideal, encaminha for quality-testing e, por fim, for os agentes of documentação.
- **Fluxo**: `organizador-agentes` → agentes especialistas → `quality-testing` → `specialization` (documentação).
- **Detalhes**: Consulte `commands/orquestrar.md`.

### `/otimizar-api`

- **Ação**: Revisa todos os endpoints of the FastAPI in `app/main.py` e `app/routers/`.
- **Objetivo**: Garante que todos tenham Pydantic schemas, logs of GeoIP (se Pro) e Rate Limit (SlowAPI) aplicados correctly.
- **Prompt Interno**: "agent, Execute `/otimizar-api`: Verifique todos os endpoints e garanta que todos tenham decoradores of @limiter e schemas of resposta Pydantic."

### `/otimizar-db`

- **Ação**: Audita o schema SQL no Supabase.
- **Objetivo**: Verifica se as RLS policies (Row Level Security) estão ativas e se os índices for a tabela of `logs_qrcodes` estão otimizados.
- **Prompt Interno**: "agent, Execute `/otimizar-db`: Verifique o arquivo `schema.sql` e sugira índices GIN for buscas rápidas of scans por localização."

### `/otimizar-frontend`

- **Ação**: Limpa o Code `api.js` e `billing.html`.
- **Objetivo**: Remove logs of console desnecessários, minifica o CSS via Tailwind e garante que o Stripe Elements esteja carregando correctly.
- **Prompt Interno**: "agent, Execute `/otimizar-frontend`: Revise o `api.js` for garantir que todas as chamadas `fetch` tenham tratamento of erro `try/catch` e feedback visual no HTML."

### `/otimizar-android`(Apenas If any interesse explícito of the user e na documentação for development mobile)

- **Ação**: Refatora o Code Kotlin/Jetpack Compose.
- **Objetivo**: Garante que as Coroutines estejam no escopo correto (`viewModelScope`) e que o scanner CameraX esteja liberando a câmera após o uso.
- **Prompt Interno**: "agent, Execute `/otimizar-android`: Verifique o `QRCodeScannerActivity.kt` e garanta que o ciclo of vida of the câmera esteja vinculado ao lifecycle of the Compose."

### `/gerar-docs`

- **Ação**: Atualiza a documentação técnica of the Project in `/docs/[DATA-ATUAL]/`.
- **Objetivo**: Sincroniza a documentação with o estado atual of the Code backend e frontend, criando files Markdown organizados por data.
- **Prompt Interno**: "agent, Execute `/gerar-docs`: Read os routers of the FastAPI e os scripts of the frontend for atualizar a especificação técnica of the Project in `docs/[DATA-ATUAL]/specification-qrgen.md`."

## Tabela Resumida of commands

| Comando                | agent Principal          | Propósito                                     |
| ---------------------- | ------------------------- | --------------------------------------------- |
| `/iniciar-Project`     | organizador-agentes       | Restaurar contexto após reinicialização       |
| `/orquestrar [tarefa]` | organizador-agentes       | Fluxo completo: implementação → testing → docs |
| `/otimizar-api`        | python-fastapi-pro        | Auditar endpoints FastAPI                     |
| `/otimizar-db`         | postgresql-supabase-pro   | Auditar schema e RLS no Supabase              |
| `/otimizar-frontend`   | frontend-vanilla-pro      | Limpar e otimizar Code frontend             |
| `/otimizar-android`    | kotlin-android-pro        | Refatorar Code Kotlin/Compose               |
| `/gerar-docs`          | specialist-documentation | Atualizar documentação técnica                |

## Exemplo of Uso

```
# Restaurar contexto ao iniciar o dia of trabalho:
/iniciar-Project

# Implementar a nova feature completa:
/orquestrar Adicionar suporte a QRCode with logo personalizado no centro

# Auditar a API antes of a deploy:
/otimizar-api
```
