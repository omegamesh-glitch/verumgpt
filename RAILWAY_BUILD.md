# 🚂 Railway Build Configuration para VERUM GPT

## 📋 Opções de Build no Railway:

### 1. **Railpack** (Recomendado - Novo)
Railpack analisa seu código e gera imagens otimizadas automaticamente.

### 2. **Dockerfile** (Se você já tem)
Railway detecta automaticamente e usa seu Dockerfile.

### 3. **Nixpacks** (Legado - Deprecated)
Não usar mais.

## 🚀 Configuração Automática (Zero Config)

Railway detecta automaticamente:
- ✅ Next.js project (detecta `package.json` com `next`)
- ✅ Node.js version (usa `engines.node` do package.json)
- ✅ Build command: `npm run build`
- ✅ Start command: `npm start`

## 🔧 Configuração Manual (railway.json)

Crie `railway.json` na raiz do projeto:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "npm run build",
    "watchPatterns": [
      "**/*.ts",
      "**/*.tsx",
      "**/*.js",
      "**/*.jsx"
    ]
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🐳 Opção: Usar Dockerfile

Se preferir controle total, crie um Dockerfile:

```dockerfile
FROM node:20-alpine AS base

# Instalar dependências
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

## ⚙️ Configurar next.config.js para Railway:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necessário para Docker/Railway
  // ... outras configurações existentes
}

module.exports = nextConfig
```

## 🔐 Variáveis de Ambiente no Railway:

Configure no dashboard do Railway:

```
DATABASE_URL=postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway
OPENAI_API_KEY=sk-proj-...
OPENAI_API_KEY_BACKUP=sk-proj-...
DEEPSEEK_API_KEY=sk-70d832c8d50d4ebbb7e4585591d2a89b
NODE_ENV=production
```

## 📦 Deploy no Railway:

### Via CLI:
```bash
# Instalar Railway CLI
brew install railway

# Login
railway login

# Inicializar projeto
railway init

# Link ao projeto existente
railway link

# Deploy
railway up
```

### Via Dashboard:
1. Conecte seu repositório GitHub
2. Railway detecta automaticamente Next.js
3. Configure variáveis de ambiente
4. Deploy automático!

## 🎯 Build Settings no Dashboard:

1. **Builder**: Railpack (automático) ou Dockerfile
2. **Root Directory**: `/` (raiz do projeto)
3. **Build Command**: `npm run build` (automático)
4. **Start Command**: `npm start` (automático)

## ✅ Checklist para Deploy:

- [ ] `package.json` tem `engines.node: "20.x"`
- [ ] `next.config.js` tem `output: 'standalone'` (se usar Dockerfile)
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] `DATABASE_URL` configurado
- [ ] Build passa localmente: `npm run build`
