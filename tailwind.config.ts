import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        backgroundSecondary: 'var(--backgroundSecondary)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        accentSecondary: 'var(--accentSecondary)',
        textOnDark: 'var(--textOnDark)',
        accentGradient: {
          DEFAULT: '#f74922', // solid color
          gradientStart: '#f74922', // for gradient start
          gradientEnd: '#673AB7', // for gradient end
        },
        accentSecondaryGradient: {
          DEFAULT: '#c2381b', // solid color
          gradientStart: '#c2381b', // for gradient start
          gradientEnd: '#e44b30', // for gradient end
        },
      },
    },
  },
};
export default config;
