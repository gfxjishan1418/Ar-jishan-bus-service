'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Compliance & Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-deepBlack font-display">
            Customer Policies & Terms of Service
          </h1>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            Official operational terms, refund timelines, and passenger safety regulations of AR Jishan Luxury Smart Bus Service.
          </p>
        </div>

        {/* Cancellation Policy */}
        <div id="cancellation" className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-4 text-xs text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <Clock className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-deepBlack font-display">
              Ticket Cancellation Policy
            </h2>
          </div>
          <p>
            1. <strong>Cancellation Deadline:</strong> Tickets can be cancelled up to 12 hours prior to scheduled departure time from origin terminal.
          </p>
          <p>
            2. <strong>Cancellation Fee:</strong> A statutory 15% cancellation fee is deducted from the base ticket fare if cancelled before the deadline.
          </p>
          <p>
            3. <strong>Late Cancellations:</strong> Requests received within 12 hours of departure or after coach dispatch are non-refundable.
          </p>
          <p>
            4. <strong>Partial Cancellations:</strong> Passengers booked under multi-seat reservations may cancel individual seats without voiding the remainder of the booking.
          </p>
        </div>

        {/* Refund Policy */}
        <div id="refund" className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-4 text-xs text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-deepBlack font-display">
              Official Refund Processing
            </h2>
          </div>
          <p>
            1. <strong>Payment Method Reversal:</strong> Approved refunds are credited directly back to the funding source used during booking (bKash wallet, Nagad account, or original credit/debit card).
          </p>
          <p>
            2. <strong>Processing Timeline:</strong> MFS refunds (bKash & Nagad) are completed within 3 to 5 business days upon administrative audit. Bank deposits are disbursed within 5 to 7 working days.
          </p>
          <p>
            3. <strong>Cash Counter Purchases:</strong> Tickets purchased with physical cash at any station counter must be surrendered at the issuing counter for cash refund.
          </p>
        </div>

        {/* Privacy & Terms */}
        <div id="terms" className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-4 text-xs text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <FileText className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-deepBlack font-display">
              General Terms & Passenger Conduct
            </h2>
          </div>
          <p>
            1. Passengers must carry digital electronic ticket or physical printout with valid government-issued photo ID.
          </p>
          <p>
            2. AR Jishan reserves the right to reassign or adjust coach seating in unavoidable operational circumstances while guaranteeing equivalent or superior luxury coach category.
          </p>
          <p>
            3. Smoking, narcotics, and dangerous contraband are strictly forbidden on all coaches and terminal passenger lounges.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
