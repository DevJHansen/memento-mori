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
          DEFAULT: '#f74922',
          gradientStart: '#f74922',
          gradientEnd: '#673AB7',
        },
        accentSecondaryGradient: {
          DEFAULT: '#c2381b',
          gradientStart: '#c2381b',
          gradientEnd: '#e44b30',
        },
      },
    },
  },
};
export default config;
