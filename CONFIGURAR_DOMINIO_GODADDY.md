# 🌐 Configurar Domínio Customizado - GoDaddy → Railway

## 📋 Domínio: verumnodelegacy.com

### Objetivo:
Fazer deploy do VERUM Node (https://zestful-eagerness-production.up.railway.app/) no domínio **verumnodelegacy.com**

---

## 🚀 Passo 1: Configurar Domínio no Railway

### Via Dashboard (Recomendado):

1. Acesse: https://railway.com/project/cf27bf87-3c4c-4f78-bf84-255018c4658e
2. Clique no serviço **zestful-eagerness**
3. Vá em **Settings** → **Networking**
4. Em **Custom Domains**, clique em **Generate Domain**
5. Digite: `verumnodelegacy.com`
6. Railway vai gerar um registro CNAME

### Via CLI:

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

# Gerar domínio customizado
railway domain generate verumnodelegacy.com
```

**Railway vai retornar algo como:**
```
Domain: verumnodelegacy.com
CNAME: xxxxxx.railway.app
```

---

## 🔧 Passo 2: Configurar DNS na GoDaddy

### Opção A: CNAME (Recomendado - Mais Fácil)

1. Acesse: https://www.godaddy.com/
2. Faça login na sua conta
3. Vá em **Meus Produtos** → **DNS** ou **Gerenciar DNS**
4. Encontre o domínio **verumnodelegacy.com**
5. Clique em **Gerenciar DNS**

#### Adicionar Registro CNAME:

1. Clique em **Adicionar** ou **+**
2. Tipo: **CNAME**
3. Nome/Host: `@` (ou deixe em branco para o domínio raiz)
4. Valor/Ponteiro: `xxxxxx.railway.app` (o que Railway forneceu)
5. TTL: `600` (10 minutos) ou `3600` (1 hora)
6. Salve

#### Para www.verumnodelegacy.com (Opcional):

1. Adicione outro CNAME:
   - Nome: `www`
   - Valor: `xxxxxx.railway.app`
   - TTL: `600`

### Opção B: A Record (Alternativa)

Se CNAME não funcionar, use A Records:

1. No Railway, vá em **Settings** → **Networking**
2. Veja o IP do serviço (Railway pode fornecer)
3. Na GoDaddy, adicione A Record:
   - Nome: `@`
   - Valor: `IP do Railway`
   - TTL: `600`

---

## ⚙️ Passo 3: Configurar Next.js para o Domínio

### Atualizar next.config.js (se necessário):

```javascript
const nextConfig = {
  // ... outras configurações
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
}
```

### Atualizar layout.tsx (metadata):

```typescript
export const metadata: Metadata = {
  title: 'VERUM NODE - AI Chat Gratuito',
  description: 'VERUM Node - Advanced AI Chat Assistant',
  metadataBase: new URL('https://verumnodelegacy.com'),
  // ...
}
```

---

## 🔒 Passo 4: SSL/HTTPS (Automático)

O Railway fornece SSL automático via Let's Encrypt:
- ✅ HTTPS automático
- ✅ Renovação automática
- ✅ Sem configuração adicional necessária

**Aguarde 5-15 minutos** após configurar DNS para SSL ser ativado.

---

## ⏱️ Passo 5: Aguardar Propagação DNS

### Tempo de propagação:
- **CNAME**: 5-30 minutos
- **A Record**: 10-60 minutos
- **Máximo**: Até 48 horas (raro)

### Verificar propagação:

```bash
# Verificar CNAME
dig verumnodelegacy.com CNAME

# Verificar se está apontando para Railway
nslookup verumnodelegacy.com

# Testar acesso
curl -I https://verumnodelegacy.com
```

### Ferramentas online:
- https://dnschecker.org/
- https://www.whatsmydns.net/

---

## ✅ Passo 6: Verificar se Funcionou

### Testes:

1. **Acessar o site**:
   ```
   https://verumnodelegacy.com
   ```

2. **Verificar SSL**:
   - Deve mostrar cadeado verde
   - Certificado válido

3. **Testar API**:
   ```
   https://verumnodelegacy.com/api/health
   ```

4. **Verificar no Railway**:
   - Dashboard → Settings → Networking
   - Deve mostrar domínio como "Active"

---

## 🔄 Passo 7: Redirecionar www para domínio principal (Opcional)

### Na GoDaddy:

1. Adicione CNAME para `www`:
   - Nome: `www`
   - Valor: `verumnodelegacy.com` (ou o CNAME do Railway)

### Ou no Next.js (middleware.ts):

```typescript
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Redirecionar www para não-www
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '')
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}
```

---

## 📝 Checklist Completo

### Railway:
- [ ] Domínio customizado gerado no Railway
- [ ] CNAME ou A Record obtido
- [ ] Domínio aparece como "Active" no dashboard

### GoDaddy:
- [ ] Login na conta GoDaddy
- [ ] Acessado gerenciamento DNS
- [ ] CNAME adicionado para `@` (domínio raiz)
- [ ] CNAME adicionado para `www` (opcional)
- [ ] TTL configurado (600 ou 3600)

### Verificação:
- [ ] DNS propagado (verificar com dig/nslookup)
- [ ] Site acessível em https://verumnodelegacy.com
- [ ] SSL funcionando (cadeado verde)
- [ ] API funcionando (/api/health)
- [ ] Redirecionamento www funcionando (se configurado)

---

## 🚨 Troubleshooting

### Domínio não funciona:

1. **Verificar DNS**:
   ```bash
   dig verumnodelegacy.com CNAME
   nslookup verumnodelegacy.com
   ```

2. **Verificar no Railway**:
   - Dashboard → Settings → Networking
   - Ver se domínio está "Active"
   - Ver logs de erro

3. **Aguardar propagação**:
   - Pode levar até 48 horas (raro)
   - Normalmente 5-30 minutos

### SSL não funciona:

1. **Aguardar**: Railway precisa de 5-15 minutos para gerar certificado
2. **Verificar DNS**: Certifique-se que está apontando corretamente
3. **Limpar cache**: Limpar cache do navegador

### Erro 404:

1. **Verificar configuração do Railway**: Serviço deve estar rodando
2. **Verificar domínio**: Deve estar "Active" no Railway
3. **Verificar logs**: `railway logs` para ver erros

---

## 📞 Suporte

### Railway:
- Dashboard: https://railway.com/project/cf27bf87-3c4c-4f78-bf84-255018c4658e
- Docs: https://docs.railway.app/guides/custom-domains

### GoDaddy:
- Suporte: https://www.godaddy.com/help
- DNS: https://www.godaddy.com/help/manage-dns-680

---

## 🎯 Próximos Passos Após Configurar

1. ✅ Testar site em https://verumnodelegacy.com
2. ✅ Atualizar links internos (se necessário)
3. ✅ Configurar redirecionamento www (opcional)
4. ✅ Atualizar SEO metadata
5. ✅ Testar todas as funcionalidades

---

**Status**: 📋 Guia completo criado!

**Próximo passo**: Configurar domínio no Railway e apontar DNS na GoDaddy
