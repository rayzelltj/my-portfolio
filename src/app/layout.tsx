import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Rayzell Tjandra | Portfolio',
  description: 'Creative developer portfolio',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white font-sans">
        <Header />
        <main className="min-h-screen px-4 md:px-16 lg:px-32 pt-[4.5rem]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}