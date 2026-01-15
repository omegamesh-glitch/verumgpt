import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        verum: {
          primary: '#10a37f',
          secondary: '#1a7f64',
          dark: '#0d7a5f',
        },
      },
    },
  },
  plugins: [],
}
export default config
