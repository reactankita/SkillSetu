import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/config/site';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

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
    <html lang="en" className={`h-full scroll-smooth ${manrope.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-orange-100 selection:text-orange-900">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
