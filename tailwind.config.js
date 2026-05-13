export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        surface: '#13131A',
        surface2: '#1B1B24',
        border: '#2A2A35',
        fg: '#F5F6FA',
        muted: '#8B8C96',
        brand: { DEFAULT: '#B4FF39', dim: '#a5ef2b' },
        danger: '#FF3D71',
        warn: '#FFB23D'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        glow: '0 0 24px rgba(180,255,57,0.3)'
      }
    }
  }
}
