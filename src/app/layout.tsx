import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'सेवाखोज - SewaKhoj | Find Trusted Service Providers in Nepal',
  description: 'Connect with trusted technicians and service providers across Nepal. Find plumbers, electricians, carpenters, and more with ratings and reviews.',
  keywords: 'sewakhoj, service providers, technicians, nepal, plumber, electrician, carpenter, home services, repair services',
  authors: [{ name: 'SewaKhoj Team' }],
  creator: 'SewaKhoj',
  publisher: 'SewaKhoj',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sewakhoj.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'सेवाखोज - SewaKhoj',
    description: 'Find trusted service providers in Nepal',
    url: 'https://sewakhoj.com',
    siteName: 'SewaKhoj',
    locale: 'ne_NP',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SewaKhoj - Find Service Providers in Nepal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'सेवाखोज - SewaKhoj',
    description: 'Find trusted service providers in Nepal',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SewaKhoj" />
        <meta name="application-name" content="SewaKhoj" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
