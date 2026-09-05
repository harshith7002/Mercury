'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Play, ShoppingBag, LayoutDashboard, Zap } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview', icon: Zap },
    { href: '/buyer', label: 'AI Buyer Hub', icon: ShoppingBag },
    { href: '/merchant', label: 'Merchant Console', icon: LayoutDashboard },
    { href: '/demo', label: 'Hackathon Demo Center', icon: Play, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-slate-950/60 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Brand Header */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-2xl tracking-tight text-white flex items-center gap-1.5 font-serif">
                Mercury<sup className="text-xs font-sans text-blue-400">®</sup>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 ml-1">
                  v1.0
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-sans tracking-wide uppercase">AI-Native Commerce Gateway</p>
            </div>
          </Link>

          {/* Razorpay Test Mode Badge */}
          <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="tracking-wider text-[11px] font-semibold">RAZORPAY TEST MODE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium text-white transition-transform duration-200 hover:scale-[1.03] cursor-pointer shadow-lg shadow-blue-950/50"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm backdrop-blur-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
