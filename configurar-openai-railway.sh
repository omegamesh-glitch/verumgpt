#!/bin/bash

# Script para configurar chaves OpenAI no Railway

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🔐 Configurando chaves OpenAI no Railway..."
echo ""

# Verificar se está linkado
if railway status | grep -q "Service: None"; then
    echo "⚠️  Linkando serviço primeiro..."
    railway service
    echo ""
fi

echo "📝 Adicionando variáveis de ambiente..."
echo ""

# Adicionar OPENAI_API_KEY
# IMPORTANTE: Substitua YOUR_OPENAI_API_KEY pela sua chave real
railway variables set OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# Adicionar OPENAI_API_KEY_BACKUP
# IMPORTANTE: Substitua YOUR_OPENAI_API_KEY_BACKUP pela sua chave real
railway variables set OPENAI_API_KEY_BACKUP="YOUR_OPENAI_API_KEY_BACKUP"

# Adicionar DEEPSEEK_API_KEY (se ainda não tiver)
# IMPORTANTE: Substitua YOUR_DEEPSEEK_API_KEY pela sua chave real
railway variables set DEEPSEEK_API_KEY="YOUR_DEEPSEEK_API_KEY"

# Adicionar NODE_ENV
railway variables set NODE_ENV="production"

echo ""
echo "✅ Variáveis configuradas!"
echo ""
echo "📋 Verificar variáveis:"
echo "   railway variables"
echo ""
echo "🔄 Railway vai fazer redeploy automaticamente..."
echo "   Aguarde alguns minutos e teste a transcrição novamente"
