# 🔑 Configurar OpenAI API Key

## ✅ Nova API Key Recebida

Sua API key foi configurada. Agora você precisa configurá-la no Heroku antes de fazer deploy.

## 🚀 Configurar no Heroku

### Opção 1: Via Script de Deploy

O script `deploy.sh` já está preparado. Execute:

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verum-chat"
export OPENAI_API_KEY=proj_rcJnMHLrCYZgjBNYis9XNerJ
bash deploy.sh
```

### Opção 2: Configurar Manualmente

```bash
# 1. Criar app (se ainda não existe)
heroku create verum-chat

# 2. Configurar API key
heroku config:set OPENAI_API_KEY=proj_rcJnMHLrCYZgjBNYis9XNerJ -a verum-chat

# 3. Verificar configuração
heroku config -a verum-chat
```

## 🧪 Testar Localmente

Antes de fazer deploy, você pode testar localmente:

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verum-chat"

# Criar arquivo .env.local
echo "OPENAI_API_KEY=proj_rcJnMHLrCYZgjBNYis9XNerJ" > .env.local

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## ✅ Verificar Configuração

Após configurar no Heroku:

```bash
heroku config -a verum-chat
```

Você deve ver:
```
OPENAI_API_KEY: proj_rcJnMHLrCYZgjBNYis9XNerJ
```

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- Nunca commite a API key no Git
- Use apenas variáveis de ambiente
- A chave está no `.gitignore` para segurança

## 📝 Próximos Passos

1. ✅ API Key recebida
2. ⏭️ Configurar no Heroku
3. ⏭️ Fazer deploy
4. ⏭️ Testar funcionalidades
