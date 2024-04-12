'use client';
import { Nunito } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

const theme = createTheme({
  typography: {
    fontFamily: nunito.style.fontFamily,
  },
});

export default theme;
