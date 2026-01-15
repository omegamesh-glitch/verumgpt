# 🚀 Como Rodar VERUM Localmente no Seu PC

## Pré-requisitos

1. **Node.js 20.x** instalado
   ```bash
   node --version
   # Deve mostrar: v20.x.x
   ```

2. **npm 10.x** instalado
   ```bash
   npm --version
   # Deve mostrar: 10.x.x
   ```

## Passo a Passo

### 1. Navegar até a pasta do projeto
```bash
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Criar arquivo .env.local
touch .env.local
```

Adicione as seguintes variáveis (use suas chaves reais):

```env
# OpenAI API Key (obrigatório para TTS e Whisper)
# Obtenha sua chave em: https://platform.openai.com/api-keys
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# OpenAI Backup Key (opcional)
OPENAI_API_KEY_BACKUP=YOUR_OPENAI_API_KEY_BACKUP

# DeepSeek API Key (obrigatório para chat)
# Obtenha sua chave em: https://platform.deepseek.com/api_keys
DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY

# Outras variáveis (opcionais)
NODE_ENV=development
```

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor vai iniciar em: **http://localhost:3000**

### 5. Abrir no navegador

Abra seu navegador e acesse:
```
http://localhost:3000
```

## Comandos Disponíveis

```bash
# Desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm start

# Verificar erros de código
npm run lint
```

## Solução de Problemas

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Usar outra porta
PORT=3001 npm run dev
```

### Erro: "OPENAI_API_KEY not configured"
- Verifique se o arquivo `.env.local` existe
- Verifique se as variáveis estão corretas
- Reinicie o servidor após criar/editar `.env.local`

## Estrutura do Projeto

```
verumgpt/
├── app/
│   ├── api/          # APIs (chat, TTS, etc)
│   ├── components/   # Componentes React
│   └── page.tsx      # Página principal
├── .env.local        # Variáveis de ambiente (criar você)
├── package.json      # Dependências
└── README.md
```

## Notas Importantes

- ⚠️ **NUNCA** commite o arquivo `.env.local` no Git
- 🔒 Mantenha suas chaves de API seguras
- 🌐 O app roda apenas localmente (localhost)
- 📱 Para testar no celular, use o IP da sua rede local

## Testar no Celular (mesma rede WiFi)

1. Descubra o IP do seu Mac:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

2. No celular, acesse:
```
http://SEU_IP:3000
```

Exemplo: `http://192.168.1.100:3000`

---

**Pronto!** Agora você pode desenvolver e testar o VERUM localmente! 🎉
