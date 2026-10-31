'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { getAllBookings, INITIAL_TRIPS } from '@/lib/data/mock-db';
import { Booking } from '@/lib/types/database';
import { formatBDT, formatDateBD } from '@/lib/utils';
import { generateTicketPDF } from '@/lib/pdf/ticket-generator';
import {
  Banknote,
  Ticket,
  Printer,
  Search,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  Download,
} from 'lucide-react';

export default function CounterPortalPage() {
  const { user } = useAuth();
  const [bookings] = useState<Booking[]>(() => getAllBookings());
  const [pnrSearch, setPnrSearch] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<Booking | null>(null);

  const handleSearchPNR = (e: React.FormEvent) => {
    e.preventDefault();
    const query = pnrSearch.trim().toUpperCase();
    const found = bookings.find((b) => b.pnr.toUpperCase() === query || b.booking_id.toUpperCase() === query);
    setSearchedTicket(found || null);
  };

  const handleReprintPDF = async (b: Booking) => {
    try {
      await generateTicketPDF(b);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Station Counter Terminal
          </span>
          <h2 className="text-2xl font-black text-deepBlack tracking-tight mt-1 font-display">
            Counter Sales & Passenger Dispatch
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Issue spot tickets with cash receipting, print e-tickets, and verify departing passengers.
          </p>
        </div>

        <Link
          href="/#search"
          className="px-6 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all"
        >
          + Issue New Ticket
        </Link>
      </div>

      {/* Station Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Today&apos;s Counter Sales</span>
            <Ticket className="w-4 h-4 text-gold" />
          </div>
          <span className="text-2xl font-black text-deepBlack mt-2 block">14 Tickets</span>
          <span className="text-[10px] text-gray-400">Issued at Gabtoli Desk</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Cash Collected</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600 mt-2 block">৳ 16,800</span>
          <span className="text-[10px] text-emerald-700">Reconciled in physical drawer</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Scheduled Departures</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-deepBlack mt-2 block">5 Coaches</span>
          <span className="text-[10px] text-gray-400">Boarding from this terminal</span>
        </div>
      </div>

      {/* Fast PNR Search & Reprint Desk */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-sm text-deepBlack flex items-center gap-2">
          <Search className="w-4 h-4 text-gold" />
          Instant PNR Ticket Search & Conductor Reprint
        </h3>

        <form onSubmit={handleSearchPNR} className="flex gap-2">
          <input
            type="text"
            value={pnrSearch}
            onChange={(e) => setPnrSearch(e.target.value)}
            placeholder="Enter PNR Number (e.g. AR8921X) or Booking ID..."
            className="flex-1 px-4 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold uppercase"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-deepBlack text-white hover:bg-gold hover:text-deepBlack font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Find Ticket
          </button>
        </form>

        {searchedTicket && (
          <div className="p-4 rounded-xl bg-gold/10 border border-gold/40 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-mono font-black text-deepBlack text-sm block">
                {searchedTicket.pnr} ({searchedTicket.customer_name})
              </span>
              <span className="text-gray-600 mt-0.5 block">
                Route: {searchedTicket.boarding_point} → {searchedTicket.dropping_point} • Seats:{' '}
                {searchedTicket.seats.map((s) => s.seat_number).join(', ')}
              </span>
            </div>

            <button
              onClick={() => handleReprintPDF(searchedTicket)}
              className="px-4 py-2 rounded-lg bg-deepBlack text-gold hover:bg-gold hover:text-deepBlack font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Ticket</span>
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Departures Manifest */}
      <div id="manifest" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-deepBlack font-display">
              Terminal Departure Schedule
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Today&apos;s bus arrivals and boarding schedules for Dhaka Gabtoli Terminal
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {INITIAL_TRIPS.slice(0, 3).map((t) => (
            <div key={t.id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-luxuryGray/40 text-xs">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold-dark uppercase">
                  {t.bus?.bus_type}
                </span>
                <h4 className="font-bold text-sm text-deepBlack mt-0.5">
                  {t.bus?.name} ({t.bus?.registration_number})
                </h4>
                <p className="text-gray-500 text-[11px]">
                  Destination: {t.route?.destination?.name_en} • Departure Time:{' '}
                  <span className="font-bold text-deepBlack">{t.departure_time}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Seats Status</span>
                  <span className="font-bold text-emerald-600">
                    {t.available_seats_count} Seats Available
                  </span>
                </div>

                <Link
                  href={`/booking/${t.id}`}
                  className="px-4 py-2 rounded-xl bg-deepBlack text-white hover:bg-gold hover:text-deepBlack font-bold text-xs transition-colors"
                >
                  Spot Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
