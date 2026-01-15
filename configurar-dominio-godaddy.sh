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

echo "📝 Para adicionar domínio customizado no Railway:"
echo ""
echo "OPÇÃO 1 - Via Dashboard (Recomendado):"
echo "1. Acesse: https://railway.com/project/cf27bf87-3c4c-4f78-bf84-255018c4658e"
echo "2. Clique no serviço 'zestful-eagerness'"
echo "3. Vá em Settings → Networking → Custom Domains"
echo "4. Clique em 'Add Domain' ou 'Generate Domain'"
echo "5. Digite: verumnodelegacy.com"
echo "6. Railway vai gerar um CNAME (ex: xxxxxx.railway.app)"
echo ""
echo "OPÇÃO 2 - Via CLI:"
echo "railway domain generate verumnodelegacy.com"
echo ""

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
