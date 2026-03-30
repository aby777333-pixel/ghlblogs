import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'GHL India Ventures Blog | AIF & Real Estate Investment Insights',
  description: 'Stay informed with expert AIF analysis, real estate investment insights, and research reports from GHL India Ventures.',
  keywords: 'AIF, alternative investment fund, real estate investing, GHL India, investment insights, wealth management',
  openGraph: {
    title: 'GHL India Ventures Blog',
    description: 'Expert AIF & real estate investment insights and analysis',
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
