'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getBookingByPNR, getAllBookings } from '@/lib/data/mock-db';
import { Booking } from '@/lib/types/database';
import { formatBDT, formatDateBD } from '@/lib/utils';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  Bus,
  Calendar,
  Clock,
  User,
} from 'lucide-react';

function VerifyTicketContent() {
  const searchParams = useSearchParams();
  const initialPnr = searchParams.get('pnr') || '';
  const [pnrInput, setPnrInput] = useState(initialPnr || 'AR8921X');
  const [verifiedTicket, setVerifiedTicket] = useState<Booking | null>(() => {
    return initialPnr ? getBookingByPNR(initialPnr) || null : getBookingByPNR('AR8921X') || null;
  });
  const [checked, setChecked] = useState(true);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pnrInput.trim().toUpperCase();
    const found = getBookingByPNR(clean);
    setVerifiedTicket(found || null);
    setChecked(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="bg-deepBlack text-white rounded-3xl p-8 border border-charcoal text-center space-y-4">
          <img
            src="/images/logo.png"
            alt="AR Jishan Luxury Smart Bus Service"
            className="h-16 w-auto mx-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)]"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Cryptographic Ticket Verification Portal
          </h1>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Authorized Conductor & Counter Steward Portal. Enter or scan passenger PNR to verify real-time seat validity.
          </p>

          <form onSubmit={handleVerify} className="max-w-md mx-auto flex gap-2 pt-4">
            <input
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              placeholder="Enter PNR (e.g. AR8921X)..."
              className="flex-1 px-4 py-3 rounded-xl bg-charcoal border border-charcoal-light text-xs font-semibold text-white focus:outline-none focus:border-gold uppercase"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold"
            >
              Verify Ticket
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {checked && verifiedTicket ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                    Verified Authentic Ticket
                  </span>
                  <h3 className="text-xl font-black text-deepBlack font-display">
                    PNR: {verifiedTicket.pnr}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase block font-bold">
                  Payment Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CONFIRMED PAID
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-luxuryGray space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">
                  Lead Passenger Name
                </span>
                <span className="font-bold text-deepBlack text-sm block">
                  {verifiedTicket.customer_name}
                </span>
                <span className="text-gray-500 font-mono block">
                  Contact: {verifiedTicket.customer_phone}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-luxuryGray space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">
                  Coach & Seats
                </span>
                <span className="font-bold text-deepBlack text-sm block">
                  {verifiedTicket.trip?.bus?.name} ({verifiedTicket.trip?.bus?.registration_number})
                </span>
                <span className="font-mono font-bold text-gold-dark text-sm block">
                  Seats: {verifiedTicket.seats.map((s) => s.seat_number).join(', ')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-luxuryGray space-y-1 sm:col-span-2">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">
                  Journey Itinerary
                </span>
                <span className="font-bold text-deepBlack block">
                  Boarding: {verifiedTicket.boarding_point}
                </span>
                <span className="font-bold text-deepBlack block">
                  Dropping: {verifiedTicket.dropping_point}
                </span>
                <span className="text-gray-500 text-[11px] block mt-1">
                  Scheduled Departure: {formatDateBD(verifiedTicket.trip?.departure_date || verifiedTicket.created_at)} at {verifiedTicket.trip?.departure_time || '07:30 AM'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800">
              <p className="font-bold">✓ Clearance Authorized for Boarding</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Steward may admit passengers to their designated seats.
              </p>
            </div>
          </div>
        ) : checked && !verifiedTicket ? (
          <div className="bg-white rounded-3xl border border-red-200 shadow-sm p-8 text-center space-y-3">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-deepBlack font-display">
              Invalid or Unrecognized PNR
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No active or confirmed booking record matches this identifier. Please verify the ticket or check with terminal administration.
            </p>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyTicketPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-deepBlack text-gold flex items-center justify-center">
          Loading Ticket Scanner...
        </div>
      }
    >
      <VerifyTicketContent />
    </Suspense>
  );
}
