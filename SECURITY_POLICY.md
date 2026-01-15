# 🔐 Política de Segurança - API Keys

## ⚠️ REGRA CRÍTICA: NUNCA EXPOR CHAVES API

### ❌ NUNCA FAÇA:
- ❌ Logar chaves API em console.log, console.error, etc.
- ❌ Incluir chaves em mensagens de erro retornadas ao cliente
- ❌ Incluir chaves em respostas JSON
- ❌ Commitar chaves no código ou repositório
- ❌ Compartilhar chaves em conversas, emails, mensagens
- ❌ Expor chaves em URLs ou query parameters

### ✅ SEMPRE FAÇA:
- ✅ Use apenas variáveis de ambiente (process.env)
- ✅ Armazene chaves apenas no Heroku Config Vars
- ✅ Sanitize todos os logs e mensagens de erro
- ✅ Use helpers de segurança para sanitização
- ✅ Verifique código antes de commit
- ✅ Revogue chaves se expostas acidentalmente

### 🛡️ Implementações de Segurança

1. **Sanitização de Erros**
   - Todos os erros são sanitizados antes de serem logados
   - Padrões de API keys são removidos: `sk-[...]` → `[API_KEY_REDACTED]`
   - Headers Authorization são redatados

2. **Logs Seguros**
   - Helper `safeLog()` disponível para logs seguros
   - Sanitização automática de objetos antes de logar
   - Verificação de padrões de API keys

3. **Respostas Seguras**
   - Erros retornados ao cliente nunca contêm chaves
   - Detalhes de erro são sanitizados
   - Apenas mensagens genéricas são expostas

### 📋 Checklist de Segurança

Antes de fazer commit, verifique:
- [ ] Nenhuma chave hardcoded no código
- [ ] Logs não expõem chaves
- [ ] Mensagens de erro são sanitizadas
- [ ] Variáveis de ambiente usadas corretamente
- [ ] .env.local não está commitado (no .gitignore)

### 🔍 Como Verificar

```bash
# Buscar por padrões de API keys no código
grep -r "sk-[a-zA-Z0-9]" app/ --exclude-dir=node_modules

# Verificar se há chaves em logs
grep -r "console.*OPENAI_API_KEY" app/

# Verificar variáveis de ambiente
heroku config -a verumnodelegacys | grep -E "OPENAI|DEEPSEEK|API_KEY"
```

### 🚨 Se uma Chave for Exposta

1. **Imediatamente**: Revogue a chave na plataforma (OpenAI/DeepSeek)
2. **Gere nova chave** na plataforma
3. **Atualize** no Heroku Config Vars
4. **Verifique logs** do Heroku para ver se houve uso indevido
5. **Revise código** para identificar como foi exposta

### 📝 Notas

- Chaves devem ser tratadas como senhas
- Nunca compartilhe chaves, mesmo com colegas de confiança
- Use variáveis de ambiente sempre
- Implementações futuras devem seguir estas diretrizes
