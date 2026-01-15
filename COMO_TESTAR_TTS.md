# 🔊 COMO TESTAR O TTS NO NAVEGADOR

## ⚠️ IMPORTANTE

**O TTS NÃO funciona no terminal!**  
**Você precisa testar no NAVEGADOR (Chrome, Safari, Edge)**

---

## ✅ TESTE CORRETO - NO NAVEGADOR

### **Passo a Passo:**

1. **Abra o Chrome ou Safari** no seu Mac
2. **Acesse:** https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
3. **Envie uma mensagem** (ex: "Olá, como você está?")
4. **Aguarde a resposta** do assistente aparecer
5. **Procure o botão 🔊** abaixo da mensagem do assistente
6. **Clique no botão 🔊**
7. **O texto será lido em voz alta!**

---

## 🔍 TESTE NO CONSOLE DO NAVEGADOR

Se quiser testar diretamente no console:

1. **Abra o navegador** (Chrome/Safari)
2. **Acesse:** https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
3. **Abra o Console:**
   - **Chrome:** Pressione `F12` ou `Cmd+Option+I`
   - **Safari:** Pressione `Cmd+Option+C` (precisa habilitar "Desenvolvedor" nas preferências)
4. **Digite no console:**
   ```javascript
   window.speechSynthesis.speak(new SpeechSynthesisUtterance('Teste de voz do VERUM NODE'))
   ```
5. **Pressione Enter**
6. **Você deve ouvir a voz!**

---

## 🐛 VERIFICAR SE ESTÁ FUNCIONANDO

### **No Console do Navegador:**

```javascript
// 1. Verificar se TTS está disponível
console.log('TTS disponível:', 'speechSynthesis' in window)

// 2. Ver quantas vozes estão disponíveis
console.log('Vozes disponíveis:', window.speechSynthesis.getVoices().length)

// 3. Testar TTS simples
const utterance = new SpeechSynthesisUtterance('Olá, este é um teste de voz do VERUM NODE')
utterance.lang = 'pt-BR'
utterance.rate = 0.9
window.speechSynthesis.speak(utterance)
```

---

## 📱 TESTAR NO IPHONE/IPAD

1. **Abra Safari** no iPhone/iPad
2. **Acesse:** https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
3. **Envie uma mensagem**
4. **Clique no botão 🔊**
5. **Funciona perfeitamente!**

---

## ✅ O QUE ESPERAR

Quando você clicar no botão 🔊:

1. ✅ O botão muda de cor (fica verde)
2. ✅ O ícone muda para "parar" (🔇)
3. ✅ Você ouve o texto sendo lido
4. ✅ No console aparecem logs: `🔊 TTS Button clicked`, `✅ Speech started`
5. ✅ Quando terminar, o botão volta ao normal

---

## 🐛 SE NÃO FUNCIONAR

### **1. Verifique o Console:**
- Abra o Console (F12)
- Veja se há erros em vermelho
- Procure por mensagens começando com 🔊, ✅, ou ❌

### **2. Verifique o Navegador:**
- ✅ **Chrome:** Funciona perfeitamente
- ✅ **Safari:** Funciona perfeitamente
- ✅ **Edge:** Funciona perfeitamente
- ⚠️ **Firefox:** Pode ter limitações

### **3. Permissões:**
- Alguns navegadores precisam de interação do usuário primeiro
- Clique em qualquer lugar da página antes de usar TTS

### **4. Teste Direto:**
No console do navegador, teste:
```javascript
// Teste simples
window.speechSynthesis.speak(new SpeechSynthesisUtterance('Teste'))

// Se não funcionar, verifique:
console.log('speechSynthesis disponível?', 'speechSynthesis' in window)
```

---

## 🎯 TESTE AGORA

**Abra o navegador e teste:**

1. 🌐 Vá para: https://verumnodelegacys-f1d58c4993f8.herokuapp.com/
2. 💬 Digite: "Olá"
3. ⏳ Aguarde resposta
4. 🔊 Clique no botão 🔊 abaixo da resposta
5. 🎉 **Deve funcionar!**

---

## 📝 NOTA IMPORTANTE

**O comando `window.speechSynthesis` só funciona no NAVEGADOR, não no terminal do Mac!**

- ❌ Terminal do Mac: Não funciona
- ✅ Navegador (Chrome/Safari): Funciona perfeitamente

**Teste sempre no navegador!** 🌐
