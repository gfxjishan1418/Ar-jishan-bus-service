'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/context';
import {
  LayoutDashboard,
  Bus,
  Compass,
  Calendar,
  Ticket,
  CreditCard,
  RotateCcw,
  Navigation,
  Building,
  Settings,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, role } = useAuth();

  const adminMenu = [
    { href: '/admin', label: 'Analytics Overview', icon: LayoutDashboard },
    { href: '/admin#fleet', label: 'Fleet Management', icon: Bus },
    { href: '/admin#routes', label: 'Routes & Terminals', icon: Compass },
    { href: '/admin#trips', label: 'Scheduled Trips', icon: Calendar },
    { href: '/admin#bookings', label: 'Global Bookings', icon: Ticket },
    { href: '/admin#payments', label: 'Payments & Deposits', icon: CreditCard },
    { href: '/admin#refunds', label: 'Refunds Review Queue', icon: RotateCcw },
    { href: '/admin#gps', label: 'GPS Fleet Tracker', icon: Navigation },
    { href: '/admin#settings', label: 'Company Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      {/* Admin Top Header Banner */}
      <div className="bg-pureBlack text-white border-b border-charcoal py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo.png"
              alt="AR Jishan Luxury Smart Bus Service"
              className="h-10 w-auto object-contain hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-gold uppercase tracking-wider font-display">
                  Super Admin Operations Suite
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white">
                  LIVE DB
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Administrator: {user?.full_name || 'Managing Director'} • AR Jishan Luxury Smart Bus Service
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Database Role:</span>
            <span className="px-2.5 py-1 rounded bg-charcoal border border-gold/40 text-gold font-mono font-bold">
              SUPER_ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Management Modules
                </h3>
              </div>

              <nav className="space-y-1">
                {adminMenu.map((item) => {
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
              </nav>
            </div>
          </aside>

          {/* Admin Body */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
