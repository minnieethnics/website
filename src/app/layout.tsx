import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThreadCanvas } from '@/components/ui/ThreadCanvas';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/shop/CartDrawer';

export const metadata: Metadata = {
  title: 'Minnie Ethnics — Because Traditions Start Young',
  description:
    'Designer ethnic wear for children aged 0–5. Hand-embroidered, elegantly crafted, affordable. Based in Kolkata.',
  keywords: ['kids ethnic wear', 'baby ethnic clothes', 'children kurta', 'kids lehenga', 'Indian baby clothes'],
  openGraph: {
    title: 'Minnie Ethnics',
    description: 'Designer ethnic wear for children aged 0–5',
    url: 'https://minnieethnics.com',
    siteName: 'Minnie Ethnics',
    locale: 'en_IN',
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
      <body>
        <ThreadCanvas />
        <div className="page-content">
          <Navbar />
          <CartDrawer />
          {children}
        </div>
      </body>
    </html>
  );
}
