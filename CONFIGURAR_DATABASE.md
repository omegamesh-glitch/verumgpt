# 🗄️ Configurar DATABASE_URL (PostgreSQL)

## O que é `${{ Postgres.DATABASE_URL }}`?

Essa sintaxe é usada em plataformas como **Vercel** ou **Railway** para referenciar variáveis de ambiente de serviços conectados (como PostgreSQL).

## 📝 Como usar:

### 1. **No Vercel (se estiver usando):**

Adicione no arquivo `vercel.json` ou nas Environment Variables:

```json
{
  "env": {
    "DATABASE_URL": "${{ Postgres.DATABASE_URL }}"
  }
}
```

### 2. **No .env.local (desenvolvimento local):**

```bash
# Adicione ao .env.local
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

### 3. **Exemplo de DATABASE_URL:**

```
postgresql://usuario:senha@host:5432/nome_banco?sslmode=require
```

## 🔧 Se você NÃO precisa de banco de dados:

O projeto verumgpt atual **não usa banco de dados**. Se você não precisa, pode ignorar essa variável.

## ✅ Se você QUER adicionar banco de dados:

1. **Instalar dependências:**
```bash
npm install @prisma/client prisma
# ou
npm install drizzle-orm pg
```

2. **Criar arquivo .env.local:**
```bash
DATABASE_URL=postgresql://usuario:senha@localhost:5432/verumgpt
```

3. **Configurar Prisma ou Drizzle**

## 📌 Nota:

- `${{ Postgres.DATABASE_URL }}` é uma sintaxe de template do Vercel
- No desenvolvimento local, use a URL completa do PostgreSQL
- Se não usar banco de dados, não precisa configurar nada
