# 🚂 Comandos Railway - Guia Correto

## 💎 Com Pro Plan você tem acesso a:

### 1. **Criar Ambiente (Sintaxe Correta):**

```bash
railway environment new staging
```

Ou:

```bash
railway env new staging
```

### 2. **Linkar Ambiente:**

```bash
railway environment link staging
```

### 3. **Listar Ambientes:**

```bash
railway environment
```

## 🚀 Migrar para Railway Metal:

### Via Dashboard (Recomendado):

1. Acesse: https://railway.com/project/cf27bf87-3c4c-4f78-bf84-255018c4658e
2. Clique no serviço
3. **Settings** → **Deploy** → **Regions**
4. Selecione região com **"Metal (New)"**
5. Railway faz redeploy automático

### Regiões Recomendadas para Brasil:

- ⭐ **US East (Virginia) [Metal]** - Melhor latência
- **US West (California) [Metal]** - Alternativa

## 📋 Comandos Úteis:

```bash
# Ver status
railway status

# Ver logs
railway logs

# Abrir dashboard
railway open

# Listar variáveis
railway variables

# Adicionar variável
railway variables set KEY="value"

# Ver serviços
railway service

# Deploy
railway up
```

## 💰 Aproveitar Pro Plan:

### 1. **Migrar para Metal** (Economizar 50%!)
- Via dashboard (mais fácil)
- Settings → Deploy → Regions → Metal

### 2. **Criar Ambiente Staging:**

```bash
railway environment new staging
railway environment link staging
railway up
```

### 3. **Monitorar Uso:**
- Dashboard → Observability → Usage

## ✅ Próximo Passo:

**Migre para Railway Metal via Dashboard:**
1. Abra: `railway open`
2. Settings → Deploy → Regions
3. Selecione região Metal
4. Economize 50% em egress! 💰
