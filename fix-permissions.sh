#!/bin/bash

# Script para corrigir permissões do diretório .next

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🔧 Corrigindo permissões do diretório .next..."

# Mudar dono de todos os arquivos do .next para o usuário atual
sudo chown -R $(whoami):staff .next 2>/dev/null

# Dar permissões de escrita
chmod -R u+w .next 2>/dev/null

echo "✅ Permissões corrigidas!"
echo ""
echo "Agora você pode executar: npm run dev"
