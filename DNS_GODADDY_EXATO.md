# ✅ Domínio Configurado no Railway!

## 🎯 CNAME Gerado pelo Railway:

```
Tipo: CNAME
Nome: @
Valor: 21xzh15l.up.railway.app
```

---

## 📋 CONFIGURAR NA GODADDY (Passo a Passo):

### 1. Acesse GoDaddy:
- https://www.godaddy.com/
- Faça login na sua conta

### 2. Vá em Gerenciar DNS:
- **Meus Produtos** → Encontre **verumnodelegacy.com**
- Clique em **DNS** ou **Gerenciar DNS**

### 3. Adicionar CNAME:

1. Clique em **Adicionar** ou botão **+**
2. Preencha:
   - **Tipo**: `CNAME`
   - **Nome/Host**: `@` (ou deixe em branco)
   - **Valor/Ponteiro**: `21xzh15l.up.railway.app`
   - **TTL**: `600` (10 minutos) ou `3600` (1 hora)
3. Clique em **Salvar**

### 4. Adicionar CNAME para www (Opcional):

1. Clique em **Adicionar** novamente
2. Preencha:
   - **Tipo**: `CNAME`
   - **Nome/Host**: `www`
   - **Valor/Ponteiro**: `21xzh15l.up.railway.app`
   - **TTL**: `600`
3. Clique em **Salvar**

---

## ⏱️ Aguardar Propagação:

- **Tempo normal**: 5-30 minutos
- **Máximo**: Até 72 horas (raro)
- **Verificar**: https://dnschecker.org/#CNAME/verumnodelegacy.com

---

## ✅ Verificar se Funcionou:

### 1. Verificar DNS:
```bash
nslookup verumnodelegacy.com
# Deve retornar: 21xzh15l.up.railway.app
```

### 2. Testar Site:
- Aguarde 5-30 minutos após configurar DNS
- Acesse: https://verumnodelegacy.com
- Deve carregar o VERUM Node

### 3. Verificar SSL:
- Deve mostrar cadeado verde
- SSL é ativado automaticamente pelo Railway (5-15 min após DNS)

---

## 🎯 Resumo:

✅ **Railway**: Domínio configurado  
✅ **CNAME**: `21xzh15l.up.railway.app`  
⏳ **GoDaddy**: Adicionar CNAME agora  
⏳ **Aguardar**: 5-30 minutos  
✅ **Resultado**: https://verumnodelegacy.com funcionando!

---

## 📝 Checklist:

- [x] Domínio adicionado no Railway
- [x] CNAME obtido: `21xzh15l.up.railway.app`
- [ ] CNAME adicionado na GoDaddy (nome: @, valor: 21xzh15l.up.railway.app)
- [ ] CNAME para www adicionado (opcional)
- [ ] Aguardado 5-30 minutos
- [ ] Site testado em https://verumnodelegacy.com
- [ ] SSL verificado (cadeado verde)

---

**Próximo passo**: Adicionar o CNAME na GoDaddy agora! 🚀
