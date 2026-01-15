# 🔊 COMO TESTAR O TTS (Text-to-Speech)

## ⚠️ IMPORTANTE

**O TTS funciona no NAVEGADOR, não no terminal!**

O comando `window.speechSynthesis` é uma API JavaScript do navegador, não funciona no terminal do Mac.

---

## ✅ COMO TESTAR CORRETAMENTE

### **Método 1: Testar no App (RECOMENDADO)**

1. **Abra o navegador** (Chrome, Safari, Edge)
2. **Acesse:** https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
3. **Envie uma mensagem** no chat (ex: "Olá, como você está?")
4. **Aguarde a resposta** do assistente
5. **Clique no botão de áudio** (🔊) que aparece abaixo da mensagem
6. **O texto será lido em voz alta!**

---

### **Método 2: Testar no Console do Navegador**

1. **Abra o navegador** (Chrome, Safari, Edge)
2. **Acesse:** https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
3. **Abra o Console:**
   - **Chrome/Edge:** `F12` ou `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - **Safari:** `Cmd+Option+C` (precisa habilitar "Mostrar menu Desenvolvedor" nas preferências)
4. **Digite no console:**
   ```javascript
   window.speechSynthesis.speak(new SpeechSynthesisUtterance('Teste de voz do VERUM NODE'))
   ```
5. **Pressione Enter**
6. **Você deve ouvir a voz!**

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### **No Console do Navegador:**

```javascript
// Verificar se TTS está disponível
console.log('TTS disponível:', 'speechSynthesis' in window)

// Testar TTS simples
const utterance = new SpeechSynthesisUtterance('Olá, este é um teste de voz')
utterance.lang = 'pt-BR'
utterance.rate = 0.9
window.speechSynthesis.speak(utterance)
```

---

## 🐛 SE NÃO FUNCIONAR

### **1. Verificar Navegador:**
- ✅ **Chrome:** Funciona perfeitamente
- ✅ **Edge:** Funciona perfeitamente
- ✅ **Safari:** Funciona (pode precisar de interação do usuário primeiro)
- ⚠️ **Firefox:** Pode ter limitações

### **2. Verificar Permissões:**
- Alguns navegadores precisam de interação do usuário antes de permitir TTS
- Clique em qualquer lugar da página primeiro

### **3. Verificar Console:**
- Abra o Console (F12)
- Veja se há erros em vermelho
- Procure por mensagens relacionadas a "speechSynthesis" ou "TTS"

### **4. Testar API OpenAI TTS:**
Se o Web Speech API não funcionar, o app tenta usar OpenAI TTS:
- Verifique se `OPENAI_API_KEY` está configurada no Heroku
- Veja os logs do Heroku para erros de API

---

## 📱 TESTAR NO IPHONE/IPAD

1. **Abra Safari** no iPhone/iPad
2. **Acesse:** https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
3. **Envie uma mensagem**
4. **Clique no botão de áudio** (🔊)
5. **O texto será lido em voz alta!**

**Nota:** No iOS, o TTS funciona bem com Web Speech API.

---

## ✅ RESULTADO ESPERADO

Quando você clicar no botão de áudio:
1. ✅ O botão muda de cor (fica verde)
2. ✅ O ícone muda para "parar" (🔇)
3. ✅ Você ouve o texto sendo lido
4. ✅ Quando terminar, o botão volta ao normal

---

## 🎯 TESTE RÁPIDO

**Abra o navegador e teste agora:**

1. Vá para: https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
2. Digite: "Olá"
3. Aguarde resposta
4. Clique no 🔊 abaixo da resposta
5. **Deve funcionar!** 🎉

---

**Lembre-se: TTS funciona no NAVEGADOR, não no terminal!** 🌐
