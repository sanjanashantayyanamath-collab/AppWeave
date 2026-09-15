import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store/app-context';
import { EventToast } from '@/components/platform/EventToast';

export const metadata: Metadata = {
  title: 'AppWeave — Modular Multi-App SaaS Ecosystem',
  description:
    'A unified modular multi-app platform for architecture, interior design, and construction firms. One Identity, Shared Core, Entitlements Engine, and Cross-App Realtime Events.',
  keywords: ['Architecture SaaS', 'Modular Monolith', 'AppWeave', 'Construction Tech', 'Design Management'],
  authors: [{ name: 'ArchScale Guild Hackathon' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
        <AppProvider>
          {children}
          <EventToast />
        </AppProvider>
      </body>
    </html>
  );
}
