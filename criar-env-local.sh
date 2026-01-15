#!/bin/bash

# Script para criar .env.local com as chaves da OpenAI

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

cat > .env.local << 'EOF'
# IMPORTANTE: Substitua os valores abaixo com suas próprias chaves de API
# Obtenha suas chaves em:
# - OpenAI: https://platform.openai.com/api-keys
# - DeepSeek: https://platform.deepseek.com/api_keys

OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_API_KEY_BACKUP=YOUR_OPENAI_API_KEY_BACKUP
DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
NODE_ENV=development
EOF

echo "✅ Arquivo .env.local criado!"
echo ""
echo "Conteúdo:"
cat .env.local
