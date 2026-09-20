import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FFFFFF',
          DEFAULT: '#F9F9F8',
          subtle: '#F4F4F1',
          muted: '#EFEFEA',
        },
        ink: {
          DEFAULT: '#111111',
          muted: '#555555',
          light: '#888888',
          faint: '#CCCCCC',
        },
        rule: {
          DEFAULT: '#E5E5E0',
          dark: '#111111',
        },
        accent: {
          blue: '#0D52FF',
          blueHover: '#0042D9',
          blueLight: '#EBF1FF',
        },
        status: {
          verified: '#0D52FF',
          inProgress: '#111111',
          gap: '#E53E3E',
          pending: '#888888',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.04)',
        editorial: '2px 2px 0px #111111',
      },
    },
  },
  plugins: [],
} satisfies Config;
