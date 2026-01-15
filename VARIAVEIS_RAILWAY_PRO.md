# 🔐 Variáveis de Ambiente - Railway Pro

## 📋 Variáveis Existentes (Já Configuradas)

✅ `DEEPSEEK_API_KEY` - Chave DeepSeek  
✅ `OPENAI_API_KEY` - Chave OpenAI principal  
✅ `OPENAI_API_KEY_BACKUP` - Chave OpenAI backup  
✅ `NODE_ENV` - Ambiente (production)

---

## 🚀 Novas Variáveis para Railway Pro

### 1. **Performance e Recursos** (Aproveitando 32GB RAM / 32 vCPU)

```bash
# Limites de PDF otimizados
PDF_MAX_SIZE_MB=100
PDF_MAX_PAGES=1000
PDF_MAX_CONCURRENT=10

# Worker threads (aproveitar 32 vCPU)
WORKER_THREADS=8
MAX_CONCURRENT_REQUESTS=50

# Memory limits
NODE_OPTIONS=--max-old-space-size=16384
```

### 2. **Banco de Dados PostgreSQL** (Para histórico e cache)

```bash
# Se já tiver PostgreSQL no Railway
DATABASE_URL=postgresql://postgres:password@host:port/dbname

# Ou criar novo PostgreSQL
# Vá em Railway Dashboard → New → Database → PostgreSQL
```

### 3. **Cache Redis** (Para cache rápido)

```bash
# Criar Redis no Railway
REDIS_URL=redis://default:password@host:port

# Ou usar Railway Redis
# Vá em Railway Dashboard → New → Database → Redis
```

### 4. **Analytics e Monitoramento**

```bash
# Analytics
ENABLE_ANALYTICS=true
ANALYTICS_RETENTION_DAYS=90

# Error tracking (opcional - Sentry)
SENTRY_DSN=your_sentry_dsn_here

# Logging
LOG_LEVEL=info
ENABLE_DETAILED_LOGS=true
```

### 5. **Multi-Região e CDN**

```bash
# Regiões ativas
ACTIVE_REGIONS=us-east-virginia,europe-west-amsterdam,southeast-asia-singapore

# CDN
CDN_ENABLED=true
CDN_CACHE_TTL=86400
```

### 6. **Recursos Avançados**

```bash
# OCR para PDFs escaneados
ENABLE_OCR=true
OCR_PROVIDER=tesseract

# Busca semântica (Vector DB)
VECTOR_DB_ENABLED=false
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment

# Rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### 7. **Autenticação e Usuários** (Futuro)

```bash
# NextAuth.js
NEXTAUTH_URL=https://zestful-eagerness-production.up.railway.app
NEXTAUTH_SECRET=your_secret_here

# OAuth Providers (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 8. **APIs Externas Adicionais**

```bash
# Claude API (se quiser adicionar)
ANTHROPIC_API_KEY=your_anthropic_key

# Gemini API (se quiser adicionar)
GOOGLE_AI_API_KEY=your_google_ai_key

# Web Search (se usar serviço pago)
SERPER_API_KEY=your_serper_key
Tavily_API_KEY=your_tavily_key
```

---

## 📝 Como Adicionar no Railway

### Opção 1: Via Dashboard (Recomendado)

1. Acesse: https://railway.com/project/cf27bf87-3c4c-4f78-bf84-255018c4658e
2. Vá em **Variables**
3. Clique em **New Variable**
4. Adicione uma por uma

### Opção 2: Via CLI (Rápido)

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

# Performance
railway variables set PDF_MAX_SIZE_MB=100
railway variables set PDF_MAX_PAGES=1000
railway variables set PDF_MAX_CONCURRENT=10
railway variables set WORKER_THREADS=8
railway variables set NODE_OPTIONS="--max-old-space-size=16384"

# Analytics
railway variables set ENABLE_ANALYTICS=true
railway variables set LOG_LEVEL=info

# Recursos
railway variables set ENABLE_OCR=true
railway variables set RATE_LIMIT_ENABLED=true
```

### Opção 3: Via Raw Editor (Mais Rápido para Múltiplas)

1. No dashboard do Railway → **Variables**
2. Clique em **Raw Editor**
3. Cole todas as variáveis de uma vez
4. Clique em **Save**

---

## 🎯 Variáveis Prioritárias (Adicionar Primeiro)

### Essenciais para Railway Pro:

1. ✅ **PDF_MAX_SIZE_MB=100** - Aumentar limite de PDF
2. ✅ **PDF_MAX_PAGES=1000** - Mais páginas por PDF
3. ✅ **PDF_MAX_CONCURRENT=10** - Processar múltiplos PDFs
4. ✅ **WORKER_THREADS=8** - Aproveitar 32 vCPU
5. ✅ **NODE_OPTIONS=--max-old-space-size=16384** - Usar mais RAM (16GB)

### Opcionais (mas recomendadas):

6. **ENABLE_ANALYTICS=true** - Coletar métricas
7. **LOG_LEVEL=info** - Logs detalhados
8. **RATE_LIMIT_ENABLED=true** - Proteção contra abuso

---

## 🔄 Após Adicionar Variáveis

1. **Redeploy automático**: Railway pode fazer redeploy automaticamente
2. **Ou manualmente**: Vá em Deployments → Redeploy
3. **Verificar logs**: `railway logs` para ver se está funcionando

---

## ✅ Checklist

### Variáveis Básicas (Já Configuradas):
- [x] DEEPSEEK_API_KEY
- [x] OPENAI_API_KEY
- [x] OPENAI_API_KEY_BACKUP
- [x] NODE_ENV

### Variáveis Railway Pro (Adicionar):
- [ ] PDF_MAX_SIZE_MB=100
- [ ] PDF_MAX_PAGES=1000
- [ ] PDF_MAX_CONCURRENT=10
- [ ] WORKER_THREADS=8
- [ ] NODE_OPTIONS=--max-old-space-size=16384
- [ ] ENABLE_ANALYTICS=true
- [ ] LOG_LEVEL=info
- [ ] RATE_LIMIT_ENABLED=true

### Variáveis Avançadas (Futuro):
- [ ] DATABASE_URL (PostgreSQL)
- [ ] REDIS_URL (Redis)
- [ ] NEXTAUTH_SECRET (Autenticação)
- [ ] SENTRY_DSN (Error tracking)

---

**Status**: ✅ Documento criado com todas as variáveis recomendadas!

**Próximo passo**: Adicionar as variáveis prioritárias via CLI ou Dashboard
