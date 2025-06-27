// src/app/layout.tsx
'use client'; // Necesario porque SessionProvider usa hooks

import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}