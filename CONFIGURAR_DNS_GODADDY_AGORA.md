# 🔧 Configurar DNS na GoDaddy - Instruções Exatas

## 📋 Registros Atuais (que você viu):

```
A: @ → WebsiteBuilder Site
CNAME: www → verumnodelegacy.com
CNAME: _domainconnect → _domainconnect.gd.domaincontrol.com
TXT: _dmarc → v=DMARC1; p=quarantine; ...
```

---

## ✅ O QUE FAZER:

### 1️⃣ MODIFICAR o registro A existente:

**NÃO apague**, apenas **MODIFIQUE**:

1. Clique em **Editar** no registro **A: @ → WebsiteBuilder Site**
2. **Mude o tipo** de `A` para `CNAME`
3. **Nome**: `@` (ou deixe em branco)
4. **Valor**: `21xzh15l.up.railway.app`
5. **TTL**: `600` ou `3600`
6. **Salvar**

**OU** se não puder mudar o tipo:

1. **Apague** o registro `A: @ → WebsiteBuilder Site`
2. Clique em **Adicionar registro**
3. **Tipo**: `CNAME`
4. **Nome**: `@` (ou deixe em branco)
5. **Valor**: `21xzh15l.up.railway.app`
6. **TTL**: `600`
7. **Salvar**

---

### 2️⃣ MODIFICAR o CNAME www existente:

1. Clique em **Editar** no registro **CNAME: www → verumnodelegacy.com**
2. **Nome**: `www` (manter)
3. **Valor**: Mude de `verumnodelegacy.com` para `21xzh15l.up.railway.app`
4. **TTL**: `600`
5. **Salvar**

---

### 3️⃣ MANTER os outros registros:

✅ **NÃO mexa** nestes (são importantes):
- `CNAME: _domainconnect` → Deixe como está
- `TXT: _dmarc` → Deixe como está

---

## 📝 Registros Finais (Como deve ficar):

```
CNAME: @ → 21xzh15l.up.railway.app          ← NOVO/MODIFICADO
CNAME: www → 21xzh15l.up.railway.app        ← MODIFICADO
CNAME: _domainconnect → _domainconnect.gd.domaincontrol.com  ← MANTER
TXT: _dmarc → v=DMARC1; ...                 ← MANTER
```

---

## ⚠️ IMPORTANTE:

### Se não conseguir mudar A para CNAME:

Alguns provedores DNS não permitem CNAME no domínio raiz (@). Nesse caso:

**Opção Alternativa - Usar A Record:**

1. No Railway, verifique se há um IP fornecido
2. Ou use um serviço como Cloudflare (gratuito) que permite CNAME no root

**OU usar subdomínio:**
- `app.verumnodelegacy.com` → CNAME → `21xzh15l.up.railway.app`
- E redirecionar `verumnodelegacy.com` para `app.verumnodelegacy.com`

---

## ✅ Checklist:

- [ ] Registro A (@) modificado para CNAME ou removido
- [ ] CNAME @ adicionado apontando para `21xzh15l.up.railway.app`
- [ ] CNAME www modificado para `21xzh15l.up.railway.app`
- [ ] Registros _domainconnect e _dmarc mantidos
- [ ] Aguardado 5-30 minutos
- [ ] Testado em https://verumnodelegacy.com

---

## 🧪 Verificar após configurar:

```bash
# Verificar DNS
nslookup verumnodelegacy.com
# Deve retornar: 21xzh15l.up.railway.app

# Verificar www
nslookup www.verumnodelegacy.com
# Deve retornar: 21xzh15l.up.railway.app
```

---

## 🆘 Se der erro na GoDaddy:

### Erro: "CNAME não pode coexistir com A record"

**Solução:**
1. **Apague** o registro A primeiro
2. **Depois** adicione o CNAME

### Erro: "CNAME não permitido no root (@)"

**Solução:**
1. Use Cloudflare (gratuito) como DNS
2. Ou configure subdomínio `app.verumnodelegacy.com`

---

**Próximo passo**: Modificar os registros na GoDaddy agora! 🚀
