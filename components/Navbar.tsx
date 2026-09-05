'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/buyer', label: 'AI Buyer' },
    { href: '/merchant', label: 'Merchant' },
    { href: '/demo', label: 'Demo' },
  ];

  return (
    <nav className="w-full relative z-10">
      <div className="flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl tracking-tight text-foreground select-none flex items-center gap-0.5 hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          MERCURY<sup className="text-xs font-sans">®</sup>
        </Link>

        {/* Nav Links (hidden on mobile, md:flex) */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Nav CTA */}
        <Link
          href="/buyer"
          className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform duration-200 cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Enter Mercury</span>
          <span className="text-xs">→</span>
        </Link>
      </div>
    </nav>
  );
}
