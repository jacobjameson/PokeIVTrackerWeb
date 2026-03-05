/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        gb: {
          bg:     '#060d06',
          card:   '#0d1a0d',
          raised: '#122012',
          border: '#1c3a1c',
          green:  '#22c55e',
          bright: '#4ade80',
          dim:    '#166534',
          text:   '#d1fae5',
          muted:  '#6ee7b7',
          faint:  '#1e3a1e',
        },
      },
      boxShadow: {
        'gb': '0 0 0 2px #1c3a1c, 0 0 20px rgba(34,197,94,0.05)',
        'gb-glow': '0 0 12px rgba(74,222,128,0.3)',
      },
    },
  },
  plugins: [],
}
