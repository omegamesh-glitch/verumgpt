#!/usr/bin/env node

/**
 * Teste detalhado das APIs do VERUM Node
 */

const HEROKU_URL = 'https://verumnodelegacys-f1d58c4993f8.herokuapp.com';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

async function testAPI(name, url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }

    const startTime = Date.now();
    const response = await fetch(url, options);
    const responseTime = Date.now() - startTime;

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { raw: text.substring(0, 200) };
    }

    const status = response.status;
    const isSuccess = status >= 200 && status < 300;

    console.log(`${isSuccess ? colors.green + '✅' : colors.red + '❌'} ${colors.bold}${name}${colors.reset}`);
    console.log(`   Status: ${isSuccess ? colors.green : colors.red}${status}${colors.reset}`);
    console.log(`   Tempo: ${responseTime}ms`);
    
    if (data.services) {
      console.log(`   ${colors.blue}APIs:${colors.reset}`);
      console.log(`      OpenAI: ${data.services.openai ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
      console.log(`      DeepSeek: ${data.services.deepseek ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
    }
    
    if (data.content) {
      console.log(`   Resposta: ${data.content.substring(0, 100)}...`);
    }
    
    console.log('');
    return { success: isSuccess, status, data, responseTime };
  } catch (error) {
    console.log(`${colors.red}❌ ${colors.bold}${name}${colors.reset}`);
    console.log(`   Erro: ${error.message}`);
    console.log('');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`${colors.bold}${colors.blue}🧪 Testando APIs do VERUM Node${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);

  const results = [];

  // 1. Health Check
  console.log(`${colors.yellow}1️⃣ HEALTH CHECK${colors.reset}`);
  results.push(await testAPI(
    'Health Check',
    `${HEROKU_URL}/api/health`
  ));

  // 2. Chat APIs
  console.log(`${colors.yellow}2️⃣ CHAT APIs${colors.reset}`);
  
  results.push(await testAPI(
    'Chat Hybrid (OpenAI + DeepSeek)',
    `${HEROKU_URL}/api/chat-hybrid`,
    'POST',
    {
      messages: [{ role: 'user', content: 'Olá, você está funcionando? Responda em uma frase.' }],
      useOmegaMesh: true,
      enableWebSearch: false,
      stream: false,
    }
  ));

  results.push(await testAPI(
    'Chat DeepSeek',
    `${HEROKU_URL}/api/chat-deepseek`,
    'POST',
    {
      messages: [{ role: 'user', content: 'Teste rápido - responda "OK"' }],
      stream: false,
    }
  ));

  // 3. TTS API
  console.log(`${colors.yellow}3️⃣ TTS API${colors.reset}`);
  results.push(await testAPI(
    'Text-to-Speech',
    `${HEROKU_URL}/api/tts`,
    'POST',
    {
      text: 'Teste de voz',
      voice: 'alloy',
    }
  ));

  // Resumo
  console.log(`${colors.bold}${colors.blue}📊 RESUMO${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const avgTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.filter(r => r.responseTime).length;

  console.log(`Total de testes: ${totalCount}`);
  console.log(`Sucessos: ${colors.green}${successCount}${colors.reset}`);
  console.log(`Falhas: ${colors.red}${totalCount - successCount}${colors.reset}`);
  if (avgTime) {
    console.log(`Tempo médio: ${avgTime.toFixed(0)}ms`);
  }
  console.log(`\n${colors.green}✅ Testes concluídos!${colors.reset}\n`);
}

// Executar testes
runTests().catch(console.error);
