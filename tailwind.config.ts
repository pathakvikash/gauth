import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101010',
        panel: '#1c1c20',
        gold: '#F1C376',
      },
    },
  },
  plugins: [],
};

export default config;
