'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { getAllBookings, getBookingByPNR } from '@/lib/data/mock-db';
import { Booking } from '@/lib/types/database';
import { formatBDT, formatDateBD } from '@/lib/utils';
import { generateTicketPDF, generateTicketQRCodeDataURL } from '@/lib/pdf/ticket-generator';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Printer,
  Bus,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();

  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    // Fire festive luxury confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#111111', '#AA8214', '#F3E5AB'],
      });
    } catch {
      // ignore
    }

    const all = getAllBookings();
    const found = all.find((b) => b.booking_id === bookingId) || getBookingByPNR(bookingId) || all[0];
    if (found) {
      setBooking(found);
      generateTicketQRCodeDataURL(found.qr_code_data || found.pnr).then((url) => {
        setQrCodeDataUrl(url);
      });
    }
  }, [bookingId]);

  const handleDownloadPDF = async () => {
    if (!booking) return;
    setIsGeneratingPdf(true);
    try {
      await generateTicketPDF(booking);
    } catch (err) {
      console.error('PDF error', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-luxuryGray flex items-center justify-center text-sm font-semibold text-deepBlack">
        Loading Confirmed Ticket...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Success Alert Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold shadow-gold">
            <CheckCircle2 className="w-10 h-10 text-gold stroke-[2]" />
          </div>

          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Payment & Reservation Verified
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-deepBlack tracking-tight mt-1 font-display">
              {t.ticket.confirmedTitle}
            </h1>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-2">
              Your electronic ticket has been issued with guaranteed seat confirmation.
            </p>
          </div>

          {/* PNR & Booking ID Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="px-5 py-3 rounded-2xl bg-luxuryGray border border-gray-200">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                {t.ticket.pnr}
              </span>
              <span className="font-mono font-black text-xl text-deepBlack tracking-wider">
                {booking.pnr}
              </span>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-luxuryGray border border-gray-200">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                {t.ticket.bookingId}
              </span>
              <span className="font-mono font-bold text-base text-gray-700 tracking-wider">
                {booking.booking_id}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-6 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : t.ticket.downloadPdf}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-3.5 rounded-xl bg-deepBlack text-white hover:bg-charcoal font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{t.ticket.printTicket}</span>
            </button>
          </div>
        </div>

        {/* Printable Ticket Display Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
          {/* Ticket Header */}
          <div className="flex flex-wrap items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="AR Jishan Luxury Smart Bus Service"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase">
                Payment Status
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Paid ({booking.payment_method?.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Journey Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Coach Details</span>
              <span className="font-bold text-deepBlack text-sm mt-0.5 block">
                {booking.trip?.bus?.name || 'AR Royal Gold Express'}
              </span>
              <span className="text-gray-500 text-[11px] block">
                {booking.trip?.bus?.bus_type} • {booking.trip?.bus?.registration_number}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Date & Departure</span>
              <span className="font-bold text-deepBlack text-sm mt-0.5 block">
                {formatDateBD(booking.trip?.departure_date || new Date().toISOString())}
              </span>
              <span className="text-gold font-bold text-[11px] block">
                {booking.trip?.departure_time || '07:30 AM'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Confirmed Seats</span>
              <span className="font-mono font-black text-lg text-gold-dark mt-0.5 block">
                {booking.seats.map((s) => s.seat_number).join(', ')}
              </span>
              <span className="text-gray-500 text-[11px] block">
                Total Passengers: {booking.total_seats}
              </span>
            </div>
          </div>

          {/* Boarding and Dropping points */}
          <div className="p-4 rounded-2xl bg-luxuryGray border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 text-[10px] font-bold uppercase block">Boarding Station</span>
              <span className="font-bold text-deepBlack mt-0.5 block">{booking.boarding_point}</span>
            </div>

            <div>
              <span className="text-gray-400 text-[10px] font-bold uppercase block">Dropping Station</span>
              <span className="font-bold text-deepBlack mt-0.5 block">{booking.dropping_point}</span>
            </div>
          </div>

          {/* Passenger Manifest & QR Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            <div className="md:col-span-8 space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Passenger Manifest
              </h4>
              <div className="space-y-2">
                {booking.seats.map((seat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-deepBlack text-gold font-bold flex items-center justify-center text-xs">
                        {seat.seat_number}
                      </span>
                      <span className="font-bold text-deepBlack">{seat.passenger_name}</span>
                      <span className="text-gray-400 text-[11px]">({seat.gender})</span>
                    </div>
                    <span className="font-bold text-deepBlack">{formatBDT(seat.fare)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code Container */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-luxuryGray border border-gray-200">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Ticket QR Verification" className="w-32 h-32" />
              ) : (
                <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
              )}
              <span className="text-[10px] text-gray-500 font-medium mt-2 text-center">
                Scan for Conductor Verification
              </span>
            </div>
          </div>

          {/* Notice & Support */}
          <div className="pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
            <p className="font-bold text-gray-700">Passenger Notice:</p>
            <p>{t.ticket.importantNote}</p>
          </div>
        </div>

        {/* Bottom CTA to Track or Dashboard */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link
            href="/"
            className="text-gray-600 hover:text-deepBlack font-bold transition-colors"
          >
            ← {t.ticket.returnHome}
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/track"
              className="px-5 py-2.5 rounded-xl bg-charcoal text-gold font-bold hover:bg-deepBlack transition-colors flex items-center gap-1.5"
            >
              <span>{t.ticket.trackBus}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/customer"
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-deepBlack font-bold hover:border-gold transition-colors"
            >
              My Customer Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
