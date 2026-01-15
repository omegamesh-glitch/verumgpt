#!/bin/bash

# Script para limpar completamente e reiniciar

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🛑 Parando todos os processos do Next.js..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

echo "🔓 Liberando portas..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
sleep 1

echo "🧹 Deletando diretório .next completamente..."
sudo rm -rf .next

echo "✅ Limpeza completa! Agora execute: npm run dev"
