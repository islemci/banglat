import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Banglat - fastest bang resolver',
  description: 'DuckDuckGo bangs are too slow. Use Banglat!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script 
          defer
          src="https://telemetry.tekir.co/script.js" 
          data-website-id="5bc03d2c-2055-4c60-bd27-c6010db0dd71"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}