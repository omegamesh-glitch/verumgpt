#!/bin/bash

# Script para fazer deploy no Railway

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🚂 Deploy no Railway - VERUM GPT"
echo ""

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não está instalado"
    echo "📦 Instalando Railway CLI..."
    brew install railway
fi

# Verificar se está logado
echo "🔐 Verificando login..."
if ! railway whoami &> /dev/null; then
    echo "⚠️  Não está logado. Fazendo login..."
    railway login
fi

# Inicializar projeto (se necessário)
if [ ! -f ".railway" ]; then
    echo "📦 Inicializando projeto Railway..."
    railway init
fi

# Configurar variáveis de ambiente
echo ""
echo "🔧 Configurando variáveis de ambiente..."
railway variables set DATABASE_URL="postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway"
railway variables set NODE_ENV="production"

echo ""
echo "📝 Variáveis configuradas:"
echo "   - DATABASE_URL"
echo "   - NODE_ENV"
echo ""
echo "⚠️  Configure manualmente:"
echo "   - OPENAI_API_KEY"
echo "   - OPENAI_API_KEY_BACKUP"
echo "   - DEEPSEEK_API_KEY"
echo ""

# Deploy
echo "🚀 Fazendo deploy..."
railway up

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Abrindo dashboard..."
railway open
