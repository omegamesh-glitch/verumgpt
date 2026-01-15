import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VERUM NODE - AI Chat Gratuito',
  description: 'VERUM Node - Advanced AI Chat Assistant. Upload PDFs, Images, Web Search - 100% Free',
  manifest: '/manifest.json',
  authors: [{ name: 'VERUM Node Legacy' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://verumnodelegacy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VERUM NODE - AI Chat Gratuito',
    description: 'VERUM Node - Advanced AI Chat Assistant',
    url: 'https://verumnodelegacy.com',
    siteName: 'VERUM NODE',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VERUM NODE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#10a37f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Resource Hints - Otimização de Performance */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.deepseek.com" />
        <link rel="preconnect" href="https://api.openai.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.deepseek.com" crossOrigin="anonymous" />
        
        {/* Preload recursos críticos */}
        <link rel="preload" href="/manifest.json" as="manifest" />
        <link rel="preload" href="/sw.js" as="script" />
        
        {/* PWA e Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        
        {/* Meta tags PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VERUM NODE" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Copyright e Registros */}
        <meta name="copyright" content="© 2025-2075 Rafael Augusto Xavier Fernandes - Registrado INPI BR512025002574-2 e US Copyright TX0009512048" />
        <meta name="inpi-registration" content="BR512025002574-2" />
        <meta name="us-copyright" content="TX0009512048" />
        
        {/* Performance - Prefetch para navegação */}
        <link rel="prefetch" href="/api/health" />
      </head>
      <body>{children}</body>
    </html>
  )
}
