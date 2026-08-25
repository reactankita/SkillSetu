import type { Metadata } from 'next';
import './globals.css';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: 'SkillSetu — Indian Student Skills Marketplace',
    template: '%s | SkillSetu',
  },
  description: SITE_CONFIG.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-900">
        {children}
      </body>
    </html>
  );
}
