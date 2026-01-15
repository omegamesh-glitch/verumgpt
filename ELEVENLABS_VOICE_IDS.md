# 🎤 ElevenLabs Voice IDs - VERUM Node

## ✅ Voice ID Atual (Configurado)

**Voice ID Padrão**: `d7361a8e96f033e1ebff51d4a32e24cda3b4a265fdd6b3c69602f9ab411f3f32`

- **Status**: ✅ Configurado no código e Railway
- **Uso**: Voz padrão para todas as requisições TTS
- **Link**: https://elevenlabs.io/app/agents/voice-library?voiceId=d7361a8e96f033e1ebff51d4a32e24cda3b4a265fdd6b3c69602f9ab411f3f32

---

## 📋 Voice IDs Disponíveis

### Voice ID Atual:
```
56bWURjYFHyYyVf490Dp
```

### Voice IDs Anteriores (Backup):
```
56bWURjYFHyYyVf490Dp
6edcf137fb406f20fe21f01df2d3604a164f52a3a1d709b2ffdbd7f99a1daf60
```

---

## 🔧 Como Usar Outras Vozes

### Opção 1: Via Variável de Ambiente
```bash
# No Railway
railway variables set ELEVENLABS_VOICE_ID=SEU_VOICE_ID_AQUI
```

### Opção 2: Via API Request
```typescript
const response = await fetch('/api/elevenlabs-tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello, world!',
    voice_id: 'SEU_VOICE_ID_AQUI', // Sobrescreve o padrão
  }),
})
```

### Opção 3: Listar Vozes Disponíveis
Você pode listar todas as vozes disponíveis usando a API do ElevenLabs:

```bash
curl 'https://api.elevenlabs.io/v1/voices' \
  -H 'xi-api-key: SUA_API_KEY'
```

---

## 📝 Localização no Código

**Arquivo**: `app/api/elevenlabs-tts/route.ts`

**Linha 97**:
   ```typescript
   const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || 'd7361a8e96f033e1ebff51d4a32e24cda3b4a265fdd6b3c69602f9ab411f3f32'
   ```

---

## 🔄 Como Trocar a Voz

1. **Encontrar uma voz**: Acesse https://elevenlabs.io/app/agents/voice-library
2. **Copiar o Voice ID**: Da URL ou da API
3. **Atualizar no Railway**:
   ```bash
   railway variables set ELEVENLABS_VOICE_ID=NOVO_VOICE_ID
   ```
4. **Ou atualizar no código** (fallback):
   - Editar `app/api/elevenlabs-tts/route.ts`
   - Alterar o valor padrão na linha 97

---

## ✅ Status Atual

- **Voice ID Configurado**: `56bWURjYFHyYyVf490Dp`
- **Variável Railway**: ✅ Configurada
- **Código**: ✅ Atualizado
- **Documentação**: ✅ Atualizada

---

**Última atualização**: Voice ID `56bWURjYFHyYyVf490Dp` configurado como padrão.
