/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#09090b',
          light: '#18181b',
          dark: '#030303'
        },
        neonBlue: {
          light: '#3b82f6',
          DEFAULT: '#0072ff',
          glow: '#00f2fe'
        },
        neonGreen: {
          light: '#34d399',
          DEFAULT: '#10b981',
          glow: '#05ffc4'
        },
        neonPurple: {
          light: '#c084fc',
          DEFAULT: '#8b5cf6',
          glow: '#d946ef'
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.08)',
          bg: 'rgba(24, 24, 27, 0.65)'
        }
      },
      animation: {
        'scan-line': 'scan 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' }
        }
      }
    },
  },
  plugins: [],
}
