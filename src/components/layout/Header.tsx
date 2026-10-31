'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import {
  Bus,
  Phone,
  Shield,
  Menu,
  X,
  User,
  Globe,
  Compass,
  MapPin,
  Calendar,
  Layers,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { user, role, logout, switchDemoRole, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-deepBlack border-b border-charcoal text-white shadow-lg">
      {/* Top micro bar for hotline and role switch */}
      <div className="bg-pureBlack border-b border-charcoal/50 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1.5 text-gold font-medium">
              <Phone className="w-3.5 h-3.5 text-gold" />
              24/7 Hotline: +880 1711 234567
            </span>
            <span className="hidden sm:inline-block text-gray-500">•</span>
            <span className="hidden sm:inline-block text-gray-400">
              Bangladesh Intercity Luxury Service
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher (Essential for evaluating full system) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-charcoal/80 border border-gold/30 text-gold text-xs hover:border-gold transition-colors"
                title="Switch role for testing Customer, Counter Staff, or Super Admin features"
              >
                <Shield className="w-3 h-3 text-gold" />
                <span>Role: {role.replace('_', ' ').toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-charcoal border border-gold/30 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-gray-400 border-b border-charcoal-light">
                    Test Role Switcher:
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('customer');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-gold/10 hover:text-gold ${
                      role === 'customer' ? 'text-gold font-bold' : 'text-gray-200'
                    }`}
                  >
                    👤 Passenger / Customer
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('counter_operator');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-gold/10 hover:text-gold ${
                      role === 'counter_operator' ? 'text-gold font-bold' : 'text-gray-200'
                    }`}
                  >
                    🏢 Counter Ticket Agent
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('super_admin');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-gold/10 hover:text-gold ${
                      role === 'super_admin' ? 'text-gold font-bold' : 'text-gray-200'
                    }`}
                  >
                    👑 Super Admin Suite
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-charcoal px-2 py-0.5 rounded border border-charcoal-light">
              <Globe className="w-3.5 h-3.5 text-gold" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-1 rounded text-xs transition-colors ${
                  language === 'en' ? 'text-gold font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-1 rounded text-xs transition-colors ${
                  language === 'bn' ? 'text-gold font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group py-1">
            <img
              src="/images/logo.png"
              alt="AR Jishan Luxury Smart Bus Service"
              style={{ maxHeight: '56px', maxWidth: '240px', height: '56px', width: 'auto' }}
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-300 hover:text-gold transition-colors py-1"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/#search"
              className="text-gray-300 hover:text-gold transition-colors py-1"
            >
              {t.nav.searchBus}
            </Link>
            <Link
              href="/#routes"
              className="text-gray-300 hover:text-gold transition-colors py-1"
            >
              {t.nav.routesFares}
            </Link>
            <Link
              href="/track"
              className="text-gray-300 hover:text-gold transition-colors py-1 flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.nav.busTracking}
            </Link>
            <Link
              href="/#counters"
              className="text-gray-300 hover:text-gold transition-colors py-1"
            >
              {t.nav.counterLocations}
            </Link>
            <Link
              href="/#fleet"
              className="text-gray-300 hover:text-gold transition-colors py-1"
            >
              {t.fleet.title}
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-gold transition-colors py-1"
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* User Account / Navigation CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {role === 'counter_operator' || role === 'counter_manager' ? (
              <Link
                href="/counter"
                className="px-4 py-2 rounded-lg bg-gold text-deepBlack font-semibold text-xs tracking-wide uppercase hover:bg-gold-light transition-all shadow-gold flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4" />
                {t.nav.counterPortal}
              </Link>
            ) : role === 'admin' || role === 'super_admin' ? (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg bg-gold text-deepBlack font-semibold text-xs tracking-wide uppercase hover:bg-gold-light transition-all shadow-gold flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                {t.nav.adminPanel}
              </Link>
            ) : null}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/customer"
                  className="px-3.5 py-2 rounded-lg bg-charcoal border border-gold/40 text-gold hover:bg-gold hover:text-deepBlack transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  {t.nav.myBookings}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-2 text-xs font-medium text-gray-300 hover:text-gold transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/login?register=true"
                  className="px-4 py-2 rounded-lg bg-gold text-deepBlack font-bold text-xs uppercase tracking-wide hover:bg-gold-light transition-all shadow-gold"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-charcoal text-gold hover:bg-charcoal-light transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-pureBlack border-b border-charcoal px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-charcoal hover:text-gold"
          >
            {t.nav.home}
          </Link>
          <Link
            href="/#search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-charcoal hover:text-gold"
          >
            {t.nav.searchBus}
          </Link>
          <Link
            href="/#routes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-charcoal hover:text-gold"
          >
            {t.nav.routesFares}
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-charcoal hover:text-gold"
          >
            {t.nav.busTracking}
          </Link>
          <Link
            href="/#counters"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-charcoal hover:text-gold"
          >
            {t.nav.counterLocations}
          </Link>
          <Link
            href="/customer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gold bg-charcoal/50 border border-gold/20"
          >
            {t.nav.dashboard} / {t.nav.myBookings}
          </Link>

          {(role === 'counter_operator' || role === 'counter_manager') && (
            <Link
              href="/counter"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-deepBlack bg-gold"
            >
              {t.nav.counterPortal}
            </Link>
          )}

          {(role === 'admin' || role === 'super_admin') && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-deepBlack bg-gold"
            >
              {t.nav.adminPanel}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
