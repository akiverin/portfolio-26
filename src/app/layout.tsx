import type { Metadata } from 'next';
import { pretendard, caveat } from 'shared/styles/fonts';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import '@mantine/core/styles.css';
import './globals.scss';

import Header from 'widgets/Header/ui/Header';
import Footer from 'widgets/Footer/ui/Footer';
import { StoreProvider } from 'shared/stores/StoreContext';

export const metadata: Metadata = {
  title: 'Andrew Kiverin | Portfolio',
  description: 'Web site portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${pretendard.variable} ${caveat.variable}`} lang="ru">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <StoreProvider>
            <Header />
            {children}
            <Footer />
          </StoreProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
