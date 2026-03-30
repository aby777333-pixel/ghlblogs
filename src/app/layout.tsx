import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'GHL India Ventures Blog | Market Insights & Analysis',
  description: 'Stay informed with the latest forex market analysis, trading insights, and expert research reports from GHL India Ventures.',
  keywords: 'forex, trading, market analysis, GHL India, financial insights, investment research',
  openGraph: {
    title: 'GHL India Ventures Blog',
    description: 'Expert forex market analysis and trading insights',
    siteName: 'GHL India Ventures Blog',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
