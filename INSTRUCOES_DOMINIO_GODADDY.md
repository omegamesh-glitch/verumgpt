# 🌐 Instruções Rápidas - Configurar verumnodelegacy.com

## 🚀 Passo a Passo Simplificado

### 1️⃣ No Railway Dashboard:

1. Acesse: https://railway.com/project/cf27bf87-3c4c-4f78-bf84-255018c4658e
2. Clique no serviço **zestful-eagerness**
3. Vá em **Settings** → **Networking**
4. Em **Custom Domains**, clique em **Generate Domain** ou **Add Domain**
5. Digite: `verumnodelegacy.com`
6. **Anote o CNAME** que Railway fornecer (ex: `xxxxxx.railway.app`)

---

### 2️⃣ Na GoDaddy:

1. Acesse: https://www.godaddy.com/
2. Faça login
3. Vá em **Meus Produtos** → Encontre **verumnodelegacy.com** → **DNS** ou **Gerenciar DNS**

#### Adicionar CNAME:

1. Clique em **Adicionar** ou **+**
2. **Tipo**: CNAME
3. **Nome/Host**: `@` (ou deixe em branco para domínio raiz)
4. **Valor/Ponteiro**: `[CNAME que Railway forneceu]` (ex: `xxxxxx.railway.app`)
5. **TTL**: `600` (10 minutos)
6. **Salvar**

#### Para www (Opcional):

1. Adicione outro CNAME:
   - **Nome**: `www`
   - **Valor**: `[mesmo CNAME do Railway]`
   - **TTL**: `600`

---

### 3️⃣ Aguardar:

- ⏱️ **5-30 minutos** para DNS propagar
- 🔒 **SSL será ativado automaticamente** pelo Railway
- ✅ Teste em: https://verumnodelegacy.com

---

### 4️⃣ Verificar:

```bash
# Verificar DNS
nslookup verumnodelegacy.com

# Testar site
curl -I https://verumnodelegacy.com
```

---

## ✅ Checklist Rápido

- [ ] Domínio adicionado no Railway
- [ ] CNAME anotado
- [ ] CNAME adicionado na GoDaddy (nome: @)
- [ ] CNAME para www adicionado (opcional)
- [ ] Aguardado 5-30 minutos
- [ ] Site acessível em https://verumnodelegacy.com
- [ ] SSL funcionando (cadeado verde)

---

## 🆘 Problemas?

### DNS não propagou:
- Aguarde mais tempo (pode levar até 48h, mas raro)
- Verifique se CNAME está correto na GoDaddy
- Use https://dnschecker.org/ para verificar propagação global

### SSL não funciona:
- Aguarde 5-15 minutos após DNS propagar
- Railway gera certificado automaticamente
- Verifique se DNS está correto

### Site não carrega:
- Verifique se serviço está rodando no Railway
- Verifique logs: `railway logs`
- Verifique se domínio está "Active" no Railway

---

**Pronto!** Siga esses passos e seu domínio estará funcionando! 🎉
