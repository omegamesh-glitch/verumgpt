/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  cacheOnFrontEndNav: false, // Disable cache on navigation for faster updates
  // Otimizações de cache PWA
  sw: 'sw.js',
  swcMinify: true,
  reloadOnOnline: true,
  // Runtime caching otimizado
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/verumnodelegacys.*\.herokuapp\.com\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 10, // Timeout rápido
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff|woff2|ttf|otf)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.(openai|deepseek)\.com\/.*/i,
      handler: 'NetworkOnly', // APIs externas sempre da rede
      options: {
        cacheName: 'external-apis',
      },
    },
  ],
})

const nextConfig = {
  reactStrictMode: true,
  compress: true, // Enable gzip compression
  output: 'standalone', // Enable standalone output for Railway/Docker
  poweredByHeader: false, // Remove X-Powered-By header for security
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    optimizeCss: true, // Optimize CSS
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'framer-motion',
      'react-markdown',
    ], // Tree-shake unused imports
    // Otimizações para Bare Metal (mais recursos disponíveis)
    serverComponentsExternalPackages: ['pdf-parse'],
    // Usar mais workers para Bare Metal (CPUs mais poderosas)
    workerThreads: true,
    cpus: 4, // Aproveitar múltiplos cores do Bare Metal
    // Otimizações adicionais
    optimizeServerReact: true,
    serverMinification: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache images for 60 seconds
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
      {
        source: '/:path*\\.(js|css|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ]
  },
  // Reduce bundle size e otimizações avançadas
  webpack: (config, { isServer, webpack, dev }) => {
    if (!isServer) {
      // Reduce bundle size for client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
      
      // Tree shaking e otimizações de produção
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          usedExports: true,
          sideEffects: false,
          // Code splitting otimizado
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              default: false,
              vendors: false,
              // Vendor chunks separados para melhor cache
              framework: {
                name: 'framework',
                chunks: 'all',
                test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
                priority: 40,
                enforce: true,
              },
              lib: {
                test(module) {
                  return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier())
                },
                name(module) {
                  const hash = require('crypto').createHash('sha1')
                  hash.update(module.identifier())
                  return hash.digest('hex').substring(0, 8)
                },
                priority: 30,
                minChunks: 1,
                reuseExistingChunk: true,
              },
              commons: {
                name: 'commons',
                minChunks: 2,
                priority: 20,
              },
              shared: {
                name(module, chunks) {
                  return require('crypto')
                    .createHash('sha1')
                    .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                    .digest('hex')
                    .substring(0, 8)
                },
                priority: 10,
                minChunks: 2,
                reuseExistingChunk: true,
              },
            },
          },
        }
      }
    }
    
    // Ignore unnecessary files
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    )
    
    return config
  },
  
  // Otimizações de produção
  swcMinify: true, // Usar SWC minifier (mais rápido que Terser)
  
  // Otimizar fontes
  optimizeFonts: true,
}

module.exports = withPWA(nextConfig)
