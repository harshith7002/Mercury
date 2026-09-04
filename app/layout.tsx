import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Mercury — Policy-Governed Agentic Commerce Platform',
  description: 'From AI intent to trusted transaction. Razorpay Buildathon 2026 Track 01 platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Mercury Agentic Commerce Engine — Built for Razorpay Buildathon 2026</span>
            <span className="text-slate-400">Track 01: AI Growth & Agentic Commerce</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
