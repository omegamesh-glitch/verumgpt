#!/bin/bash

# Script para corrigir permissões do .next e liberar porta 3000

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🔧 Corrigindo permissões..."

# Mudar dono de todos os arquivos do .next para o usuário atual
sudo chown -R $(whoami):staff .next

# Dar permissões de escrita
chmod -R u+w .next

echo "✅ Permissões corrigidas!"

# Liberar porta 3000
echo ""
echo "🔓 Liberando porta 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "✅ Porta 3000 liberada" || echo "ℹ️ Porta 3000 já está livre"

echo ""
echo "✅ Pronto! Agora execute: npm run dev"
