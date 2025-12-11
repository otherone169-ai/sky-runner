import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sky Runner - Ultimate 2D Arcade Game | Play Free Online',
  description: 'Experience the ultimate 2D arcade action game! Jump, dodge enemies, collect coins, and beat your high score in Sky Runner. Play free now with stunning effects and addictive gameplay.',
  keywords: 'arcade game, 2d game, online game, free game, sky runner, platformer, coin collector',
  authors: [{ name: 'Sky Runner Games' }],
  openGraph: {
    title: 'Sky Runner - Ultimate 2D Arcade Game',
    description: 'Jump, dodge enemies, collect coins, and beat your high score! Play the most addictive arcade game now.',
    type: 'website',
    url: 'https://skyrunner.game',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sky Runner Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sky Runner - Ultimate 2D Arcade Game',
    description: 'Jump, dodge enemies, collect coins, and beat your high score!',
    images: ['/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0070f3',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://skyrunner.game" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5194295653001385"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onError={(e) => console.error('AdSense script load error', e)}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
