/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        surface: '#13131A',
        surface2: '#1A1A23',
        border: '#1F1F2A',
        muted: '#8B8B96',
        fg: '#F5F5F7',
        brand: {
          DEFAULT: '#B4FF39',
          dim: '#8FCC2E',
          glow: '#B4FF3920'
        },
        danger: '#FF3D71',
        warn: '#FFB23D'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        glow: '0 0 24px 0 rgba(180, 255, 57, 0.15)'
      }
    }
  },
  plugins: []
}
