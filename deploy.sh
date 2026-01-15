#!/bin/bash

# 🚀 Script de Deploy Automático para Heroku
# VERUM Chat GPT

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║ 🚀 DEPLOY VERUM CHAT GPT TO HEROKU ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Diretório do projeto
PROJECT_DIR="/Users/verumnodelegacy/Desktop/mother board/verum-chat"
APP_NAME="verum-chat"

cd "$PROJECT_DIR"

echo ""
echo "1️⃣ Verificando pré-requisitos..."

# Verificar Heroku CLI
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}❌ Heroku CLI não encontrado${NC}"
    echo "Instale: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi
echo -e "${GREEN}✅ Heroku CLI encontrado${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm encontrado: $(npm --version)${NC}"

echo ""
echo "2️⃣ Instalando dependências..."
npm install

echo ""
echo "3️⃣ Verificando se app Heroku existe..."
if heroku apps:info -a "$APP_NAME" &> /dev/null; then
    echo -e "${GREEN}✅ App '$APP_NAME' já existe${NC}"
else
    echo -e "${YELLOW}⚠️ App '$APP_NAME' não existe. Criando...${NC}"
    heroku create "$APP_NAME"
    echo -e "${GREEN}✅ App criado${NC}"
fi

echo ""
echo "4️⃣ Configurando buildpack..."
heroku buildpacks:set heroku/nodejs -a "$APP_NAME"
echo -e "${GREEN}✅ Buildpack configurado${NC}"

echo ""
echo "5️⃣ Configurando variáveis de ambiente..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${YELLOW}⚠️ OPENAI_API_KEY não encontrada nas variáveis de ambiente${NC}"
    echo "Configurando API key padrão..."
    heroku config:set OPENAI_API_KEY=proj_rcJnMHLrCYZgjBNYis9XNerJ -a "$APP_NAME"
    echo -e "${GREEN}✅ OPENAI_API_KEY configurada com chave padrão${NC}"
else
    heroku config:set OPENAI_API_KEY="$OPENAI_API_KEY" -a "$APP_NAME"
    echo -e "${GREEN}✅ OPENAI_API_KEY configurada${NC}"
fi

echo ""
echo "6️⃣ Preparando Git..."
if [ ! -d ".git" ]; then
    echo "Inicializando repositório Git..."
    git init
fi

# Adicionar remote Heroku
if ! git remote | grep -q heroku; then
    heroku git:remote -a "$APP_NAME"
    echo -e "${GREEN}✅ Remote Heroku adicionado${NC}"
fi

echo ""
echo "7️⃣ Fazendo commit..."
git add .
git commit -m "Deploy VERUM Chat GPT to Heroku" || echo "Nenhuma mudança para commitar"

echo ""
echo "8️⃣ Fazendo deploy..."
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "Branch atual: $BRANCH"

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    git push heroku "$BRANCH" --force
else
    echo -e "${YELLOW}⚠️ Branch não é main/master. Fazendo push de main...${NC}"
    git push heroku main --force || git push heroku master --force
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║ ✅ DEPLOY CONCLUÍDO! ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Verificar status:"
echo "   heroku ps -a $APP_NAME"
echo ""
echo "📋 Ver logs:"
echo "   heroku logs --tail -a $APP_NAME"
echo ""
echo "🌐 Abrir no navegador:"
echo "   heroku open -a $APP_NAME"
echo ""
echo "🔗 URL: https://$APP_NAME.herokuapp.com"
echo ""
echo "⚠️  Não esqueça de configurar OPENAI_API_KEY:"
echo "   heroku config:set OPENAI_API_KEY=your_key_here -a $APP_NAME"
