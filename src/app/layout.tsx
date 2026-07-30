import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Navbar } from '@/components/marketing/Navbar';

export const metadata: Metadata = {
  title: 'G-Auth',
  description: 'Sign in with Google, protected by a personal graphical or grid-pattern vault lock.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
