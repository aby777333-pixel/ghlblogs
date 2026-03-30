'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/reports', label: 'Reports' },
  ];

  return (
    <header className="bg-brand-black sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center font-bold text-white text-sm tracking-tight">
              GHL
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg">GHL India</span>
              <span className="text-brand-grey-400 text-sm ml-2">Blog & Insights</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-grey-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://ghlindiaventures.com"
              target="_blank"
              className="ml-3 bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Visit GHL India
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-darkgrey border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-brand-grey-300 hover:text-white px-3 py-2 rounded-lg text-base"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://ghlindiaventures.com"
              target="_blank"
              className="block bg-brand-red text-white px-3 py-2 rounded-lg text-base text-center mt-2"
            >
              Visit GHL India
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
