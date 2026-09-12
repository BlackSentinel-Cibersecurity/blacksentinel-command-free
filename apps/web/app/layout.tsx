import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'BlackSentinel Command',
    template: '%s | BlackSentinel Command',
  },
  description: 'Unified Cybersecurity Command Center - The Operating System for Enterprise Cybersecurity',
  keywords: [
    'cybersecurity',
    'security operations',
    'SOC',
    'SIEM',
    'threat intelligence',
    'incident response',
    'vulnerability management',
    'compliance',
    'BlackSentinel',
  ],
  authors: [{ name: 'BlackSentinel Security Inc.' }],
  creator: 'BlackSentinel Security Inc.',
  publisher: 'BlackSentinel Security Inc.',
  metadataBase: new URL('https://command.blacksentinel.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://command.blacksentinel.io',
    siteName: 'BlackSentinel Command',
    title: 'BlackSentinel Command',
    description: 'Unified Cybersecurity Command Center - The Operating System for Enterprise Cybersecurity',
    images: [
      {
        url: '/icons/logo.png',
        width: 1200,
        height: 630,
        alt: 'BlackSentinel Command',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackSentinel Command',
    description: 'Unified Cybersecurity Command Center - The Operating System for Enterprise Cybersecurity',
    images: ['/icons/logo.png'],
    creator: '@blacksentinel',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/icons/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/logo.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0B0B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0B0B0B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BlackSentinel" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
