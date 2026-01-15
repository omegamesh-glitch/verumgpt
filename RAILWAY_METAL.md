# 🚂 Railway Metal - Guia Completo

## 🎯 O que é Railway Metal?

Railway Metal é a nova infraestrutura do Railway, construída em hardware próprio em datacenters ao redor do mundo.

## ✅ Benefícios para seu projeto:

### 1. **Regiões Disponíveis (Trial & Hobby):**
- ✅ US West (California) - 🟢 Ativo
- ✅ US East (Virginia) - 🟢 Ativo  
- ✅ Europe West (Amsterdam) - 🟢 Ativo
- ✅ Southeast Asia (Singapore) - 🟢 Ativo

### 2. **Preços Reduzidos:**
- **Network Egress**: 50% mais barato ($0.10/GB → $0.05/GB)
- **Disk Storage**: 40% mais barato ($0.25/GB → $0.15/GB)
- *Aplicado automaticamente quando 80% dos workloads estão no Metal*

### 3. **Melhor Performance:**
- CPUs mais poderosas com mais cores
- Discos NVMe SSD (muito mais rápidos)
- Melhor performance por core

### 4. **Maior Confiabilidade:**
- Hardware gerenciado end-to-end
- Recuperação mais rápida de falhas
- Infraestrutura mais estável

### 5. **Metal Edge Network:**
- Rede anycast própria
- Melhor roteamento
- Menos latência
- Habilitado automaticamente

## 🔧 Como Migrar para Railway Metal:

### Opção 1: Migração Automática (Recomendado)
Railway migra automaticamente serviços sem volumes gradualmente.

**Timeline:**
- ✅ **Agora**: Novos deploys em serviços novos usam Metal por padrão
- ✅ **Janeiro 2025**: Migração gradual de serviços sem volumes
- 🟢 **Março 2025**: Serviços com volumes (Hobby)
- 🟠 **Junho 2025**: Migração completa

### Opção 2: Migração Manual (Mais Rápido)

1. **No Dashboard do Railway:**
   - Vá em **Settings** → **Deploy** → **Regions**
   - Selecione uma região com tag **Metal (New)**
   - Exemplos:
     - `US West (California) [Metal (New)]`
     - `US East (Virginia) [Metal (New)]`
     - `Europe West (Amsterdam) [Metal (New)]`
     - `Southeast Asia (Singapore) [Metal (New)]`

2. **Via Railway CLI:**
```bash
railway service
# Selecione o serviço
railway regions set "US West (California) [Metal (New)]"
```

## ⚠️ Importante - Banco de Dados:

Se você tem um **PostgreSQL no Railway**:

- **Atenção**: Se seu banco está em `US West (Oregon)` e você migra o app para `US West (California)`, pode haver latência adicional
- **Solução**: Migre o banco também para a mesma região Metal quando disponível (Março 2025)
- **Ou**: Mantenha ambos na mesma região até que volumes estejam disponíveis no Metal

## 📋 Checklist para Migração:

- [ ] Verificar se o serviço tem volumes (se sim, aguardar Março 2025)
- [ ] Escolher região Metal mais próxima dos usuários
- [ ] Configurar Health Checks para evitar downtime
- [ ] Verificar se banco de dados está na mesma região
- [ ] Fazer backup antes de migrar (se necessário)

## 🔍 Como Verificar se Está no Metal:

1. **No Dashboard:**
   - Settings → Deploy → Regions
   - Procure por tag **Metal (New)** ao lado da região

2. **Via CLI:**
```bash
railway status
# Mostra a região atual
```

## 🚨 Troubleshooting:

### Latência Aumentada:
- **Causa**: Banco de dados em região diferente
- **Solução**: Migre banco para mesma região ou aguarde Março 2025

### Custos Aumentaram:
- **Causa**: Métricas mais precisas no Metal
- **Nota**: CPU pode aumentar, RAM geralmente diminui
- **Benefício**: Preços reduzidos quando 80% migrado

### Downtime Durante Migração:
- **Prevenção**: Configure Health Checks
- **Solução**: Rollback disponível se necessário

## 🔄 Rollback (Se Necessário):

1. **No Dashboard:**
   - Settings → Deploy → Regions
   - Selecione região **sem** tag Metal (New)
   - Exemplo: `US West (Oregon)` (região antiga)

2. **Via Banner:**
   - Aparece banner de upgrade automático
   - Clique em **Rollback**

## 📊 Status Atual (Janeiro 2025):

- ✅ **4 regiões Metal ativas**
- ✅ **Novos serviços usam Metal por padrão**
- ✅ **Migração gradual em andamento**
- 🟢 **~40.000 deployments no Metal sem problemas significativos**

## 🎯 Recomendação para VERUM GPT:

1. **Agora**: Migrar manualmente para Metal (mais rápido)
2. **Região**: Escolha baseado na localização dos usuários
   - Brasil → `US East (Virginia)` ou `US West (California)`
   - Europa → `Europe West (Amsterdam)`
   - Ásia → `Southeast Asia (Singapore)`
3. **Banco de Dados**: Se estiver em Oregon, considere migrar também
4. **Aguardar**: Se banco tem volume, aguardar Março 2025

## 📝 Configuração no railway.json:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "RAILPACK"
  },
  "deploy": {
    "region": "us-west-california-metal",
    "startCommand": "npm start"
  }
}
```

## ✅ Próximos Passos:

1. Acesse Railway Dashboard
2. Vá em Settings → Deploy → Regions  
3. Selecione região Metal
4. Deploy automático será iniciado
5. Aproveite melhor performance e preços!
