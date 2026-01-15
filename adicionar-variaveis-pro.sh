#!/bin/bash

# Script para adicionar variáveis do Railway Pro

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🚀 Adicionando variáveis Railway Pro..."
echo ""

# Verificar se está linkado
if railway status | grep -q "Service: None"; then
    echo "⚠️  Linkando serviço primeiro..."
    railway service
    echo ""
fi

echo "📝 Adicionando variáveis de performance..."
echo ""

# Performance e Recursos (Aproveitando 32GB RAM / 32 vCPU)
railway variables set PDF_MAX_SIZE_MB=100
railway variables set PDF_MAX_PAGES=1000
railway variables set PDF_MAX_CONCURRENT=10
railway variables set WORKER_THREADS=8
railway variables set MAX_CONCURRENT_REQUESTS=50
railway variables set NODE_OPTIONS="--max-old-space-size=16384"

echo ""
echo "📊 Adicionando variáveis de analytics..."
echo ""

# Analytics
railway variables set ENABLE_ANALYTICS=true
railway variables set ANALYTICS_RETENTION_DAYS=90
railway variables set LOG_LEVEL=info
railway variables set ENABLE_DETAILED_LOGS=true

echo ""
echo "🔒 Adicionando variáveis de segurança..."
echo ""

# Rate limiting
railway variables set RATE_LIMIT_ENABLED=true
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set RATE_LIMIT_WINDOW_MS=60000

echo ""
echo "✅ Variáveis adicionadas!"
echo ""
echo "📋 Verificar variáveis:"
echo "   railway variables"
echo ""
echo "🔄 Railway vai fazer redeploy automaticamente..."
echo "   Aguarde alguns minutos e teste novamente"
