import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VERUM NODE - AI Chat Gratuito',
  description: 'VERUM Node - Advanced AI Chat Assistant. Upload PDFs, Images, Web Search - 100% Free',
  manifest: '/manifest.json',
  authors: [{ name: 'VERUM Node Legacy' }],
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VERUM NODE" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="copyright" content="© 2025-2075 Rafael Augusto Xavier Fernandes - Registrado INPI BR512025002574-2 e US Copyright TX0009512048" />
        <meta name="inpi-registration" content="BR512025002574-2" />
        <meta name="us-copyright" content="TX0009512048" />
      </head>
      <body>{children}</body>
    </html>
  )
}
