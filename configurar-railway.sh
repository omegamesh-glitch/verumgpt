#!/bin/bash

# Script para configurar Railway após deploy inicial

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🔧 Configurando Railway - VERUM GPT"
echo ""

# Linkar serviço
echo "📦 Linkando serviço..."
railway service

# Configurar variáveis de ambiente no projeto
echo ""
echo "🔐 Configurando variáveis de ambiente no projeto..."

# Variáveis do projeto (aplicadas a todos os serviços)
railway variables set DATABASE_URL="postgresql://postgres:IGfAoZIhBRrdquCkBIGwCSQMJnVlisaw@interchange.proxy.rlwy.net:20105/railway" --service
railway variables set NODE_ENV="production" --service

echo ""
echo "✅ Variáveis básicas configuradas!"
echo ""
echo "⚠️  Configure manualmente no dashboard:"
echo "   - OPENAI_API_KEY"
echo "   - OPENAI_API_KEY_BACKUP"
echo "   - DEEPSEEK_API_KEY"
echo ""
echo "Ou via CLI:"
echo "   railway variables set OPENAI_API_KEY='sua-chave' --service"
echo "   railway variables set DEEPSEEK_API_KEY='sk-70d832c8d50d4ebbb7e4585591d2a89b' --service"
echo ""
echo "🌐 Abrindo dashboard..."
railway open
