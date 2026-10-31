'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import {
  Building2,
  Ticket,
  Printer,
  Users,
  Banknote,
  RotateCcw,
  FileText,
  ShieldAlert,
  LogOut,
} from 'lucide-react';

export default function CounterPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const counterNav = [
    { href: '/counter', label: 'Counter Overview', icon: Building2 },
    { href: '/counter#fast-book', label: 'Quick Counter Booking', icon: Ticket },
    { href: '/counter#manifest', label: 'Departure Manifest', icon: Users },
    { href: '/counter#cash-report', label: 'Daily Cash Report', icon: Banknote },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      {/* Counter Station Top Ribbon */}
      <div className="bg-charcoal text-white border-b border-charcoal-light py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo.png"
              alt="AR Jishan Luxury Smart Bus Service"
              className="h-10 w-auto object-contain hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Dhaka Head Counter (Gabtoli)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold text-deepBlack">
                  DHK-GBT-01
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Logged in Operator: {user?.full_name || 'Counter Operator'} • 24/7 Terminal Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-deepBlack border border-gold/30 text-gold font-bold">
              Drawer Balance: ৳ 16,800
            </div>
          </div>
        </div>
      </div>

      {/* Main Counter Interface */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Counter Terminal Menu
                </h3>
              </div>

              <nav className="space-y-1">
                {counterNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-deepBlack text-gold shadow-sm'
                          : 'text-gray-600 hover:bg-luxuryGray hover:text-deepBlack'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href="/#search"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-deepBlack bg-gold/15 hover:bg-gold/25 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-gold-dark" />
                    <span>Search All Buses</span>
                  </Link>
                </div>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
