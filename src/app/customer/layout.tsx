'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import {
  LayoutDashboard,
  Ticket,
  Clock,
  CheckCircle,
  FileDown,
  Navigation,
  RotateCcw,
  Receipt,
  User,
  LogOut,
  Bus,
} from 'lucide-react';

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/customer', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/customer#bookings', label: 'My Bookings', icon: Ticket },
    { href: '/customer#upcoming', label: 'Upcoming Trips', icon: Clock },
    { href: '/track', label: 'Track My Bus', icon: Navigation },
    { href: '/customer#refunds', label: 'Return & Refunds', icon: RotateCcw },
    { href: '/customer#profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              {/* Brand Logo Header */}
              <div className="pb-4 border-b border-gray-100 flex justify-center">
                <img
                  src="/images/logo.png"
                  alt="AR Jishan Luxury Smart Bus Service"
                  className="h-12 w-auto object-contain"
                />
              </div>

              {/* User Profile Mini Card */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-charcoal border-2 border-gold flex items-center justify-center text-gold font-bold text-base">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-deepBlack truncate">
                    {user?.full_name || 'Passenger User'}
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate">{user?.phone || '017XXXXXXXX'}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold-dark uppercase tracking-wider">
                    {user?.role || 'Customer'}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
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

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Body */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
