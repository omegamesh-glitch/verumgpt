#!/bin/bash

# Script para configurar domínio customizado verumnodelegacy.com no Railway

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🌐 Configurando domínio customizado: verumnodelegacy.com"
echo ""

# Verificar se está linkado
if railway status | grep -q "Service: None"; then
    echo "⚠️  Linkando serviço primeiro..."
    railway service
    echo ""
fi

echo "📝 Adicionando domínio customizado no Railway..."
echo ""

# Adicionar domínio customizado
railway domain add verumnodelegacy.com 2>&1

echo ""
echo "✅ Domínio adicionado no Railway!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Railway vai fornecer um CNAME (ex: xxxxxx.railway.app)"
echo "2. Vá na GoDaddy → Gerenciar DNS"
echo "3. Adicione CNAME:"
echo "   - Nome: @ (ou deixe em branco)"
echo "   - Valor: [o CNAME que Railway forneceu]"
echo "   - TTL: 600"
echo ""
echo "4. Para www.verumnodelegacy.com (opcional):"
echo "   - Nome: www"
echo "   - Valor: [mesmo CNAME do Railway]"
echo ""
echo "5. Aguarde 5-30 minutos para DNS propagar"
echo ""
echo "6. SSL será ativado automaticamente pelo Railway"
echo ""
echo "📖 Guia completo: CONFIGURAR_DOMINIO_GODADDY.md"
echo ""
