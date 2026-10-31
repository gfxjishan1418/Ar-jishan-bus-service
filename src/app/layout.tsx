import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/context';
import { AuthProvider } from '@/lib/auth/context';

export const metadata: Metadata = {
  title: 'AR Jishan Luxury Smart Bus Service | Premium Bus Booking Bangladesh',
  description:
    'Experience premier highway transit in Bangladesh with AR Jishan. Luxurious AC, Sleeper, Business Class coaches, live GPS tracking, atomic seat booking & instant bKash checkout.',
  keywords: [
    'bus booking bangladesh',
    'ar jishan luxury bus',
    'dhaka to cox bazar bus',
    'dhaka to chattogram bus',
    'sleeper coach bangladesh',
    'bkash bus ticket',
    'online bus ticket bd',
  ],
  authors: [{ name: 'AR Jishan Luxury Smart Bus Service' }],
  openGraph: {
    title: 'AR Jishan Luxury Smart Bus Service | Safe Journey • Better Tomorrow',
    description: 'Ultra-premium bus travel across Dhaka, Chattogram, Cox’s Bazar, and Sylhet.',
    url: 'https://arjishanbus.com',
    siteName: 'AR Jishan Luxury Bus',
    locale: 'en_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-deepBlack antialiased selection:bg-gold selection:text-deepBlack">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
