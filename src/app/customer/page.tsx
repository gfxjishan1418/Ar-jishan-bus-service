'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { getAllBookings } from '@/lib/data/mock-db';
import { Booking } from '@/lib/types/database';
import { formatBDT, formatDateBD } from '@/lib/utils';
import { generateTicketPDF } from '@/lib/pdf/ticket-generator';
import {
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  RotateCcw,
  Navigation,
  AlertCircle,
  Check,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(() => getAllBookings());

  // Cancellation Modal State
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitted, setCancelSubmitted] = useState(false);

  const totalBookings = bookings.length;
  const upcomingTrips = bookings.filter((b) => b.booking_status === 'confirmed').length;
  const completedTrips = 3;
  const cancelledTrips = bookings.filter((b) => b.booking_status === 'cancelled').length;

  const handleDownloadPDF = async (b: Booking) => {
    try {
      await generateTicketPDF(b);
    } catch (err) {
      console.error('Download PDF error', err);
    }
  };

  const submitCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForCancel) return;

    // Update booking in local state
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBookingForCancel.id
          ? { ...b, booking_status: 'cancelled', payment_status: 'refunded' }
          : b
      )
    );
    setCancelSubmitted(true);
    setTimeout(() => {
      setCancelSubmitted(false);
      setSelectedBookingForCancel(null);
      setCancelReason('');
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Customer Dashboard
          </span>
          <h2 className="text-2xl font-black text-deepBlack tracking-tight mt-1 font-display">
            Welcome back, {user?.full_name || 'Passenger'}!
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your booked luxury coach tickets, track live bus departures, and view refunds.
          </p>
        </div>

        <Link
          href="/#search"
          className="px-6 py-3 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all"
        >
          Book New Ticket
        </Link>
      </div>

      {/* Overview Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">{t.dashboard.totalBookings}</span>
            <Ticket className="w-4 h-4 text-gold" />
          </div>
          <span className="text-2xl font-black text-deepBlack mt-2 block">{totalBookings}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">{t.dashboard.upcomingTrips}</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600 mt-2 block">{upcomingTrips}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">{t.dashboard.completedTrips}</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-deepBlack mt-2 block">{completedTrips}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">{t.dashboard.cancelledTrips}</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-black text-gray-400 mt-2 block">{cancelledTrips}</span>
        </div>
      </div>

      {/* Recent Bookings Table Card */}
      <div id="bookings" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-deepBlack font-display">
            {t.dashboard.recentBookings}
          </h3>
          <span className="text-xs text-gray-400 font-medium">All trips recorded in database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-luxuryGray text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <th className="py-3.5 px-6">PNR / ID</th>
                <th className="py-3.5 px-6">Route & Coach</th>
                <th className="py-3.5 px-6">Departure Date</th>
                <th className="py-3.5 px-6">Seats</th>
                <th className="py-3.5 px-6">Total Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-luxuryGray/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono font-black text-deepBlack block">{b.pnr}</span>
                    <span className="font-mono text-[10px] text-gray-400">{b.booking_id}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-bold text-deepBlack block">
                      {b.trip?.route?.origin?.name_en || 'Dhaka'} → {b.trip?.route?.destination?.name_en || 'Chattogram'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {b.trip?.bus?.name} ({b.boarding_point})
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-semibold text-deepBlack block">
                      {formatDateBD(b.trip?.departure_date || b.created_at)}
                    </span>
                    <span className="text-[10px] text-gold font-bold">
                      {b.trip?.departure_time || '07:30 AM'}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-gold-dark">
                    {b.seats.map((s) => s.seat_number).join(', ')}
                  </td>

                  <td className="py-4 px-6 font-bold text-deepBlack">
                    {formatBDT(b.total_amount)}
                  </td>

                  <td className="py-4 px-6">
                    {b.booking_status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleDownloadPDF(b)}
                      title="Download PDF Ticket"
                      className="p-2 rounded-lg bg-luxuryGray hover:bg-gold hover:text-deepBlack text-gray-700 transition-colors inline-flex items-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href="/track"
                      title="Track Coach"
                      className="p-2 rounded-lg bg-luxuryGray hover:bg-deepBlack hover:text-gold text-gray-700 transition-colors inline-flex items-center"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </Link>

                    {b.booking_status === 'confirmed' && (
                      <button
                        onClick={() => setSelectedBookingForCancel(b)}
                        title="Cancel & Request Refund"
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors inline-flex items-center"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation & Refund Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-lg text-deepBlack font-display">
                Ticket Cancellation & Refund
              </h3>
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="text-gray-400 hover:text-deepBlack text-base font-bold"
              >
                ✕
              </button>
            </div>

            {cancelSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Cancellation Submitted</h4>
                <p className="text-xs text-emerald-700">
                  Your ticket has been cancelled. Refund will be processed back to your payment account as per policy.
                </p>
              </div>
            ) : (
              <form onSubmit={submitCancellation} className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-luxuryGray space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking PNR:</span>
                    <span className="font-mono font-bold text-deepBlack">{selectedBookingForCancel.pnr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Paid:</span>
                    <span className="font-bold text-deepBlack">
                      {formatBDT(selectedBookingForCancel.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>Cancellation Fee (15%):</span>
                    <span>- {formatBDT(selectedBookingForCancel.total_amount * 0.15)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm text-emerald-700">
                    <span>Refundable Amount (85%):</span>
                    <span>{formatBDT(selectedBookingForCancel.total_amount * 0.85)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Reason for Cancellation *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule changed / travel postponed"
                    className="w-full px-3 py-2 rounded-xl bg-luxuryGray border border-gray-200 text-xs text-deepBlack focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForCancel(null)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
