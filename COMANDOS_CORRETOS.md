# ✅ Comandos Railway - Guia Correto

## ⚠️ Erro Comum:

**NÃO execute comentários como comandos!**

❌ **ERRADO:**
```bash
railway up
# Teste suas mudanças
railway environment link production  # Volta para produção
```

✅ **CORRETO:**
```bash
railway up
railway environment link production
```

## 🔄 Comandos Corretos:

### 1. **Ver Status:**
```bash
railway status
```

### 2. **Linkar Ambiente:**
```bash
railway environment link staging
# ou
railway environment link production
```

### 3. **Fazer Deploy:**
```bash
railway up
```

### 4. **Ver Logs:**
```bash
railway logs
```

## 🚀 Fluxo Completo:

### **Para Testar no Staging:**
```bash
# 1. Linkar staging
railway environment link staging

# 2. Fazer deploy
railway up

# 3. Testar no domínio staging
```

### **Para Voltar para Production:**
```bash
# 1. Linkar production
railway environment link production

# 2. Fazer deploy
railway up
```

## ⚠️ Sobre o Erro 404:

O erro "Failed to upload code with status code 404" pode acontecer se:
- O serviço não está linkado corretamente
- Há problema de permissões
- O projeto precisa ser re-linkado

### **Solução:**
```bash
# Verificar link
railway status

# Re-linkar se necessário
railway link

# Tentar deploy novamente
railway up
```

## 💡 Dica:

Execute **um comando por vez** e aguarde completar antes do próximo!
