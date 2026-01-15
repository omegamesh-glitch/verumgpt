# 🔧 Configurar DNS GoDaddy - Quando pede "blog ou loja"

## 📋 Se a GoDaddy pedir "Nome blog ou loja":

### ✅ IGNORE essa opção!

Essa opção é para outros serviços da GoDaddy. Para o Railway, você precisa:

---

## 🎯 Configuração Correta:

### 1. Remover registro A antigo:

1. Encontre: `A: @ → WebsiteBuilder Site`
2. **Remova** esse registro primeiro

### 2. Adicionar CNAME:

1. Clique em **Adicionar registro**
2. **Tipo**: Selecione `CNAME` (não A, não blog, não loja)
3. **Nome**: 
   - Deixe em **branco/vazio** OU
   - Digite apenas `@`
   - ❌ NÃO selecione "blog" ou "loja"
4. **Valor**: `21xzh15l.up.railway.app`
5. **TTL**: `1 semana` ou `600`
6. **Salvar**

---

## 📝 Campos na GoDaddy:

```
Tipo: [CNAME]          ← Selecione CNAME
Nome: [@] ou [vazio]   ← Deixe vazio ou @ (não blog/loja)
Valor: 21xzh15l.up.railway.app
TTL: 1 semana
```

---

## ⚠️ Se não tiver opção CNAME:

Algumas interfaces da GoDaddy podem não mostrar CNAME diretamente. Nesse caso:

### Opção 1: Buscar por "CNAME" ou "Alias"
- Procure por "Alias" ou "CNAME" nas opções
- Ou "Registro CNAME"

### Opção 2: Usar Cloudflare (Mais fácil)
1. Crie conta gratuita: https://www.cloudflare.com/
2. Adicione domínio `verumnodelegacy.com`
3. Mude nameservers na GoDaddy
4. No Cloudflare, adicione CNAME facilmente

---

## ✅ O que você precisa:

- **Tipo**: `CNAME` (não A, não blog, não loja)
- **Nome**: Vazio ou `@`
- **Valor**: `21xzh15l.up.railway.app`

---

## 🆘 Se ainda não funcionar:

### Use Cloudflare (Recomendado - Gratuito):

1. **Criar conta**: https://www.cloudflare.com/ (gratuito)
2. **Adicionar site**: `verumnodelegacy.com`
3. **Cloudflare vai copiar** registros da GoDaddy
4. **Mudar nameservers** na GoDaddy para os do Cloudflare
5. **No Cloudflare**: Adicionar CNAME
   - Nome: `@`
   - Valor: `21xzh15l.up.railway.app`
   - Proxy: **Desligado** (não usar proxy)
6. **Pronto!** Cloudflare permite CNAME no root facilmente

---

## 📋 Resumo:

❌ **NÃO use**: "blog" ou "loja"  
✅ **USE**: Tipo `CNAME`, Nome vazio ou `@`

**Se não conseguir na GoDaddy, use Cloudflare!** 🚀
