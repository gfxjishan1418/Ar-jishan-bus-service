'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import {
  Bus,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-pureBlack text-gray-300 border-t border-charcoal pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-charcoal/80">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="AR Jishan Luxury Smart Bus Service"
                style={{ maxHeight: '64px', maxWidth: '260px', height: '64px', width: 'auto' }}
                className="h-16 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
              />
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed">
              {t.footer.companyBio}
            </p>

            <div className="space-y-2 text-xs text-gray-300 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>123, Mirpur Road, Dhaka 1216, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Hotline: +880 1711 234567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>support@arjishanbus.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-gold pl-3">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/#search"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.nav.searchBus}
                </Link>
              </li>
              <li>
                <Link
                  href="/#routes"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.nav.routesFares}
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.nav.busTracking}
                </Link>
              </li>
              <li>
                <Link
                  href="/#counters"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.nav.counterLocations}
                </Link>
              </li>
              <li>
                <Link
                  href="/#fleet"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.fleet.title}
                </Link>
              </li>
              <li>
                <Link
                  href="/customer"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.nav.myBookings}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-gold pl-3">
              {t.footer.supportLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/policies#refund"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-gold/60" />
                  {t.footer.refundPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/policies#cancellation"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-gold/60" />
                  {t.footer.cancellationPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/policies#terms"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/policies#privacy"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-gold/60" />
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-gold/60" />
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods & Trust */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-gold pl-3">
              {t.footer.paymentMethods}
            </h4>
            <p className="text-xs text-gray-400">
              Instant and secure payment verification via Bangladesh tokenized MFS and major debit/credit cards.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-charcoal border border-charcoal-light">
                <div className="w-6 h-6 rounded bg-[#E2136E] flex items-center justify-center font-bold text-[10px] text-white">
                  bK
                </div>
                <span className="text-xs font-semibold text-white">bKash</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-charcoal border border-charcoal-light">
                <div className="w-6 h-6 rounded bg-[#F7941D] flex items-center justify-center font-bold text-[10px] text-white">
                  NG
                </div>
                <span className="text-xs font-semibold text-white">Nagad</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-charcoal border border-charcoal-light">
                <div className="w-6 h-6 rounded bg-[#1A1F71] flex items-center justify-center font-bold text-[9px] text-white">
                  VISA
                </div>
                <span className="text-xs font-semibold text-white">Visa</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-charcoal border border-charcoal-light">
                <div className="w-6 h-6 rounded bg-[#EB001B] flex items-center justify-center font-bold text-[8px] text-white">
                  MC
                </div>
                <span className="text-xs font-semibold text-white">Mastercard</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 pt-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-gold" />
              <span>Counter cash payment supported at all stations.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gold font-medium">Safe Journey • Better Tomorrow</span>
            <span>|</span>
            <Link href="/admin" className="hover:text-gold transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
