import './globals.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import { SpeedInsights } from "@vercel/speed-insights/next"

const description =
  'Software engineer studying Computer Science and Management at UBC. I build software people rely on, from first commit to production.';

// Vercel sets this on every deploy, so link previews point at the live domain.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Rayzell Tjandra | Portfolio',
  description,
  openGraph: {
    type: 'website',
    siteName: 'Rayzell Tjandra',
    title: 'Rayzell Tjandra',
    description,
  },
  twitter: { card: 'summary_large_image', title: 'Rayzell Tjandra', description },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-grid-radial">
        <Providers>
          <Header />
          <main className="min-h-screen px-4 md:px-16 lg:px-32 pt-[4.5rem]">
            {children}
            <SpeedInsights />
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
