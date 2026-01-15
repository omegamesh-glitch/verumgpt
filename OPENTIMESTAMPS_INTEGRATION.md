# 🔐 Integração OpenTimestamps para VERUM Node

## O Que É OpenTimestamps?

OpenTimestamps é uma biblioteca Python que cria **timestamps prováveis** usando a blockchain do Bitcoin. Isso permite:

- ✅ **Provar que algo existiu** em um momento específico
- ✅ **Verificar autenticidade** de arquivos/documentos
- ✅ **Timestamp à prova de falsificação** usando blockchain
- ✅ **Gratuito e descentralizado**

## Como Funciona

1. Cria um hash do arquivo/dados
2. Envia para um calendário OpenTimestamps (público)
3. O calendário adiciona ao blockchain do Bitcoin
4. Você recebe um "proof" que prova o timestamp

## Possíveis Usos no VERUM Node

### 1. **Timestamp de Mensagens/Chat**
- Provar quando uma conversa aconteceu
- Verificar autenticidade de mensagens importantes
- Criar prova de registro de conversas

### 2. **Timestamp de PDFs/Arquivos**
- Quando um PDF foi carregado
- Prova de autenticidade de documentos
- Registro permanente na blockchain

### 3. **Timestamp de Transcrições de Voz**
- Provar quando uma transcrição foi feita
- Verificar autenticidade de gravações
- Registro temporal de conversas

### 4. **Timestamp de Código/Gerado**
- Provar quando código foi gerado
- Verificar autenticidade de respostas
- Registro de criatividade/autoria

## Integração Sugerida

### Opção 1: API Endpoint para Timestamps
Criar `/api/timestamp` que:
- Recebe dados (texto, hash, arquivo)
- Cria timestamp usando OpenTimestamps
- Retorna proof para verificação

### Opção 2: Integração com Transcrições
- Automaticamente criar timestamp quando transcrever voz
- Armazenar proof junto com transcrição
- Permitir verificação posterior

### Opção 3: Integração com Chat
- Opção de criar timestamp de mensagens importantes
- Botão "Provar autenticidade" nas mensagens
- Verificação de timestamp disponível

## Próximos Passos

1. ✅ Biblioteca copiada para `opentimestamps-lib/`
2. ⏳ Criar endpoint API para timestamps
3. ⏳ Integrar com transcrições de voz
4. ⏳ Adicionar UI para criar/verificar timestamps
5. ⏳ Documentar processo de verificação

## Exemplo de Uso (Python)

```python
from opentimestamps.core.timestamp import Timestamp
from opentimestamps.core.op import OpAppend, OpSHA256
from opentimestamps.calendar import RemoteCalendar

# Criar timestamp
data = b"dados para timestamp"
timestamp = Timestamp(data)

# Adicionar ao calendário
calendar = RemoteCalendar('https://alice.btc.calendar.opentimestamps.org')
calendar.submit(timestamp)

# Obter proof
proof = timestamp.ops
```

## Notas

- ⚠️ Requer conexão com calendários OpenTimestamps
- ⚠️ Processo pode levar alguns minutos (blockchain)
- ✅ Gratuito e descentralizado
- ✅ Prova permanente na blockchain Bitcoin
