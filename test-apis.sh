#!/bin/bash

# Script para testar APIs do VERUM Node
HEROKU_URL="https://verumnodelegacys-f1d58c4993f8.herokuapp.com"
LOCAL_URL="http://localhost:3000"

echo "🧪 Testando APIs do VERUM Node"
echo "=================================="
echo ""

# Função para testar endpoint
test_endpoint() {
    local url=$1
    local name=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo "📡 Testando: $name"
    echo "   URL: $url"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$url" 2>&1)
    fi
    
    http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE/d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "   ✅ Status: $http_code (OK)"
        echo "   📦 Response: $(echo "$body" | head -c 200)..."
    else
        echo "   ❌ Status: $http_code"
        echo "   📦 Response: $(echo "$body" | head -c 200)..."
    fi
    echo ""
}

# Testar Health Check
echo "1️⃣ HEALTH CHECK"
test_endpoint "$HEROKU_URL/api/health" "Health Check (Heroku)"
test_endpoint "$LOCAL_URL/api/health" "Health Check (Local)"

# Testar Chat Hybrid (método POST)
echo "2️⃣ CHAT HYBRID API"
chat_data='{"messages":[{"role":"user","content":"Olá, você está funcionando?"}],"useOmegaMesh":true,"enableWebSearch":false}'
test_endpoint "$HEROKU_URL/api/chat-hybrid" "Chat Hybrid (Heroku)" "POST" "$chat_data"

# Testar DeepSeek API
echo "3️⃣ DEEPSEEK API"
deepseek_data='{"messages":[{"role":"user","content":"Teste rápido"}],"stream":false}'
test_endpoint "$HEROKU_URL/api/chat-deepseek" "DeepSeek Chat (Heroku)" "POST" "$deepseek_data"

echo "✅ Testes concluídos!"
echo ""
echo "💡 Para testar localmente, execute: npm run dev"
echo "💡 Para testar no Heroku: https://verumnodelegacys-f1d58c4993f8.herokuapp.com"
