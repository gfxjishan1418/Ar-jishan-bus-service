'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import {
  INITIAL_TRIPS,
  INITIAL_COUPONS,
  acquireSeatLocks,
  releaseSeatLocks,
  getBookedAndLockedSeats,
  confirmBookingRecord,
} from '@/lib/data/mock-db';
import { Booking, BookingPassenger, PaymentMethod } from '@/lib/types/database';
import { formatBDT, formatDateBD, generatePNR, generateBookingId } from '@/lib/utils';
import { bkashAdapter } from '@/lib/payments/bkash';
import {
  Bus,
  Clock,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Timer,
  Lock,
  Tag,
  Check,
} from 'lucide-react';

// Generates typical 40-seat or 28-seat 2x2 bus seat map (A1..J4)
function generateSeatLayout(busType: string) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  if (busType === 'Business Class') {
    // 1x2 seating
    return rows.slice(0, 8).map((r) => [
      { id: `${r}1`, col: 1, isLeft: true },
      { id: `${r}2`, col: 2, isLeft: false },
      { id: `${r}3`, col: 3, isLeft: false },
    ]);
  }
  if (busType === 'Sleeper Coach') {
    // Flat pods
    return rows.slice(0, 6).map((r) => [
      { id: `S${r}1`, col: 1, isLeft: true, isSleeper: true },
      { id: `S${r}2`, col: 2, isLeft: false, isSleeper: true },
    ]);
  }
  // Standard 2x2
  return rows.slice(0, 9).map((r) => [
    { id: `${r}1`, col: 1, isLeft: true },
    { id: `${r}2`, col: 2, isLeft: true },
    { id: `${r}3`, col: 3, isLeft: false },
    { id: `${r}4`, col: 4, isLeft: false },
  ]);
}

