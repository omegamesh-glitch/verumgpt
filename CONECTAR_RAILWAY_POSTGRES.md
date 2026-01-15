# 🚂 Conectar ao PostgreSQL do Railway

## ✅ DATABASE_URL já configurado no .env.local:
```
postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway
```

## 🔧 Opção 1: Instalar PostgreSQL Client (psql)

### Via Homebrew:
```bash
brew install postgresql@15
# ou
brew install libpq
brew link --force libpq
```

### Depois conectar:
```bash
PGPASSWORD=IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw psql -h interchange.proxy.rlwy.net -U postgres -p 20105 -d railway
```

## 🔧 Opção 2: Instalar Railway CLI

```bash
# Instalar Railway CLI
brew install railway

# Fazer login
railway login

# Conectar ao projeto
railway link

# Conectar ao Postgres
railway connect postgres
```

## 🔧 Opção 3: Usar cliente gráfico (recomendado)

### DBeaver (grátis):
1. Baixar: https://dbeaver.io/download/
2. Criar nova conexão PostgreSQL
3. Host: `interchange.proxy.rlwy.net`
4. Port: `20105`
5. Database: `railway`
6. Username: `postgres`
7. Password: `IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw`

### TablePlus (pago, mas melhor):
1. Baixar: https://tableplus.com/
2. Mesmas configurações acima

## 📝 Testar conexão via Node.js:

```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"
node -e "
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway'
});
client.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL!'))
  .then(() => client.query('SELECT version()'))
  .then(res => console.log('Versão:', res.rows[0].version))
  .catch(err => console.error('❌ Erro:', err.message))
  .finally(() => client.end());
"
```

## 🎯 Próximos passos:

1. **Instalar dependências PostgreSQL no projeto:**
```bash
npm install pg @types/pg
```

2. **Criar arquivo de conexão:**
```typescript
// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```
