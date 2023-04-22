import { css } from 'twind/css';

const scrollbar = {
  'scrollbar-color': 'transparent',
  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent', borderRadius: '6px' },
  '&::-webkit-scrollbar-thumb': { backgroundColor: '#333', borderRadius: '6px' },
};

export const horizontalScrollbar = css({ ...scrollbar, '&::-webkit-scrollbar': { height: '8px' } });

export const verticalScrollbar = css({ ...scrollbar, '&::-webkit-scrollbar': { width: '8px' } });
