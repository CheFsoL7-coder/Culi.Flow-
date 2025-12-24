/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          border: 'rgba(255, 255, 255, 0.18)',
          bg: 'rgba(255, 255, 255, 0.08)',
          bgHover: 'rgba(255, 255, 255, 0.12)',
        },
        status: {
          good: '#10b981',
          watch: '#f59e0b',
          risk: '#ef4444',
        },
        priority: {
          critical: '#dc2626',
          high: '#f59e0b',
          medium: '#3b82f6',
        },
      },
      transitionDuration: {
        'flow': '150ms',
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-in': 'slideIn 150ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
