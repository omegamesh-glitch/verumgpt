#!/bin/bash

# Script completo para corrigir todas as permissões e limpar o ambiente

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🛑 Parando processos do Next.js..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

echo "🔓 Liberando portas 3000, 3001, 3002..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
sleep 1

echo "🔧 Corrigindo permissões do diretório .next..."
if [ -d ".next" ]; then
    sudo chown -R $(whoami):staff .next
    chmod -R u+w .next
    echo "✅ Permissões corrigidas"
else
    echo "ℹ️ Diretório .next não existe (será criado na próxima execução)"
fi

echo ""
echo "🧹 Opção: Deletar .next completamente? (recomendado se problemas persistirem)"
echo "   Execute: sudo rm -rf .next"
echo ""
echo "✅ Pronto! Agora execute: npm run dev"
