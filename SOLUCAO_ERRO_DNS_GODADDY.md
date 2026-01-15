# 🔧 Solução: Erro ao Adicionar CNAME na GoDaddy

## ❌ Erro que você teve:
```
Nome: WebsiteBuilder Site  ← ERRADO!
Valor: 21xzh15l.up.railway.app
Erro: "Não foi possível adicionar o registro"
```

---

## ✅ SOLUÇÃO 1: Corrigir o Nome

### O nome deve ser `@` ou deixar em branco:

1. **Tipo**: `CNAME`
2. **Nome**: `@` (ou deixe em **branco/vazio**)
   - ❌ NÃO use "WebsiteBuilder Site"
   - ✅ Use `@` ou deixe vazio
3. **Valor**: `21xzh15l.up.railway.app`
4. **TTL**: `1 semana` ou `600`
5. **Salvar**

---

## ⚠️ SOLUÇÃO 2: Se ainda der erro (CNAME no root)

A GoDaddy pode não permitir CNAME no domínio raiz (@) se já existe um registro A.

### Passo a Passo:

1. **PRIMEIRO**: Remova o registro A existente
   - Encontre: `A: @ → WebsiteBuilder Site`
   - Clique em **Editar** ou **Remover**
   - **Remova** esse registro

2. **DEPOIS**: Adicione o CNAME
   - Tipo: `CNAME`
   - Nome: `@` (ou deixe vazio)
   - Valor: `21xzh15l.up.railway.app`
   - TTL: `1 semana`
   - Salvar

---

## 🔄 SOLUÇÃO 3: Se GoDaddy não permitir CNAME no root

Alguns provedores DNS não permitem CNAME no domínio raiz. Nesse caso:

### Opção A: Usar Cloudflare (Gratuito - Recomendado)

1. Crie conta gratuita em: https://www.cloudflare.com/
2. Adicione o domínio `verumnodelegacy.com`
3. Cloudflare vai copiar os registros da GoDaddy
4. Mude os nameservers na GoDaddy para os do Cloudflare
5. No Cloudflare, adicione CNAME:
   - Nome: `@`
   - Valor: `21xzh15l.up.railway.app`
   - Proxy: Desligado (não usar proxy)
6. Cloudflare permite CNAME no root!

### Opção B: Usar Subdomínio

1. Na GoDaddy, adicione CNAME:
   - Nome: `app`
   - Valor: `21xzh15l.up.railway.app`
2. Acesse via: https://app.verumnodelegacy.com
3. Configure redirecionamento de `verumnodelegacy.com` para `app.verumnodelegacy.com`

---

## 📋 Checklist para Resolver:

### Tentar Primeiro:
- [ ] Nome está como `@` ou vazio (não "WebsiteBuilder Site")
- [ ] Tipo é `CNAME` (não A)
- [ ] Valor é `21xzh15l.up.railway.app`
- [ ] Registro A antigo foi removido primeiro

### Se não funcionar:
- [ ] Considerar usar Cloudflare (permite CNAME no root)
- [ ] Ou usar subdomínio `app.verumnodelegacy.com`

---

## 🎯 Resumo Rápido:

**O que está errado:**
- Nome: "WebsiteBuilder Site" ❌

**O que deve ser:**
- Nome: `@` ou vazio ✅
- Tipo: `CNAME` ✅
- Valor: `21xzh15l.up.railway.app` ✅

**Se der erro:**
1. Remova o registro A primeiro
2. Depois adicione o CNAME
3. Ou use Cloudflare

---

**Tente novamente com o nome correto (`@` ou vazio)!** 🚀
