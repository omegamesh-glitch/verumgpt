FROM node:20-alpine AS base

# Otimizações para Bare Metal: usar mais cores e paralelismo
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# Instalar dependências apenas quando necessário
FROM base AS deps
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
# Otimizado para Bare Metal: builds mais rápidos com NVMe SSD
RUN npm ci --prefer-offline --no-audit --progress=false --loglevel=error

# Rebuild do código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetria do Next.js e otimizar build para Bare Metal
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Bare Metal tem CPUs mais poderosas - usar mais memória para build
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Otimizar para múltiplos cores (Bare Metal tem mais cores)
ENV NODE_OPTIONS="$NODE_OPTIONS --experimental-worker"

# Build da aplicação com otimizações para Bare Metal
RUN npm run build

# Imagem de produção otimizada para Bare Metal
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Otimizações de Node.js para Bare Metal (mais recursos disponíveis)
ENV NODE_OPTIONS="--enable-source-maps --max-old-space-size=2048 --experimental-worker"
# Otimizar garbage collection para Bare Metal
ENV NODE_OPTIONS="$NODE_OPTIONS --gc-interval=100"
# Timeout para graceful shutdown
ENV GRACEFUL_SHUTDOWN_TIMEOUT=30000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public

# Copiar arquivos standalone se existirem, senão copiar .next completo
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Health check otimizado para Bare Metal (mais frequente e robusto)
HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', {timeout: 3000}, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Usar exec para melhor signal handling (graceful shutdown)
CMD ["node", "server.js"]
