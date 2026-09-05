import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Mercury — Where AI intent becomes commerce',
  description: 'Mercury gives AI buyers a machine-readable way to discover products, make decisions, and complete trusted transactions — while merchants stay in control.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans flex flex-col selection:bg-blue-600 selection:text-white overflow-x-hidden">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
