'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'bkash' | 'nagad' | 'bank' | 'cash';
  amount: number;
  pnr: string;
  bookingId: string;
  customerPhone: string;
  onSuccess: (details: {
    method: 'bkash' | 'nagad' | 'bank' | 'cash';
    trxId: string;
    paidAmount: number;
    accountOrCard?: string;
  }) => void;
}

export default function PaymentGatewayModals({
  isOpen,
  onClose,
  method,
  amount,
  pnr,
  bookingId,
  customerPhone,
  onSuccess,
}: PaymentModalProps) {
  // Common states
  const [step, setStep] = useState<'input' | 'otp' | 'pin' | 'processing'>('input');
  const [phoneNumber, setPhoneNumber] = useState(customerPhone || '');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('1234');
  const [timer, setTimer] = useState(30);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Card & Bank states
  const [bankTab, setBankTab] = useState<'card' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('AR Jishan');
  const [selectedBank, setSelectedBank] = useState('City Bank (CityTouch)');

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setPhoneNumber(customerPhone || '');
      setOtp('123456');
      setPin('1234');
      setTimer(30);
      setErrorMessage('');
    }
  }, [isOpen, customerPhone, method]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, timer]);

  if (!isOpen) return null;

  // bKash Flow
  const handleBkashSubmit = () => {
    if (step === 'input') {
      if (!phoneNumber || phoneNumber.length < 11) {
        setErrorMessage('অনুগ্রহ করে সঠিক ১১ ডিজিটের বিকাশ নম্বর দিন');
        return;
      }
      setErrorMessage('');
      setStep('otp');
      setTimer(30);
    } else if (step === 'otp') {
      if (!otp || otp.length < 4) {
        setErrorMessage('সঠিক ভেরিফিকেশন কোড (OTP) দিন');
        return;
      }
      setErrorMessage('');
      setStep('pin');
    } else if (step === 'pin') {
      if (!pin || pin.length < 4) {
        setErrorMessage('আপনার বিকাশ পিন নম্বর দিন');
        return;
      }
      setErrorMessage('');
      setStep('processing');
      setTimeout(() => {
        const trxId = 'BK' + Math.random().toString(36).substring(2, 10).toUpperCase();
        onSuccess({
          method: 'bkash',
          trxId,
          paidAmount: amount,
          accountOrCard: phoneNumber,
        });
      }, 1500);
    }
  };

  // Nagad Flow
  const handleNagadSubmit = () => {
    if (step === 'input') {
      if (!phoneNumber || phoneNumber.length < 11) {
        setErrorMessage('অনুগ্রহ করে সঠিক ১১ ডিজিটের নগদ নম্বর দিন');
        return;
      }
      setErrorMessage('');
      setStep('otp');
      setTimer(30);
    } else if (step === 'otp') {
      if (!otp || otp.length < 4) {
        setErrorMessage('সঠিক ৪-৬ ডিজিটের নগদ OTP কোড দিন');
        return;
      }
      setErrorMessage('');
      setStep('pin');
    } else if (step === 'pin') {
      if (!pin || pin.length < 4) {
        setErrorMessage('আপনার ৪ ডিজিটের গোপন পিন দিন');
        return;
      }
      setErrorMessage('');
      setStep('processing');
      setTimeout(() => {
        const trxId = 'NG' + Math.random().toString(36).substring(2, 10).toUpperCase();
        onSuccess({
          method: 'nagad',
          trxId,
          paidAmount: amount,
          accountOrCard: phoneNumber,
        });
      }, 1500);
    }
  };

  // Bank Card / Internet Banking Flow
  const handleBankSubmit = () => {
    setStep('processing');
    setTimeout(() => {
      const trxId = 'BANK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      onSuccess({
        method: 'bank',
        trxId,
        paidAmount: amount,
        accountOrCard: bankTab === 'card' ? `Card ending ${cardNumber.slice(-4)}` : selectedBank,
      });
    }, 1800);
  };

  // Cash Confirmation Flow
  const handleCashSubmit = () => {
    setStep('processing');
    setTimeout(() => {
      const trxId = 'CASH-' + pnr;
      onSuccess({
        method: 'cash',
        trxId,
        paidAmount: amount,
        accountOrCard: 'Counter Terminal',
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pureBlack/80 backdrop-blur-sm animate-fade-in">
      {/* ============================================================ */}
      {/* 1. bKash Tokenized Checkout Modal */}
      {/* ============================================================ */}
      {method === 'bkash' && (
        <div className="bg-[#E2136E] text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-[#D10F64] p-5 flex items-center justify-between border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-[#E2136E] text-lg shadow-md">
                bK
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-pink-200 block font-semibold">
                  bKash Merchant Payment
                </span>
                <span className="font-bold text-sm text-white">AR Jishan Luxury Bus</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="bg-[#C20E5D] px-6 py-3 flex justify-between items-center text-xs border-b border-white/10">
            <div>
              <span className="text-pink-200 block text-[10px]">INVOICE NO:</span>
              <span className="font-mono font-bold text-white">{pnr}</span>
            </div>
            <div className="text-right">
              <span className="text-pink-200 block text-[10px]">TOTAL AMOUNT:</span>
              <span className="font-black text-white text-base">{formatBDT(amount)}</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 bg-[#E2136E]">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-white/15 border border-white/30 text-xs text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 'input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-pink-100">
                    আপনার বিকাশ একাউন্ট নম্বর দিন (Your bKash Account)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 01XXXXXXXXX"
                    maxLength={11}
                    className="w-full px-4 py-3 rounded-xl bg-white text-deepBlack font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
                  />
                </div>

                <label className="flex items-center gap-2 text-[11px] text-pink-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="rounded text-[#D10F64] focus:ring-0"
                  />
                  <span>আমি বিকাশ মার্চেন্ট পেমেন্টের শর্তাবলী মেনে নিচ্ছি</span>
                </label>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors"
                  >
                    বাতিল (Close)
                  </button>
                  <button
                    type="button"
                    disabled={!agreedTerms}
                    onClick={handleBkashSubmit}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-pink-50 text-[#E2136E] font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                  >
                    পরবর্তী (Proceed)
                  </button>
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs text-pink-100 block">
                    {phoneNumber} নম্বরে পাঠানো ৬ সংখ্যার ভেরিফিকেশন কোড দিন
                  </span>
                  <span className="text-[10px] text-amber-200">
                    (স্যান্ডবক্স ডেমো কোড: 123456)
                  </span>
                </div>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full text-center px-4 py-3 rounded-xl bg-white text-deepBlack font-mono font-bold text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
                />

                <div className="text-center text-xs text-pink-200">
                  {timer > 0 ? (
                    <span>কোড পুনরায় পাঠানোর সময়: {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTimer(30)}
                      className="underline text-white font-bold"
                    >
                      কোড পুনরায় পাঠান (Resend)
                    </button>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                  >
                    পিছনে (Back)
                  </button>
                  <button
                    type="button"
                    onClick={handleBkashSubmit}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-pink-50 text-[#E2136E] font-black text-xs uppercase tracking-wider shadow-lg"
                  >
                    ভেরিফাই করুন (Verify)
                  </button>
                </div>
              </div>
            )}

            {step === 'pin' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs text-pink-100 block">
                    আপনার বিকাশ একাউন্টের গোপন পিন দিন (Enter bKash PIN)
                  </span>
                  <span className="text-[10px] text-amber-200">
                    (ডেমো পিন: 1234 — নিরাপদ SSL এনক্রিপ্টেড)
                  </span>
                </div>

                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={5}
                  className="w-full text-center px-4 py-3 rounded-xl bg-white text-deepBlack font-mono font-bold text-2xl tracking-[0.6em] focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
                />

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('otp')}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                  >
                    পিছনে (Back)
                  </button>
                  <button
                    type="button"
                    onClick={handleBkashSubmit}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-pink-50 text-[#E2136E] font-black text-xs uppercase tracking-wider shadow-lg"
                  >
                    পেমেন্ট কনফার্ম ({formatBDT(amount)})
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-8 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-white text-base">বিকাশ পেমেন্ট প্রসেসিং হচ্ছে...</h4>
                  <p className="text-xs text-pink-200 mt-1">
                    বিকাশ সার্ভার থেকে ট্রানজেকশন ভেরিফিকেশন সম্পন্ন হচ্ছে
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer security */}
          <div className="bg-[#D10F64] px-6 py-2.5 text-center text-[10px] text-pink-200 flex items-center justify-center gap-1.5 border-t border-white/10">
            <Lock className="w-3 h-3 text-pink-200" />
            <span>256-Bit Bank Grade SSL Encrypted • Official bKash Gateway</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. Nagad Direct Checkout Modal */}
      {/* ============================================================ */}
      {method === 'nagad' && (
        <div className="bg-[#F7941D] text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-[#E28315] p-5 flex items-center justify-between border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-[#F7941D] text-lg shadow-md">
                NG
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-orange-100 block font-semibold">
                  Nagad Direct Checkout
                </span>
                <span className="font-bold text-sm text-white">AR Jishan Luxury Bus</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="bg-[#D4750B] px-6 py-3 flex justify-between items-center text-xs border-b border-white/10">
            <div>
              <span className="text-orange-100 block text-[10px]">ORDER ID:</span>
              <span className="font-mono font-bold text-white">{pnr}</span>
            </div>
            <div className="text-right">
              <span className="text-orange-100 block text-[10px]">TOTAL PAYABLE:</span>
              <span className="font-black text-white text-base">{formatBDT(amount)}</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 bg-[#F7941D]">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-white/15 border border-white/30 text-xs text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 'input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-orange-100">
                    আপনার নগদ একাউন্ট নম্বর (Your Nagad Account)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 01XXXXXXXXX"
                    maxLength={11}
                    className="w-full px-4 py-3 rounded-xl bg-white text-deepBlack font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-200 shadow-inner"
                  />
                </div>

                <label className="flex items-center gap-2 text-[11px] text-orange-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="rounded text-[#E28315] focus:ring-0"
                  />
                  <span>আমি নগদ মার্চেন্ট পেমেন্টের শর্তাবলী মেনে নিচ্ছি</span>
                </label>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors"
                  >
                    বাতিল (Close)
                  </button>
                  <button
                    type="button"
                    disabled={!agreedTerms}
                    onClick={handleNagadSubmit}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-orange-50 text-[#F7941D] font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                  >
                    পরবর্তী (Proceed)
                  </button>
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs text-orange-100 block">
                    {phoneNumber} নম্বরে পাঠানো নগদ OTP কোড দিন
                  </span>
                  <span className="text-[10px] text-white/90">
                    (স্যান্ডবক্স ডেমো কোড: 123456)
                  </span>
                </div>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full text-center px-4 py-3 rounded-xl bg-white text-deepBlack font-mono font-bold text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-amber-200 shadow-inner"
                />

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                  >
                    পিছনে (Back)
                  </button>
                  <button
                    type="button"
                    onClick={handleNagadSubmit}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-orange-50 text-[#F7941D] font-black text-xs uppercase tracking-wider shadow-lg"
                  >
                    ভেরিফাই করুন (Verify)
                  </button>
                </div>
              </div>
            )}

            {step === 'pin' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs text-orange-100 block">
                    আপনার নগদ পিন দিন (Enter Nagad PIN)
                  </span>
                  <span className="text-[10px] text-white/90">
                    (ডেমো পিন: 1234)
                  </span>
                </div>

                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full text-center px-4 py-3 rounded-xl bg-white text-deepBlack font-mono font-bold text-2xl tracking-[0.6em] focus:outline-none focus:ring-2 focus:ring-amber-200 shadow-inner"
                />

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('otp')}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                  >
                    পিছনে (Back)
                  </button>
                  <button
                    type="button"
                    onClick={handleNagadSubmit}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-orange-50 text-[#F7941D] font-black text-xs uppercase tracking-wider shadow-lg"
                  >
                    পেমেন্ট কনফার্ম ({formatBDT(amount)})
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-8 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-white text-base">নগদ পেমেন্ট ভেরিফাই হচ্ছে...</h4>
                  <p className="text-xs text-orange-100 mt-1">
                    ডাক বিভাগের ডিজিটাল লেনদেন নেটওয়ার্কের সাথে যুক্ত হওয়া হচ্ছে
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer security */}
          <div className="bg-[#E28315] px-6 py-2.5 text-center text-[10px] text-orange-100 flex items-center justify-center gap-1.5 border-t border-white/10">
            <Lock className="w-3 h-3 text-orange-100" />
            <span>Official Bangladesh Post Office Digital Financial Service</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. Bank Account / Debit & Credit Card Checkout Modal */}
      {/* ============================================================ */}
      {method === 'bank' && (
        <div className="bg-white text-deepBlack w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-deepBlack text-white p-6 flex items-center justify-between border-b border-charcoal">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider block">
                  Secure Bank & Card Gateway
                </span>
                <span className="font-bold text-sm text-white">AR Jishan Luxury Bus Platform</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader tabs */}
          <div className="bg-luxuryGray px-6 py-3 flex border-b border-gray-200 gap-2">
            <button
              type="button"
              onClick={() => setBankTab('card')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                bankTab === 'card'
                  ? 'bg-deepBlack text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CreditCard className="w-4 h-4 text-gold" />
              <span>Debit / Credit Card (Visa/Mastercard)</span>
            </button>
            <button
              type="button"
              onClick={() => setBankTab('netbanking')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                bankTab === 'netbanking'
                  ? 'bg-deepBlack text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-gold" />
              <span>Internet Banking (CityTouch/DBBL)</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
            {step === 'processing' ? (
              <div className="py-12 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-gold animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-deepBlack text-base">3D-Secure ভেরিফিকেশন সম্পন্ন হচ্ছে...</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    ব্যাংক পেমেন্ট গেটওয়ের সাথে ট্রানজেকশন প্রসেস করা হচ্ছে
                  </p>
                </div>
              </div>
            ) : bankTab === 'card' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    কার্ড নম্বর (Card Number)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold text-deepBlack focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      মেয়াদ উত্তীর্ণ (Expiry MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold text-deepBlack focus:outline-none focus:border-gold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      সিভিভি (CVV / CVC)
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="888"
                      maxLength={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold text-deepBlack focus:outline-none focus:border-gold text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    কার্ডধারীর নাম (Cardholder Name)
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. AR Jishan"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-deepBlack focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                  >
                    বাতিল (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={handleBankSubmit}
                    className="flex-1 py-3 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold"
                  >
                    পে করুন ({formatBDT(amount)})
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    আপনার ব্যাংক বা ইন্টারনেট ব্যাংকিং অ্যাপ নির্বাচন করুন
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-deepBlack focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="City Bank (CityTouch)">City Bank — CityTouch Internet Banking</option>
                    <option value="Dutch-Bangla Bank (NexusPay / Rocket)">Dutch-Bangla Bank (NexusPay / Core Banking)</option>
                    <option value="Islami Bank Bangladesh (Cellfin)">Islami Bank Bangladesh — Cellfin / iBanking</option>
                    <option value="Eastern Bank (EBL Skybanking)">Eastern Bank Limited — EBL Skybanking</option>
                    <option value="BRAC Bank (Astha)">BRAC Bank — Astha Mobile Banking</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                  <span className="font-bold block">কোম্পানি ব্যাংক একাউন্ট সংক্রান্ত তথ্য:</span>
                  <p>• একাউন্ট নাম: AR Jishan Luxury Smart Bus Service</p>
                  <p>• হিসাব নম্বর: 2050 1480 2008 1900</p>
                  <p>• ব্যাংকিং গেটওয়ের মাধ্যমে স্বয়ংক্রিয়ভাবে ব্যালেন্স ট্রান্সফার হবে।</p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                  >
                    বাতিল (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={handleBankSubmit}
                    className="flex-1 py-3 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold"
                  >
                    ব্যাংক পেমেন্ট কনফার্ম ({formatBDT(amount)})
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-2.5 text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5 border-t border-gray-200">
            <Lock className="w-3 h-3 text-gold" />
            <span>PCI-DSS Level 1 Certified • 3D Secure 2.0 Bangladesh Banking Gateway</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. Cash on Counter / Pay at Boarding Modal */}
      {/* ============================================================ */}
      {method === 'cash' && (
        <div className="bg-white text-deepBlack w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-emerald-800 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-white font-bold text-xl">
                ৳
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                  Counter Cash Reservation
                </span>
                <span className="font-bold text-sm text-white">কাউন্টার ক্যাশ পেমেন্ট</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="bg-emerald-900 px-6 py-3 flex justify-between items-center text-xs text-white">
            <div>
              <span className="text-emerald-200 block text-[10px]">BOOKING PNR:</span>
              <span className="font-mono font-bold text-white">{pnr}</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-200 block text-[10px]">CASH TO PAY:</span>
              <span className="font-black text-white text-base">{formatBDT(amount)}</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>আপনার সিটটি সফলভাবে সংরক্ষিত হবে!</span>
              </div>
              <p className="leading-relaxed">
                বাস ছাড়ার অন্তত <strong>৩০ মিনিট পূর্বে</strong> যেকোনো AR Jishan বাস কাউন্টারে (গাবতলী, সায়েদাবাদ, মহাখালী, দামপাড়া অথবা কলাতলী) গিয়ে এই PNR নম্বরটি প্রদর্শন করে ক্যাশ টাকা পরিশোধ করুন এবং প্রিন্টেড টিকিট সংগ্রহ করুন।
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleCashSubmit}
                className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                ক্যাশ বুকিং কনফার্ম করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
