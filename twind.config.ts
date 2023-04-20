import type { Options } from '$fresh/plugins/twind.ts';

const darkerGray = '#1b1b1b';
const darkGray = '#333';
const gray = '#888';
const offWhite = '#faf9f6';

export default {
  selfURL: import.meta.url,
  content: ['./{components,islands,routes}/**/*.tsx'],
  theme: {
    maxWidth: {
      prose: '55ch',
    },
    extend: {
      colors: {
        'darker-gray': darkerGray,
        'dark-gray': darkGray,
        'gray': gray,
        'off-white': offWhite,
        'white': '#fff',
      },
      fontFamily: {
        sans: ['Inter'],
      },
      animation: {
        cursor: 'cursor 1s steps(2) infinite',
        pulse: 'pulse 1s infinite',
      },
      keyframes: {
        cursor: {
          '0%': {
            opacity: 0,
          },
        },
        pulse: {
          '0%, 100%': {
            'background-color': darkerGray,
          },
          '50%': {
            'background-color': darkGray,
          },
        },
      },
    },
  },
  preflight: {
    '@font-face': [
      {
        fontFamily: 'Inter',
        src: 'url(/Inter-ExtraLight-subset.woff2) format("woff2")',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    ],
  },
} as Options;
