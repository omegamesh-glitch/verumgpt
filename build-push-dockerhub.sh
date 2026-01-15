#!/bin/bash

# Script para build e push da imagem para Docker Hub

cd "/Users/verumnodelegacy/Desktop/mother board/verumgpt"

echo "🔨 Building Docker image..."
docker build -t verumnodelegacy/verumgpt:latest .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🔐 Logging into Docker Hub..."
echo "Username: verumnodelegacy"
docker login

if [ $? -ne 0 ]; then
    echo "❌ Login failed!"
    exit 1
fi

echo ""
echo "📤 Pushing to Docker Hub..."
docker push verumnodelegacy/verumgpt:latest

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Image pushed: verumnodelegacy/verumgpt:latest"
    echo "🌐 View at: https://hub.docker.com/r/verumnodelegacy/verumgpt"
else
    echo "❌ Push failed!"
    exit 1
fi
