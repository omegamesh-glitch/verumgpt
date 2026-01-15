# 🚂 Deploy no Railway - Guia Completo

## 🎯 3 Formas de Deploy:

### 1. **Deploy via GitHub** (Recomendado)
### 2. **Deploy via CLI** (Local)
### 3. **Deploy via Docker Image** (Pré-build)

---

## 📦 Opção 1: Deploy via GitHub (Mais Fácil)

### Passo a Passo:

1. **Fazer push do código para GitHub:**
   ```bash
   # Se ainda não tem repositório Git
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/verumgpt.git
   git push -u origin main
   ```

2. **No Railway Dashboard:**
   - Clique em **New Project**
   - Escolha **Deploy from GitHub**
   - Selecione o repositório `verumgpt`
   - Railway detecta automaticamente Next.js

3. **Configurar Variáveis de Ambiente:**
   - Settings → Variables
   - Adicione:
     ```
     DATABASE_URL=postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway
     OPENAI_API_KEY=sk-proj-...
     OPENAI_API_KEY_BACKUP=sk-proj-...
     DEEPSEEK_API_KEY=sk-70d832c8d50d4ebbb7e4585591d2a89b
     NODE_ENV=production
     ```

4. **Deploy Automático:**
   - Railway faz build e deploy automaticamente
   - Cada push no GitHub gera novo deploy

---

## 💻 Opção 2: Deploy via CLI (Local)

### Instalar Railway CLI:

```bash
brew install railway
```

### Login:

```bash
railway login
```

### Inicializar Projeto:

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"
railway init
```

Isso cria um novo projeto vazio no Railway.

### Deploy:

```bash
railway up
```

O CLI vai:
- Escanear arquivos do projeto
- Comprimir e fazer upload
- Fazer build e deploy no Railway

### Abrir no Dashboard:

```bash
railway open
```

### Configurar Variáveis:

```bash
railway variables set DATABASE_URL="postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway"
railway variables set OPENAI_API_KEY="sk-proj-..."
railway variables set DEEPSEEK_API_KEY="sk-70d832c8d50d4ebbb7e4585591d2a89b"
railway variables set NODE_ENV="production"
```

---

## 🐳 Opção 3: Deploy via Docker Image

### Pré-requisitos:

1. **Build da imagem Docker:**
   ```bash
   docker build -t verumgpt:latest .
   ```

2. **Push para registry:**
   ```bash
   # Docker Hub
   docker tag verumgpt:latest seu-usuario/verumgpt:latest
   docker push seu-usuario/verumgpt:latest
   
   # GitHub Container Registry
   docker tag verumgpt:latest ghcr.io/seu-usuario/verumgpt:latest
   docker push ghcr.io/seu-usuario/verumgpt:latest
   ```

### No Railway Dashboard:

1. **New Project** → **Empty project**
2. **Add a Service** → **Docker Image**
3. **Image name:**
   - Docker Hub: `seu-usuario/verumgpt:latest`
   - GitHub: `ghcr.io/seu-usuario/verumgpt:latest`
   - GitLab: `registry.gitlab.com/seu-usuario/verumgpt:latest`
   - Quay: `quay.io/seu-usuario/verumgpt:latest`
4. **Deploy**

---

## 🎨 O Canvas (Painel de Controle)

Após o deploy, você verá o **Project Canvas**:

- **Infraestrutura**: Todos os serviços
- **Environments**: Ambientes (production, staging, etc.)
- **Deployments**: Histórico de deploys
- **Metrics**: Métricas em tempo real
- **Logs**: Logs do build e deploy

### Gerar Domínio:

1. Clique no serviço
2. Settings → **Generate Domain**
3. Exemplo: `verumgpt-production.up.railway.app`

---

## 🔧 Configurações Importantes:

### Health Checks:

```json
// railway.json
{
  "deploy": {
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100
  }
}
```

### Região (Railway Metal):

```json
// railway.json
{
  "deploy": {
    "region": "us-east-virginia-metal"
  }
}
```

---

## 📋 Checklist de Deploy:

- [ ] Código no GitHub (se usar GitHub deploy)
- [ ] Railway CLI instalado (se usar CLI)
- [ ] Variáveis de ambiente configuradas
- [ ] `DATABASE_URL` configurado
- [ ] `railway.json` criado
- [ ] Build passa localmente: `npm run build`
- [ ] Domínio gerado (opcional)

---

## 🐛 Troubleshooting:

### Build Falha:

1. **Ver logs completos:**
   - Scroll até o topo do log
   - Erros geralmente não estão no final

2. **Verificar:**
   - `package.json` tem `engines.node: "20.x"`
   - Todas dependências instaladas
   - Variáveis de ambiente configuradas

### Deploy Falha:

1. **Verificar logs:**
   ```bash
   railway logs
   ```

2. **Verificar variáveis:**
   ```bash
   railway variables
   ```

3. **Rollback:**
   - No dashboard: Deployments → Rollback

### App não inicia:

1. **Verificar start command:**
   - Deve ser: `npm start`
   - Verificar em Settings → Deploy

2. **Verificar porta:**
   - Next.js usa porta 3000
   - Railway detecta automaticamente

---

## 🚀 Comandos Úteis:

```bash
# Status do projeto
railway status

# Ver logs
railway logs

# Abrir dashboard
railway open

# Listar variáveis
railway variables

# Adicionar variável
railway variables set KEY="value"

# Deploy
railway up

# Ver serviços
railway service
```

---

## ✅ Próximos Passos Após Deploy:

1. **Environments**: Criar ambiente de staging
2. **Observability**: Monitorar métricas e logs
3. **Project Members**: Adicionar membros da equipe
4. **Staged Changes**: Revisar mudanças antes de aplicar

---

## 🎉 Pronto!

Seu projeto VERUM GPT está no ar! 🚀

Acesse: `https://seu-projeto.up.railway.app`
