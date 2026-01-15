#!/bin/bash

# Script para DESINSTALAR Git completamente do sistema

echo "🗑️  Desinstalando Git completamente..."
echo "⚠️  Isso requer senha de administrador"
echo ""

# Parar processos Git
pkill -f "git" 2>/dev/null

# Remover Xcode Command Line Tools (contém Git)
echo "1️⃣ Removendo Xcode Command Line Tools..."
sudo rm -rf /Library/Developer/CommandLineTools

# Remover arquivos Git do sistema
echo "2️⃣ Removendo arquivos Git do sistema..."
sudo rm -f /usr/bin/git
sudo rm -f /usr/bin/git-*
sudo rm -rf /usr/share/git-core
sudo rm -rf /usr/share/git-gui
sudo rm -rf /usr/share/gitk
sudo rm -rf /usr/libexec/git-core
sudo rm -rf /Applications/Xcode.app/Contents/Developer/usr/bin/git* 2>/dev/null

# Verificar se foi removido
echo ""
echo "3️⃣ Verificando remoção..."
if ! command -v git &> /dev/null; then
    echo "✅ Git foi DESINSTALADO com sucesso!"
else
    echo "⚠️  Git ainda está instalado. Verifique manualmente."
fi

echo ""
echo "✅ Processo concluído!"
