# 🐳 Docker Setup para VERUM GPT

## 📦 Exemplos de Registry de Containers:

```
hello-world
ghcr.io/username/repo:latest
quay.io/username/repo:tag
registry.gitlab.com/username/repo:tag
mcr.microsoft.com/username/repo:tag
```

## 🚀 Criar Dockerfile para o projeto:

### Dockerfile básico para Next.js:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild do código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## 🔧 Configurar next.config.js para Docker:

```javascript
// next.config.js
module.exports = {
  output: 'standalone', // Necessário para Docker
  // ... outras configurações
}
```

## 📝 .dockerignore:

```
node_modules
.next
.git
.env.local
.env*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.pem
```

## 🏗️ Build e Push da imagem:

### 1. Build local:
```bash
docker build -t verumgpt:latest .
```

### 2. Tag para registry:
```bash
# GitHub Container Registry
docker tag verumgpt:latest ghcr.io/seu-usuario/verumgpt:latest

# Docker Hub
docker tag verumgpt:latest seu-usuario/verumgpt:latest

# Railway
docker tag verumgpt:latest railway.app/verumgpt:latest
```

### 3. Push:
```bash
# GitHub Container Registry
docker push ghcr.io/seu-usuario/verumgpt:latest

# Docker Hub
docker push seu-usuario/verumgpt:latest
```

## 🚂 Deploy no Railway com Docker:

### Opção 1: Railway detecta Dockerfile automaticamente
```bash
railway init
railway up
```

### Opção 2: Usar imagem do registry
No Railway, configure:
- **Image**: `ghcr.io/seu-usuario/verumgpt:latest`
- **Registry**: GitHub Container Registry
- **Variables**: Adicione `DATABASE_URL` e outras env vars

## 📋 docker-compose.yml (desenvolvimento local):

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
    volumes:
      - .:/app
      - /app/node_modules
```

## 🎯 Comandos úteis:

```bash
# Build
docker build -t verumgpt .

# Run local
docker run -p 3000:3000 --env-file .env.local verumgpt

# Ver logs
docker logs <container-id>

# Entrar no container
docker exec -it <container-id> sh
```