export default function BookingFlowPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { user, role, isCounterStaff } = useAuth();

  const tripId = params.tripId as string;
  const trip = INITIAL_TRIPS.find((t) => t.id === tripId) || INITIAL_TRIPS[0];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1); // 1: Seats, 2: Passengers & Summary, 3: Payment
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [sessionId] = useState(() => 'sess-' + Math.random().toString(36).substring(2, 9));
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number>(600); // 10 mins in seconds
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Passenger state
  const [passengerData, setPassengerData] = useState<Record<string, { name: string; gender: 'male' | 'female' }>>({});
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '01711998877');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [boardingPoint, setBoardingPoint] = useState(trip.boarding_points[0] || '');
  const [droppingPoint, setDroppingPoint] = useState(trip.dropping_points[0] || '');

  // Payment & Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    isCounterStaff ? 'cash' : 'bkash'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch booked & locked seats
  useEffect(() => {
    const { booked, locked } = getBookedAndLockedSeats(trip.id, sessionId);
    setBookedSeats(booked);
    setLockedSeats(locked);
  }, [trip.id, sessionId]);

  // Lock timer countdown
  useEffect(() => {
    if (selectedSeats.length === 0) return;
    const interval = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          releaseSeatLocks(trip.id, selectedSeats, sessionId);
          setSelectedSeats([]);
          setErrorMessage('Seat lock expired. Please select your seats again.');
          setCurrentStep(1);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats, trip.id, sessionId]);

  const seatRows = generateSeatLayout(trip.bus?.bus_type || '');

  // Seat toggle handler with atomic pre-check
  const toggleSeat = (seatId: string) => {
    setErrorMessage(null);

    if (bookedSeats.includes(seatId)) {
      setErrorMessage(`Seat ${seatId} is already booked.`);
      return;
    }
    if (lockedSeats.includes(seatId)) {
      setErrorMessage(`Seat ${seatId} is currently held in checkout by another customer.`);
      return;
    }

    if (selectedSeats.includes(seatId)) {
      const updated = selectedSeats.filter((s) => s !== seatId);
      releaseSeatLocks(trip.id, [seatId], sessionId);
      setSelectedSeats(updated);
    } else {
      if (selectedSeats.length >= 4) {
        setErrorMessage('Maximum 4 seats can be booked in a single transaction.');
        return;
      }
      const newSelection = [...selectedSeats, seatId];
      // Atomic lock attempt
      const lockRes = acquireSeatLocks(trip.id, newSelection, sessionId, user?.id);
      if (!lockRes.success) {
        setErrorMessage(lockRes.error || 'Seat could not be locked. Please choose another.');
        return;
      }
      setSelectedSeats(newSelection);
      setLockTimeRemaining(600); // reset 10m TTL
    }
  };

  // Fare calculations
  const seatFareTotal = selectedSeats.length * trip.base_fare;
  const serviceCharge = selectedSeats.length > 0 ? 50 : 0;
  const netTotal = Math.max(0, seatFareTotal + serviceCharge - discountAmount);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const query = couponCode.trim().toUpperCase();
    const cpn = INITIAL_COUPONS.find((c) => c.code === query && c.is_active);

    if (!cpn) {
      setErrorMessage('Invalid or expired promotional coupon code.');
      setCouponSuccess(false);
      return;
    }

    if (seatFareTotal < cpn.min_booking_amount) {
      setErrorMessage(`Minimum booking amount of ${formatBDT(cpn.min_booking_amount)} required.`);
      setCouponSuccess(false);
      return;
    }

    let calculatedDiscount = 0;
    if (cpn.discount_type === 'percentage') {
      calculatedDiscount = (seatFareTotal * cpn.discount_value) / 100;
      if (cpn.max_discount_amount && calculatedDiscount > cpn.max_discount_amount) {
        calculatedDiscount = cpn.max_discount_amount;
      }
    } else {
      calculatedDiscount = cpn.discount_value;
    }

    setDiscountAmount(calculatedDiscount);
    setCouponSuccess(true);
    setErrorMessage(null);
  };

  // Confirm and Pay Booking Handler
  const handleConfirmAndPay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Re-verify atomic lock
      const lockRes = acquireSeatLocks(trip.id, selectedSeats, sessionId, user?.id);
      if (!lockRes.success) {
        setErrorMessage('Seat reservation failed: ' + lockRes.error);
        setIsProcessing(false);
        return;
      }

      // Build passengers array
      const manifestPassengers: BookingPassenger[] = selectedSeats.map((seatId) => {
        const p = passengerData[seatId];
        return {
          seat_number: seatId,
          passenger_name: p?.name || customerName || 'Passenger',
          gender: p?.gender || 'male',
          fare: trip.base_fare,
          contact_number: customerPhone,
        };
      });

      const generatedPNR = generatePNR();
      const generatedBookingId = generateBookingId();

      const newBooking: Booking = {
        id: 'bkg-' + Date.now(),
        booking_id: generatedBookingId,
        pnr: generatedPNR,
        trip_id: trip.id,
        trip: trip,
        customer_id: user?.id,
        customer_name: customerName || 'Valued Passenger',
        customer_email: customerEmail || undefined,
        customer_phone: customerPhone,
        boarding_point: boardingPoint,
        dropping_point: droppingPoint,
        total_seats: selectedSeats.length,
        subtotal_fare: seatFareTotal,
        service_charge: serviceCharge,
        discount_amount: discountAmount,
        total_amount: netTotal,
        booking_status: 'confirmed',
        payment_status: 'paid',
        payment_method: selectedPayment,
        booking_channel: isCounterStaff ? 'counter' : 'online',
        counter_id: isCounterStaff ? 'counter-1' : undefined,
        qr_code_data: `VERIFY:${generatedPNR}:${generatedBookingId}`,
        seats: manifestPassengers,
        created_at: new Date().toISOString(),
      };

      // Save confirmed record to memory store & clear locks
      confirmBookingRecord(newBooking);

      // Navigate to confirmed e-ticket page
      router.push(`/booking/confirmation/${newBooking.booking_id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment or booking creation failed.');
      setIsProcessing(false);
    }
  };

  const minutesRemaining = Math.floor(lockTimeRemaining / 60);
  const secondsRemaining = String(lockTimeRemaining % 60).padStart(2, '0');

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      {/* Top Breadcrumb & Timer Banner */}
      <div className="bg-deepBlack text-white border-b border-charcoal py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-charcoal border border-gold/40 flex items-center justify-center font-bold text-gold text-xs">
              {currentStep}
            </span>
            <div>
              <h1 className="text-base font-bold text-white font-display">
                {currentStep === 1 && 'Step 1: Interactive Seat Selection'}
                {currentStep === 2 && 'Step 2: Passenger Details & Summary'}
                {currentStep === 3 && 'Step 3: Secure Payment Verification'}
              </h1>
              <p className="text-xs text-gray-400">
                {trip.bus?.name} ({trip.bus?.bus_type}) • {formatDateBD(trip.departure_date)} at {trip.departure_time}
              </p>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal border border-gold/40 text-gold text-xs font-mono font-bold">
              <Timer className="w-4 h-4 animate-spin text-gold" />
              <span>
                {t.booking.timeRemaining}: {minutesRemaining}:{secondsRemaining}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Booking Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* STEP 1: Interactive Seat Map */}
          {currentStep === 1 && (
            <>
              {/* Bus Interior Deck */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="font-bold text-base text-deepBlack font-display">
                      Coach Seat Layout
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Select your preferred seats. Up to 4 passengers per booking.
                    </p>
                  </div>

                  {/* Seat Legend */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border border-gray-300 bg-white" />
                      {t.booking.available}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-gold text-deepBlack" />
                      {t.booking.selected}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-charcoal" />
                      {t.booking.booked}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-amber-400" />
                      {t.booking.locked}
                    </span>
                  </div>
                </div>

                {/* Bus Cabin Box */}
                <div className="max-w-md mx-auto bg-luxuryGray border-2 border-gray-300 rounded-3xl p-6 shadow-inner relative">
                  {/* Front Cabin Windshield & Driver Seat */}
                  <div className="flex items-center justify-between pb-6 border-b-2 border-dashed border-gray-300 mb-6">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      {t.booking.door}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-deepBlack text-gold text-xs font-bold shadow-sm">
                      <Bus className="w-4 h-4" />
                      <span>{t.booking.driver}</span>
                    </div>
                  </div>

                  {/* Rows Grid */}
                  <div className="space-y-3">
                    {seatRows.map((row, rIdx) => {
                      const leftSeats = row.filter((s) => s.isLeft);
                      const rightSeats = row.filter((s) => !s.isLeft);

                      return (
                        <div key={rIdx} className="flex items-center justify-between">
                          {/* Left Seats */}
                          <div className="flex items-center gap-2">
                            {leftSeats.map((seat) => {
                              const isSelected = selectedSeats.includes(seat.id);
                              const isBooked = bookedSeats.includes(seat.id);
                              const isLocked = lockedSeats.includes(seat.id);

                              return (
                                <button
                                  key={seat.id}
                                  type="button"
                                  disabled={isBooked || isLocked}
                                  onClick={() => toggleSeat(seat.id)}
                                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                                    isSelected
                                      ? 'bg-gold border-gold-dark text-deepBlack shadow-gold scale-105'
                                      : isBooked
                                      ? 'bg-charcoal border-charcoal text-gray-500 cursor-not-allowed opacity-80'
                                      : isLocked
                                      ? 'bg-amber-100 border-amber-300 text-amber-700 cursor-not-allowed'
                                      : 'bg-white border-gray-300 text-gray-800 hover:border-gold hover:text-gold shadow-sm'
                                  }`}
                                >
                                  {isLocked ? <Lock className="w-3 h-3" /> : seat.id}
                                </button>
                              );
                            })}
                          </div>

                          {/* Aisle Walking Space */}
                          <div className="w-6 sm:w-8 text-center text-[10px] text-gray-400 font-mono">
                            |
                          </div>

                          {/* Right Seats */}
                          <div className="flex items-center gap-2">
                            {rightSeats.map((seat) => {
                              const isSelected = selectedSeats.includes(seat.id);
                              const isBooked = bookedSeats.includes(seat.id);
                              const isLocked = lockedSeats.includes(seat.id);

                              return (
                                <button
                                  key={seat.id}
                                  type="button"
                                  disabled={isBooked || isLocked}
                                  onClick={() => toggleSeat(seat.id)}
                                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                                    isSelected
                                      ? 'bg-gold border-gold-dark text-deepBlack shadow-gold scale-105'
                                      : isBooked
                                      ? 'bg-charcoal border-charcoal text-gray-500 cursor-not-allowed opacity-80'
                                      : isLocked
                                      ? 'bg-amber-100 border-amber-300 text-amber-700 cursor-not-allowed'
                                      : 'bg-white border-gray-300 text-gray-800 hover:border-gold hover:text-gold shadow-sm'
                                  }`}
                                >
                                  {isLocked ? <Lock className="w-3 h-3" /> : seat.id}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-base text-deepBlack border-b border-gray-100 pb-3 font-display">
                    Trip & Fare Summary
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Route:</span>
                      <span className="font-bold text-deepBlack">
                        {trip.route?.origin?.name_en} → {trip.route?.destination?.name_en}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Departure:</span>
                      <span className="font-bold text-deepBlack">{trip.departure_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fare per seat:</span>
                      <span className="font-bold text-deepBlack">{formatBDT(trip.base_fare)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-gray-700 font-bold">Selected Seats:</span>
                      <span className="font-mono font-bold text-gold text-sm">
                        {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                      </span>
                    </div>
                  </div>

                  {/* Fare breakdown */}
                  <div className="p-4 rounded-xl bg-luxuryGray space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({selectedSeats.length} seats):</span>
                      <span className="font-semibold text-deepBlack">{formatBDT(seatFareTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Charge:</span>
                      <span className="font-semibold text-deepBlack">{formatBDT(serviceCharge)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm text-deepBlack">
                      <span>Total Amount:</span>
                      <span className="text-gold-dark text-base">{formatBDT(netTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={selectedSeats.length === 0}
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>{t.booking.continueToPassenger}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Passenger Details & Boarding Point */}
          {currentStep === 2 && (
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-base text-deepBlack font-display">
                    {t.booking.passengerDetails}
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-gold font-bold hover:underline"
                  >
                    ← Change Seats ({selectedSeats.join(', ')})
                  </button>
                </div>

                {/* Primary Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {t.booking.fullName} *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="e.g. Rahim Ahmed"
                      className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {t.booking.mobileNumber} *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {t.booking.email}
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Boarding and Dropping Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {t.booking.boardingPoint} *
                    </label>
                    <select
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                    >
                      {trip.boarding_points.map((pt, i) => (
                        <option key={i} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {t.booking.droppingPoint} *
                    </label>
                    <select
                      value={droppingPoint}
                      onChange={(e) => setDroppingPoint(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                    >
                      {trip.dropping_points.map((pt, i) => (
                        <option key={i} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Individual Passenger Names for each seat */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Seat-wise Passengers ({selectedSeats.length})
                  </h4>

                  {selectedSeats.map((seatId, idx) => (
                    <div
                      key={seatId}
                      className="p-4 rounded-xl bg-luxuryGray border border-gray-200 flex flex-wrap items-center gap-4 text-xs"
                    >
                      <span className="w-9 h-9 rounded-lg bg-deepBlack text-gold font-bold flex items-center justify-center text-xs">
                        {seatId}
                      </span>

                      <div className="flex-1 min-w-[180px]">
                        <input
                          type="text"
                          placeholder={`Passenger Name for Seat ${seatId}`}
                          defaultValue={idx === 0 ? customerName : ''}
                          onChange={(e) =>
                            setPassengerData({
                              ...passengerData,
                              [seatId]: {
                                name: e.target.value,
                                gender: passengerData[seatId]?.gender || 'male',
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`gender-${seatId}`}
                            defaultChecked
                            onChange={() =>
                              setPassengerData({
                                ...passengerData,
                                [seatId]: {
                                  name: passengerData[seatId]?.name || '',
                                  gender: 'male',
                                },
                              })
                            }
                            className="text-gold focus:ring-gold"
                          />
                          <span>{t.booking.male}</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`gender-${seatId}`}
                            onChange={() =>
                              setPassengerData({
                                ...passengerData,
                                [seatId]: {
                                  name: passengerData[seatId]?.name || '',
                                  gender: 'female',
                                },
                              })
                            }
                            className="text-gold focus:ring-gold"
                          />
                          <span>{t.booking.female}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 rounded-xl bg-luxuryGray hover:bg-gray-200 text-gray-700 font-bold text-xs"
                  >
                    ← Back to Seats
                  </button>

                  <button
                    type="button"
                    disabled={!customerName || !customerPhone}
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all disabled:opacity-50"
                  >
                    {t.booking.proceedToPayment} →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateway Checkout */}
          {currentStep === 3 && (
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-base text-deepBlack font-display">
                    {t.booking.selectPaymentMethod}
                  </h3>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-gold font-bold hover:underline"
                  >
                    ← Edit Passenger Info
                  </button>
                </div>

                {/* Promo Coupon Card */}
                <form onSubmit={handleApplyCoupon} className="p-4 rounded-xl bg-luxuryGray border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    {t.booking.applyCoupon}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. GOLDEN2026 or FIRSTTRIP"
                      className="flex-1 px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold uppercase focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-deepBlack text-white hover:bg-gold hover:text-deepBlack font-bold text-xs transition-colors"
                    >
                      {t.booking.apply}
                    </button>
                  </div>
                  {couponSuccess && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {t.booking.couponApplied} (Saved {formatBDT(discountAmount)})
                    </p>
                  )}
                </form>

                {/* Payment Option Cards */}
                <div className="space-y-3">
                  {/* bKash */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPayment === 'bkash'
                        ? 'border-gold bg-gold/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={selectedPayment === 'bkash'}
                        onChange={() => setSelectedPayment('bkash')}
                        className="text-gold focus:ring-gold"
                      />
                      <div className="w-8 h-8 rounded bg-[#E2136E] flex items-center justify-center font-bold text-[11px] text-white">
                        bK
                      </div>
                      <div>
                        <span className="font-bold text-xs text-deepBlack block">
                          bKash Tokenized Checkout
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Instant OTP/PIN verification with official bKash Merchant API
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPayment === 'nagad'
                        ? 'border-gold bg-gold/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={selectedPayment === 'nagad'}
                        onChange={() => setSelectedPayment('nagad')}
                        className="text-gold focus:ring-gold"
                      />
                      <div className="w-8 h-8 rounded bg-[#F7941D] flex items-center justify-center font-bold text-[11px] text-white">
                        NG
                      </div>
                      <div>
                        <span className="font-bold text-xs text-deepBlack block">
                          Nagad Merchant Payment
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Official Nagad Direct DFS Checkout
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Counter Cash (Enabled for Counter staff / Operators) */}
                  {isCounterStaff && (
                    <label
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayment === 'cash'
                          ? 'border-gold bg-gold/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={selectedPayment === 'cash'}
                          onChange={() => setSelectedPayment('cash')}
                          className="text-gold focus:ring-gold"
                        />
                        <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold text-[11px] text-white">
                          ৳
                        </div>
                        <div>
                          <span className="font-bold text-xs text-deepBlack block">
                            Counter Cash Payment (Agent Terminal)
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Cash received at counter terminal desk by authorized staff
                          </span>
                        </div>
                      </div>
                    </label>
                  )}
                </div>

                {/* Final Confirmation Button */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Total Amount Payable</span>
                    <span className="text-2xl font-black text-deepBlack">{formatBDT(netTotal)}</span>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmAndPay}
                    className="px-8 py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold-lg transition-all flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Verifying Payment...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>{t.booking.confirmBooking} ({formatBDT(netTotal)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Right Rail Overview (Step 2 & 3) */}
          {currentStep > 1 && (
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
                  Booking Summary
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bus Name:</span>
                    <span className="font-bold text-deepBlack">{trip.bus?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Seats:</span>
                    <span className="font-mono font-bold text-gold">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-semibold text-deepBlack">{formatBDT(seatFareTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service Fee:</span>
                    <span className="font-semibold text-deepBlack">{formatBDT(serviceCharge)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount:</span>
                      <span>- {formatBDT(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-100 font-black text-base text-deepBlack">
                    <span>Payable Total:</span>
                    <span className="text-gold-dark">{formatBDT(netTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
