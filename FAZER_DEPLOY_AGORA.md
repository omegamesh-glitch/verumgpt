# 🚀 Fazer Deploy do VERUM Chat GPT AGORA

## ✅ API Key Configurada!

Sua OpenAI API Key já está pronta: `proj_rcJnMHLrCYZgjBNYis9XNerJ`

## 🚀 Deploy Rápido (3 Passos)

### 1️⃣ Navegar para o Projeto

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verum-chat"
```

### 2️⃣ Executar Script de Deploy

```bash
bash deploy.sh
```

O script vai:
- ✅ Verificar pré-requisitos
- ✅ Instalar dependências
- ✅ Criar app Heroku (se necessário)
- ✅ Configurar API key automaticamente
- ✅ Fazer deploy

### 3️⃣ Aguardar Deploy

O deploy leva alguns minutos. Você verá o progresso no terminal.

## 📋 Deploy Manual (Alternativa)

Se preferir fazer manualmente:

```bash
# 1. Login no Heroku
heroku login

# 2. Criar app
heroku create verum-chat

# 3. Configurar API key
heroku config:set OPENAI_API_KEY=proj_rcJnMHLrCYZgjBNYis9XNerJ -a verum-chat

# 4. Inicializar Git (se necessário)
git init
git add .
git commit -m "Deploy VERUM Chat GPT"

# 5. Adicionar remote Heroku
heroku git:remote -a verum-chat

# 6. Deploy
git push heroku main
```

## ✅ Verificar Deploy

Após o deploy:

```bash
# Ver status
heroku ps -a verum-chat

# Ver logs
heroku logs --tail -a verum-chat

# Abrir no navegador
heroku open -a verum-chat
```

## 🧪 Testar Funcionalidades

Após o deploy, teste:

1. ✅ **Chat básico** - Digite uma mensagem
2. ✅ **Upload PDF** - Clique no ícone de clipe
3. ✅ **Voice Input** - Clique no microfone
4. ✅ **TTS** - Clique em "🔊 Read aloud"
5. ✅ **Code** - Peça para gerar código

## 🔗 URL do App

Após deploy, seu app estará em:
- **https://verum-chat.herokuapp.com**

## 🐛 Problemas?

### Build Falha:
```bash
heroku logs --tail -a verum-chat
```

### API Key Não Funciona:
```bash
# Verificar configuração
heroku config -a verum-chat

# Reconfigurar se necessário
heroku config:set OPENAI_API_KEY=proj_rcJnMHLrCYZgjBNYis9XNerJ -a verum-chat
```

### App Não Inicia:
```bash
# Ver logs detalhados
heroku logs --tail -a verum-chat

# Verificar Procfile
cat Procfile
```

## 📝 Checklist

- [x] API Key configurada
- [x] Script de deploy criado
- [x] Documentação completa
- [ ] Deploy executado
- [ ] App funcionando
- [ ] Funcionalidades testadas

## 🎉 Pronto!

Execute `bash deploy.sh` para fazer deploy agora! 🚀
