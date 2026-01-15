import { NextResponse } from 'next/server'

// Cache otimizado para Bare Metal (mais frequente)
let cachedHealth: any = null
let cacheTime = 0
const CACHE_TTL = 3000 // 3 segundos para Bare Metal (health checks mais frequentes)

export async function GET() {
  const now = Date.now()
  
  // Retornar cache se ainda válido
  if (cachedHealth && (now - cacheTime) < CACHE_TTL) {
    return NextResponse.json(cachedHealth, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3, s-maxage=3',
        'Content-Type': 'application/json',
      },
    })
  }
  
  try {
    // Calcular health com métricas otimizadas para Bare Metal
    const memUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      platform: 'railway-metal',
      services: {
        openai: !!process.env.OPENAI_API_KEY,
        deepseek: !!(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.length > 0),
      },
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      },
      cpu: {
        user: Math.round(cpuUsage.user / 1000), // microsegundos para milissegundos
        system: Math.round(cpuUsage.system / 1000),
      },
      // Métricas adicionais para Bare Metal
      nodeVersion: process.version,
      pid: process.pid,
    }
    
    // Atualizar cache
    cachedHealth = health
    cacheTime = now
    
    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3, s-maxage=3',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Em caso de erro, retornar status unhealthy
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
