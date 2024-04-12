import type { Metadata } from 'next';
import Header from '@/components/widgets/header';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { getServerSession } from 'next-auth';

import theme from '@/styles/theme';
import '@/styles/globals.css';
import { Nunito } from 'next/font/google';
import AuthProvider from './provider';
import { authOptions } from './api/auth/[...nextauth]/route';

export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Краснодар Марриотт Отель',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru">
      <body className={nunito.className}>
        <AuthProvider session={session!}>
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <ThemeProvider theme={theme}>
              <Header />
              <main>{children}</main>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
