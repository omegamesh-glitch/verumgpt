# 🔐 Funcionalidades de Criptografia - VERUM Node

## ✅ Implementado

### Algoritmos Suportados

1. **AES-256-GCM** (Advanced Encryption Standard)
   - ✅ 256-bit key (máxima segurança)
   - ✅ GCM mode (autenticação integrada)
   - ✅ Criptografia simétrica
   - ✅ Resistente a ataques conhecidos

2. **SHA-256** (Secure Hash Algorithm)
   - ✅ Função hash criptográfica
   - ✅ 256-bit output
   - ✅ Irreversível (one-way)
   - ✅ Colisões resistentes

3. **PBKDF2** (Password-Based Key Derivation)
   - ✅ Derivação de chave de senha
   - ✅ 100,000 iterações
   - ✅ Salt aleatório
   - ✅ Resistente a brute-force

### Funcionalidades

#### 1. Criptografia/Descriptografia
```typescript
import { encrypt, decrypt } from '@/app/utils/crypto-helper'

// Criptografar
const encrypted = encrypt('Texto secreto', 'senha123')

// Descriptografar
const decrypted = decrypt(encrypted, 'senha123')
```

#### 2. Hash SHA-256
```typescript
import { hash } from '@/app/utils/crypto-helper'

const hashValue = hash('dados para hash')
```

#### 3. Geração de Chaves
```typescript
import { generateKey } from '@/app/utils/crypto-helper'

const key = generateKey(32) // 256 bits
```

#### 4. Hash de Senhas (PBKDF2)
```typescript
import { hashPassword, verifyPassword } from '@/app/utils/crypto-helper'

// Criar hash de senha
const { hash, salt } = hashPassword('minhaSenha')

// Verificar senha
const isValid = verifyPassword('minhaSenha', hash, salt)
```

#### 5. Criptografia de JSON
```typescript
import { encryptJSON, decryptJSON } from '@/app/utils/crypto-helper'

const obj = { nome: 'João', idade: 30 }
const encrypted = encryptJSON(obj, 'senha')
const decrypted = decryptJSON<typeof obj>(encrypted, 'senha')
```

### API Endpoint

#### POST `/api/encrypt`

**Encrypt:**
```json
{
  "action": "encrypt",
  "data": "Texto para criptografar",
  "password": "senha123"
}
```

**Decrypt:**
```json
{
  "action": "decrypt",
  "data": "salt:iv:tag:encrypted",
  "password": "senha123"
}
```

**Hash:**
```json
{
  "action": "hash",
  "data": "Texto para hash"
}
```

**Generate Key:**
```json
{
  "action": "generate-key"
}
```

## 🔒 Segurança

### Características de Segurança

- ✅ **AES-256**: Máxima segurança (256 bits)
- ✅ **GCM Mode**: Autenticação integrada (previne tampering)
- ✅ **PBKDF2**: Derivação segura de chave (100k iterações)
- ✅ **Salt aleatório**: Cada criptografia usa salt único
- ✅ **IV aleatório**: Initialization vector único por operação
- ✅ **Auth Tag**: Verificação de integridade (GCM)

### Boas Práticas Implementadas

1. ✅ **Salt único**: Cada criptografia tem salt diferente
2. ✅ **IV único**: Cada criptografia tem IV diferente
3. ✅ **Derivação segura**: PBKDF2 com muitas iterações
4. ✅ **Autenticação**: GCM mode previne modificações
5. ✅ **Nunca reutilizar**: Cada operação é única

## 📋 Casos de Uso

### 1. Criptografar Mensagens
- Mensagens sensíveis no chat
- Dados pessoais
- Informações confidenciais

### 2. Armazenar Senhas
- Hash de senhas (PBKDF2)
- Nunca armazenar senhas em texto plano
- Verificação segura

### 3. Proteger Dados
- Criptografar dados antes de armazenar
- Backup seguro
- Transferência segura

### 4. Hash para Verificação
- Integridade de dados
- Timestamps (OpenTimestamps)
- Assinaturas digitais

## ⚠️ Importante

- 🔐 **Senhas fortes**: Use senhas complexas para criptografia
- 🔐 **Armazenamento seguro**: Nunca compartilhe senhas
- 🔐 **Backup de chaves**: Mantenha backup seguro das chaves
- 🔐 **Não usar em produção sem revisão**: Código educacional, revise para produção

## 🚀 Status

- ✅ Código implementado
- ✅ API endpoint criado
- ✅ Utilitários disponíveis
- ✅ Documentação completa
