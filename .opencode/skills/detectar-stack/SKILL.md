---
name: detectar-stack
description: "Detecta tecnologias, frameworks, APIs, Git e CI/CD do projeto atual analisando arquivos de configuração e estrutura."
license: MIT

compatibility: opencode

---

# Skill: Detectar Stack

## Objetivo

Detectar e identificar a stack tecnológica do projeto atual, incluindo frontend, backend, banco de dados, gerenciador de pacotes, Git e CI/CD.

## Quando Usar

- Ao executar `/iniciar` pela primeira vez em um projeto
- Quando se precisa saber quais tecnologias o projeto usa
- Para determinar se Git e Deploy são aplicáveis

## Processo

### 1. Detectar Frontend
Procurar por:
- `package.json` → React, Vue, Angular, Next.js, etc.
- `vite.config.js` → Vite
- `next.config.js` → Next.js
- `angular.json` → Angular
- `vue.config.js` → Vue CLI
- `index.html` → HTML vanilla ou framework

### 2. Detectar Backend
Procurar por:
- `package.json` → Express, Fastify, NestJS, etc.
- `requirements.txt` → Python (Django, Flask, FastAPI)
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml` ou `build.gradle` → Java
- `Gemfile` → Ruby

### 3. Detectar Banco de Dados
Procurar por:
- `prisma/schema.prisma` → Prisma
- `docker-compose.yml` → PostgreSQL, MySQL, MongoDB, Redis
- `knexfile.js` → Knex
- `sequelize` em package.json → Sequelize
- `.env` com `DATABASE_URL` → detectar tipo pela URL

### 4. Detectar Gerenciador de Pacotes
- `package-lock.json` → npm
- `yarn.lock` → Yarn
- `pnpm-lock.yaml` → pnpm
- `bun.lockb` → Bun

### 5. Detectar Git
- `.git/` existe → Git detectado
- `.gitignore` → confirmar Git
- `.github/workflows/` → GitHub Actions detectado

### 6. Detectar APIs/Integrações
Procurar em código por:
- `fetch(`, `axios` → chamadas HTTP
- `process.env.API_KEY` → uso de APIs externas
- `mcp` em configurações → uso de MCP

### 7. Detectar CI/CD
- `.github/workflows/` → GitHub Actions
- `.gitlab-ci.yml` → GitLab CI
- `Jenkinsfile` → Jenkins
- `.circleci/` → CircleCI

## Output Esperado

```markdown
## Stack Detectada

### Frontend
- **Framework**: React 18
- **Build**: Vite
- **CSS**: Tailwind CSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express

### Banco de Dados
- **Tipo**: PostgreSQL
- **ORM**: Prisma

### Gerenciador de Pacotes
- **npm**

### Versionamento
- **Git**: ✅ Detectado
- **CI/CD**: GitHub Actions

### APIs Externas
- **Detectadas**: [lista]

### Conclusão
- Git: ✅ → `/git` disponível
- APIs: ✅ → `/deploy` disponível
```

## Regras

- **SEJA preciso** — Não assuma, verifique
- **REPORTE o que encontrou** e o que não encontrou
- **ATUALIZE** `.opencode/AGENTS.md` com a stack detectada
- **IDENTIFIQUE** se Git e Deploy são aplicáveis