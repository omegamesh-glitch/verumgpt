# ✅ Valores Exatos para DNS na GoDaddy

## 📋 Registros Atuais que você viu:

```
A       @       WebsiteBuilder Site
CNAME   www     verumnodelegacy.com
CNAME   _domainconnect ...
TXT     _dmarc  ...
```

---

## ✅ O QUE FAZER:

### 1️⃣ REMOVER o registro A:

1. Encontre: `A       @       WebsiteBuilder Site`
2. Clique em **Editar** ou **Remover**
3. **Remova** esse registro (você não precisa mais dele)

---

### 2️⃣ ADICIONAR CNAME para @:

1. Clique em **Adicionar** ou **+**
2. Preencha:
   - **Tipo**: `CNAME`
   - **Nome**: `@` (ou deixe vazio)
   - **Valor**: `21xzh15l.up.railway.app` ← **ESTE É O VALOR!**
   - **TTL**: `600` ou `1 hora`
3. **Salvar**

---

### 3️⃣ MODIFICAR o CNAME www:

1. Encontre: `CNAME   www     verumnodelegacy.com`
2. Clique em **Editar**
3. **Nome**: `www` (manter)
4. **Valor**: Mude de `verumnodelegacy.com` para `21xzh15l.up.railway.app` ← **NOVO VALOR!**
5. **TTL**: `600` ou `1 hora`
6. **Salvar**

---

### 4️⃣ MANTER estes (não mexer):

✅ **CNAME   _domainconnect** → Deixe como está  
✅ **TXT     _dmarc** → Deixe como está

---

## 📝 RESULTADO FINAL (Como deve ficar):

```
CNAME   @       21xzh15l.up.railway.app          ← NOVO
CNAME   www     21xzh15l.up.railway.app          ← MODIFICADO
CNAME   _domainconnect ...                       ← MANTER
TXT     _dmarc   ...                             ← MANTER
```

---

## 🎯 VALOR CORRETO:

**Valor para ambos (@ e www):**
```
21xzh15l.up.railway.app
```

Este é o CNAME que o Railway gerou para você!

---

## ✅ Checklist:

- [ ] Registro A removido
- [ ] CNAME @ adicionado com valor: `21xzh15l.up.railway.app`
- [ ] CNAME www modificado para: `21xzh15l.up.railway.app`
- [ ] Registros _domainconnect e _dmarc mantidos
- [ ] Aguardado 5-30 minutos
- [ ] Testado em https://verumnodelegacy.com

---

## ⏱️ Após Salvar:

1. **Aguarde 5-30 minutos** para DNS propagar
2. **Teste**: https://verumnodelegacy.com
3. **SSL será ativado automaticamente** pelo Railway (5-15 min após DNS)

---

**Valor correto: `21xzh15l.up.railway.app`** 🚀
