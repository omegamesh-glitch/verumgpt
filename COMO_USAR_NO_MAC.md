# 🍎 Como Usar VERUM no Mac

## ✅ Já Está Funcionando!

O VERUM já está rodando no seu Mac em:
- **http://localhost:3000** (navegador)
- **http://192.168.15.157:3000** (rede local)

## 🚀 Opções para Melhorar a Experiência no Mac

### Opção 1: PWA (Progressive Web App) - RECOMENDADO

**Mais simples e funciona perfeitamente!**

1. Abra no Safari: `http://localhost:3000`
2. Menu Safari → **Arquivo** → **Adicionar à Tela Inicial**
3. Ou clique no botão de compartilhar e escolha "Adicionar à Tela Inicial"
4. O app aparecerá como um ícone no Dock e Launchpad

**Vantagens:**
- ✅ Funciona offline (com cache)
- ✅ Parece um app nativo
- ✅ Notificações (se configurado)
- ✅ Sem precisar instalar nada extra

### Opção 2: Criar App Nativo com Electron

**Para criar um app .app nativo do Mac:**

1. Instalar Electron:
```bash
npm install --save-dev electron electron-builder
```

2. Criar arquivo `electron/main.js`:
```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Em desenvolvimento, usar localhost
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000')
  } else {
    // Em produção, usar build do Next.js
    win.loadFile('out/index.html')
  }
}

app.whenReady().then(createWindow)
```

3. Adicionar ao `package.json`:
```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron": "electron .",
    "electron:build": "next build && electron-builder"
  }
}
```

4. Rodar:
```bash
npm run electron
```

### Opção 3: Usar no Navegador (Atual)

**Já está funcionando assim!**

- Abra: `http://localhost:3000`
- Funciona em qualquer navegador (Safari, Chrome, Firefox)
- Pode adicionar aos favoritos

## 📱 Testar no iPhone (mesma rede WiFi)

No iPhone, acesse:
```
http://192.168.15.157:3000
```

Depois:
1. Safari → Compartilhar → Adicionar à Tela Inicial
2. Funciona como PWA no iPhone também!

## 🎯 Recomendação

**Use PWA (Opção 1)** - É a mais simples e funciona perfeitamente no Mac!

O VERUM já está funcionando no seu Mac. Só precisa abrir no navegador ou adicionar como PWA.

---

**Status Atual:** ✅ Funcionando perfeitamente em `http://localhost:3000`
