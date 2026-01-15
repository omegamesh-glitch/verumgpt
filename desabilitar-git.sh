#!/bin/bash

# Script para desabilitar Git completamente

echo "🛑 Desabilitando Git..."

# Parar processos Git
pkill -f "git" 2>/dev/null

# Remover .git de projetos comuns
cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"
if [ -d ".git" ]; then
    rm -rf .git
    echo "✅ Git removido do projeto verumgpt"
fi

echo ""
echo "✅ Git desabilitado!"
echo "ℹ️ Git ainda está instalado, mas não está sendo usado"
echo ""
echo "Para reativar quando precisar:"
echo "  - Reinstalar: xcode-select --install"
echo "  - Ou: brew install git"
