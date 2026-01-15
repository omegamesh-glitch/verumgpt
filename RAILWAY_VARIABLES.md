# 🔐 Variáveis de Ambiente - Railway

## 📋 Variáveis do Sistema (Automáticas):

Railway fornece estas 7 variáveis automaticamente:

1. `RAILWAY_PROJECT_NAME` - Nome do projeto
2. `RAILWAY_ENVIRONMENT_NAME` - Nome do ambiente (production, staging, etc.)
3. `RAILWAY_SERVICE_NAME` - Nome do serviço
4. `RAILWAY_PROJECT_ID` - ID do projeto
5. `RAILWAY_ENVIRONMENT_ID` - ID do ambiente
6. `RAILWAY_SERVICE_ID` - ID do serviço
7. `RAILWAY_PRIVATE_DOMAIN` - Domínio privado do serviço

## ✅ Variáveis Necessárias para VERUM GPT:

### 1. Via Dashboard (Recomendado):

No dashboard do Railway:

1. Vá em **Variables** (já está lá)
2. Clique em **New Variable**
3. Adicione uma por uma:

#### Variáveis Obrigatórias:

```
DATABASE_URL = postgresql://postgres:YOUR_DB_PASSWORD@interchange.proxy.rlwy.net:20105/railway
```

```
DEEPSEEK_API_KEY = YOUR_DEEPSEEK_API_KEY
```

```
NODE_ENV = production
```

#### Variáveis Opcionais (mas recomendadas):

```
OPENAI_API_KEY = YOUR_OPENAI_API_KEY
```

```
OPENAI_API_KEY_BACKUP = YOUR_OPENAI_API_KEY_BACKUP
```

### 2. Via Raw Editor (Mais Rápido):

1. Clique em **Raw Editor**
2. Cole este conteúdo:

```env
# IMPORTANTE: Substitua os valores abaixo com suas próprias chaves
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@interchange.proxy.rlwy.net:20105/railway
DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
NODE_ENV=production
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_API_KEY_BACKUP=YOUR_OPENAI_API_KEY_BACKUP
```

3. Clique em **Save** ou **Import**

### 3. Via CLI:

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

# Linkar serviço primeiro (se ainda não linkou)
railway service

# Adicionar variáveis
# IMPORTANTE: Substitua os valores abaixo com suas próprias chaves
railway variables set DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@interchange.proxy.rlwy.net:20105/railway"
railway variables set DEEPSEEK_API_KEY="YOUR_DEEPSEEK_API_KEY"
railway variables set NODE_ENV="production"
railway variables set OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
railway variables set OPENAI_API_KEY_BACKUP="YOUR_OPENAI_API_KEY_BACKUP"
```

## 📝 Checklist:

- [ ] `DATABASE_URL` - Conexão com PostgreSQL
- [ ] `DEEPSEEK_API_KEY` - Chave da API DeepSeek
- [ ] `NODE_ENV` - Ambiente (production)
- [ ] `OPENAI_API_KEY` - Chave OpenAI (opcional, para TTS/STT)
- [ ] `OPENAI_API_KEY_BACKUP` - Backup OpenAI (opcional)

## ⚠️ Importante:

- **Não compartilhe** essas chaves publicamente
- As variáveis são **sensíveis** e devem ser mantidas em segredo
- Railway criptografa as variáveis automaticamente

## 🔄 Após Adicionar Variáveis:

1. **Redeploy automático**: Railway pode fazer redeploy automaticamente
2. **Ou manualmente**: Vá em Deployments → Redeploy
3. **Verificar logs**: `railway logs` para ver se está funcionando

## ✅ Verificar se Funcionou:

```bash
railway variables
```

Ou no dashboard, você deve ver todas as variáveis listadas.
