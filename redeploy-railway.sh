#!/bin/bash

# Script para fazer redeploy no Railway

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🚀 Redeploy no Railway - VERUM GPT"
echo ""

# Verificar se há serviço linkado
if railway status | grep -q "Service: None"; then
    echo "⚠️  Nenhum serviço linkado. Linkando serviço..."
    railway service
    echo ""
fi

# Fazer redeploy
echo "🔄 Fazendo redeploy..."
railway up

echo ""
echo "✅ Redeploy iniciado!"
echo ""
echo "📊 Ver logs:"
echo "   railway logs"
echo ""
echo "🌐 Abrir dashboard:"
echo "   railway open"
