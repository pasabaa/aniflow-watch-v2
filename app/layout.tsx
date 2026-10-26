import type { Metadata } from 'next';
import { Archivo, Geist_Mono } from 'next/font/google';
import { KonstaProvider } from '@/components/layout/konsta-provider';
import { KonstaNavbar } from '@/components/layout/konsta-navbar';
import { KonstaTabbar } from '@/components/layout/konsta-tabbar';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FLOW | Anime Streaming',
    template: '%s | FLOW',
  },
  description: 'Plataforma brutalista de catálogo y reproducción multimedia de anime.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${archivo.variable} ${geistMono.variable} dark k-material`}>
      <body className="flex min-h-screen flex-col bg-bg text-ink selection:bg-accent selection:text-white overflow-x-hidden">
        <KonstaProvider>
          <KonstaNavbar />
          <main className="flex-1 w-full pb-20">{children}</main>
          <KonstaTabbar />
        </KonstaProvider>
      </body>
    </html>
  );
}
