# 🚀 Guia Rápido - Deploy no Heroku

## ✅ Status Atual

- ✅ Remote Heroku configurado: `verumnodelegacys`
- ✅ Repositório limpo (sem mudanças pendentes)
- ✅ Último deploy: v46 (sucesso)

---

## 📋 Comandos Úteis

### 1. Fazer Login no Heroku
```bash
heroku login
```
(Pressione qualquer tecla para abrir o browser e fazer login)

### 2. Verificar Status
```bash
# Ver apps Heroku
heroku apps

# Ver logs em tempo real
heroku logs --tail -a verumnodelegacys

# Ver config vars (variáveis de ambiente)
heroku config -a verumnodelegacys
```

### 3. Fazer Deploy
```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Deploy para Heroku
git push heroku main
```

### 4. Verificar Deploy
```bash
# Abrir app no browser
heroku open -a verumnodelegacys

# Ver status do app
heroku ps -a verumnodelegacys
```

---

## 🔑 Variáveis de Ambiente Importantes

Verificar se estão configuradas:
```bash
heroku config -a verumnodelegacys
```

Deve ter:
- `OPENAI_API_KEY` ✅
- `DEEPSEEK_API_KEY` (opcional)
- `NODE_ENV=production`

---

## 📱 URL do App

**Produção:** https://verumnodelegacys-f1d58c4993f8.herokuapp.com/

---

## ⚡ Deploy Rápido (Tudo em Um)

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"
git add -A
git commit -m "Update: [descreva as mudanças]"
git push heroku main
```

---

## 🐛 Troubleshooting

### Se o deploy falhar:
```bash
# Ver logs detalhados
heroku logs --tail -a verumnodelegacys

# Verificar build
heroku builds -a verumnodelegacys
```

### Se precisar reiniciar:
```bash
heroku restart -a verumnodelegacys
```

---

## ✅ Tudo Pronto!

O app está funcionando e deployado! 🎉
