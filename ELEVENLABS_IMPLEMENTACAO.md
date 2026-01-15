# 🎤 Implementação ElevenLabs - VERUM Node

## ✅ Endpoints Implementados

### 1. **Text-to-Speech (TTS)**
**Endpoint**: `/api/elevenlabs-tts`

**Recursos**:
- ✅ Vozes de alta qualidade
- ✅ Normalização de texto (números, datas, moedas)
- ✅ Suporte a SSML
- ✅ Controle de velocidade, estabilidade, similaridade
- ✅ Rastreamento de custos (character count)
- ✅ Fallback automático para OpenAI TTS

**Uso**:
```typescript
const response = await fetch('/api/elevenlabs-tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello, world!',
    voice_id: 'd7361a8e96f033e1ebff51d4a32e24cda3b4a265fdd6b3c69602f9ab411f3f32',
    model_id: 'eleven_multilingual_v2',
    stability: 0.5,
    similarity_boost: 0.75,
    speed: 1.0,
    normalize: true,
  }),
})
```

**Headers de Resposta**:
- `X-Character-Count` - Número de caracteres processados
- `X-Request-ID` - ID da requisição
- `X-Model-ID` - Modelo usado

---

### 2. **Speech-to-Text (STT)**
**Endpoint**: `/api/elevenlabs-speech-to-text`

**Recursos**:
- ✅ Modelo Scribe v2 (alta precisão)
- ✅ Detecção automática de idioma
- ✅ Speaker diarization (quem está falando)
- ✅ Tagging de eventos de áudio (risos, aplausos)
- ✅ **Multichannel support** (até 5 canais)
- ✅ **Keyterm prompting** (até 100 termos)
- ✅ Timestamps por palavra/sentença/parágrafo
- ✅ Fallback automático para OpenAI Whisper

**Uso Básico**:
```typescript
const formData = new FormData()
formData.append('audio', audioFile, 'recording.mp3')

const response = await fetch('/api/elevenlabs-speech-to-text', {
  method: 'POST',
  body: formData,
})
```

**Uso com Multichannel**:
```typescript
const formData = new FormData()
formData.append('audio', audioFile, 'stereo_interview.wav')
formData.append('use_multi_channel', 'true')
formData.append('timestamps_granularity', 'word')

const response = await fetch('/api/elevenlabs-speech-to-text', {
  method: 'POST',
  body: formData,
})

const data = await response.json()
// data.conversation - Transcript ordenado por tempo
// data.channels - Array com cada canal
```

**Uso com Keyterm Prompting**:
```typescript
const formData = new FormData()
formData.append('audio', audioFile, 'recording.mp3')
formData.append('keyterms', JSON.stringify(['ElevenLabs', 'VERUM Node', 'Product Name']))

const response = await fetch('/api/elevenlabs-speech-to-text', {
  method: 'POST',
  body: formData,
})
```

---

## 🔐 Autenticação

### Variáveis de Ambiente Configuradas:
- ✅ `ELEVENLABS_API_KEY` - Chave principal
- ✅ `ELEVENLABS_VOICE_ID` - ID da voz padrão

### Header Usado:
```
xi-api-key: ELEVENLABS_API_KEY
```

**Status**: ✅ Implementado corretamente em ambos os endpoints

---

## 📊 Rastreamento de Custos

### TTS (Text-to-Speech):
Os headers de resposta incluem:
- `X-Character-Count` - Caracteres processados
- `X-Request-ID` - ID para rastreamento
- `X-Model-ID` - Modelo usado

### STT (Speech-to-Text):
- Custo baseado em duração do áudio
- Multichannel: custo linear por canal
- Keyterm prompting: custo adicional

---

## 🎯 Recursos Avançados

### Multichannel Speech-to-Text:
- ✅ Suporte até 5 canais
- ✅ Processamento paralelo por canal
- ✅ Speaker ID automático (channel 0 → speaker_0)
- ✅ Transcript de conversa ordenado por tempo
- ✅ Timestamps por palavra

### Keyterm Prompting:
- ✅ Até 100 keyterms
- ✅ Máximo 50 caracteres por keyterm
- ✅ Context-aware (usa contexto para decidir)
- ✅ Melhor precisão para nomes próprios, produtos, etc.

---

## 📝 Exemplos de Uso

### Exemplo 1: TTS Simples
```typescript
const response = await fetch('/api/elevenlabs-tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Olá, bem-vindo ao VERUM Node!',
    voice_id: process.env.ELEVENLABS_VOICE_ID,
  }),
})

const audioBlob = await response.blob()
const audioUrl = URL.createObjectURL(audioBlob)
```

### Exemplo 2: STT com Keyterms
```typescript
const formData = new FormData()
formData.append('audio', audioFile)
formData.append('keyterms', JSON.stringify([
  'VERUM Node',
  'ElevenLabs',
  'Railway',
]))

const response = await fetch('/api/elevenlabs-speech-to-text', {
  method: 'POST',
  body: formData,
})

const { text, language, conversation } = await response.json()
```

### Exemplo 3: Multichannel (Entrevista Estéreo)
```typescript
const formData = new FormData()
formData.append('audio', stereoAudioFile, 'interview.wav')
formData.append('use_multi_channel', 'true')
formData.append('timestamps_granularity', 'word')

const response = await fetch('/api/elevenlabs-speech-to-text', {
  method: 'POST',
  body: formData,
})

const data = await response.json()
// data.conversation contém o transcript ordenado por tempo
// Cada entrada tem: speaker, text, start, end
```

---

## 🔄 Fallback Automático

### TTS:
- Se ElevenLabs falhar → Fallback para OpenAI TTS
- Header `X-Fallback: openai` indica fallback

### STT:
- Se ElevenLabs falhar → Fallback para OpenAI Whisper
- Campo `fallback: true` na resposta

---

## ✅ Status da Implementação

### TTS:
- [x] Endpoint criado: `/api/elevenlabs-tts`
- [x] Autenticação configurada
- [x] Normalização de texto
- [x] Rastreamento de custos
- [x] Fallback para OpenAI

### STT:
- [x] Endpoint criado: `/api/elevenlabs-speech-to-text`
- [x] Autenticação configurada
- [x] Multichannel support
- [x] Keyterm prompting
- [x] Speaker diarization
- [x] Audio event tagging
- [x] Fallback para OpenAI Whisper

### Frontend:
- [x] Integração no `page.tsx` (tenta ElevenLabs primeiro)
- [x] Fallback automático se ElevenLabs falhar

---

## 📋 Variáveis de Ambiente

```bash
ELEVENLABS_API_KEY=sk_1a84e0714602951b58274b8513160556d51a0d99e877baca
ELEVENLABS_VOICE_ID=d7361a8e96f033e1ebff51d4a32e24cda3b4a265fdd6b3c69602f9ab411f3f32
```

**Status**: ✅ Configuradas no Railway

---

## 🚀 Próximos Passos

1. ✅ Testar TTS com diferentes vozes
2. ✅ Testar STT com áudio real
3. ✅ Testar multichannel com arquivo estéreo
4. ✅ Testar keyterm prompting com nomes próprios
5. ✅ Monitorar custos via headers

---

**Status**: ✅ Implementação completa do ElevenLabs!

**Endpoints**: `/api/elevenlabs-tts` e `/api/elevenlabs-speech-to-text`

**Autenticação**: ✅ Configurada corretamente

**Recursos Avançados**: ✅ Multichannel e Keyterm prompting implementados
