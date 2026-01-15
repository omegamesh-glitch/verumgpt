# 🔧 Corrigir OpenAI no Localhost

## ⚠️ Problema

OpenAI não está configurada no localhost.

## ✅ Solução

### 1. Criar arquivo `.env.local`

No diretório raiz do projeto (`/Users/verumnodelegacy/Desktop/mother board/verumgpt`), crie o arquivo `.env.local`:

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"
```

Crie o arquivo com este conteúdo:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_API_KEY_BACKUP=YOUR_OPENAI_API_KEY
DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
NODE_ENV=development
```

### 2. Criar via Terminal

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

cat > .env.local << 'EOF'
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_API_KEY_BACKUP=YOUR_OPENAI_API_KEY
DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
NODE_ENV=development
EOF
```

### 3. Verificar se foi criado

```bash
cat .env.local
```

Deve mostrar as chaves.

### 4. REINICIAR o servidor

⚠️ **IMPORTANTE:** O Next.js só carrega `.env.local` na inicialização!

```bash
# Pare o servidor (Ctrl + C)
# Depois inicie novamente:
npm run dev
```

### 5. Verificar no console

Quando iniciar o servidor, você deve ver:
```
- Environments: .env.local
```

Isso confirma que o Next.js está lendo o arquivo.

## 🔍 Verificar se está funcionando

### Teste 1: Verificar variável no código

Crie um arquivo de teste temporário:

```bash
cat > test-env.js << 'EOF'
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ Configurada' : '❌ Não configurada');
EOF

node test-env.js
```

### Teste 2: Testar API diretamente

No navegador, abra o console e teste:

```javascript
fetch('/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'teste', voice: 'nova' })
})
.then(r => r.json())
.then(console.log)
```

Se retornar erro sobre API key, significa que não está carregando.

## ⚠️ Problemas Comuns

### Problema 1: Arquivo não está na raiz

Certifique-se que `.env.local` está em:
```
/Users/verumnodelegacy/Desktop/mother board/verumgpt/.env.local
```

### Problema 2: Servidor não foi reiniciado

**SEMPRE reinicie o servidor após criar/editar `.env.local`!**

### Problema 3: Formato incorreto

O arquivo deve ter formato:
```
CHAVE=valor
```

**SEM espaços** antes ou depois do `=`

### Problema 4: Next.js não está lendo

Verifique se no `next.config.js` não há nada bloqueando:

```javascript
// next.config.js não deve ter nada que bloqueie .env.local
```

## ✅ Checklist

- [ ] Arquivo `.env.local` criado na raiz do projeto
- [ ] Chaves estão corretas (sem espaços)
- [ ] Servidor foi **REINICIADO** após criar o arquivo
- [ ] Console mostra "Environments: .env.local"
- [ ] Teste de API funciona

## 🚀 Comando Rápido Completo

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

# Criar .env.local
cat > .env.local << 'EOF'
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_API_KEY_BACKUP=YOUR_OPENAI_API_KEY
DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
NODE_ENV=development
EOF

# Verificar
cat .env.local

# Reiniciar servidor (pare o atual e rode):
npm run dev
```

---

**Depois de seguir esses passos, a OpenAI deve funcionar no localhost!** ✅
