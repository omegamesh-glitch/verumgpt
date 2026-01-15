import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Redirecionar www para não-www (SEO best practice)
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '')
    return NextResponse.redirect(url, 301)
  }
  
  const response = NextResponse.next()
  
  // Headers de segurança e performance
  const headers = {
    'X-DNS-Prefetch-Control': 'on',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
  
  // Aplicar headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Cache para assets estáticos
  if (request.nextUrl.pathname.match(/\.(js|css|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|avif|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // No cache para páginas dinâmicas
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  }
  
  // Preconnect para domínios externos (se necessário)
  if (request.nextUrl.pathname === '/') {
    response.headers.set('Link', '</api/health>; rel=preconnect')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
