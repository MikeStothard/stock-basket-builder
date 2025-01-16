import { MantineProvider } from '@mantine/core';
import { Inter } from 'next/font/google';
import '@mantine/core/styles.css';
import React from 'react';
import { Providers } from './providers';
import { Navigation } from '../components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider>
          <Providers>
            <Navigation />
            {children}
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
} 