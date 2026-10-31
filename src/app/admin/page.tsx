'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_TRIPS,
  getAllBookings,
  INITIAL_COUNTERS,
  COMPANY_SETTINGS,
} from '@/lib/data/mock-db';
import { Bus, Booking } from '@/lib/types/database';
import { formatBDT, formatDateBD } from '@/lib/utils';
import {
  DollarSign,
  Ticket,
  Bus as BusIcon,
  Building,
  RotateCcw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Settings,
  Users,
  Navigation,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function SuperAdminPage() {
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [bookings] = useState<Booking[]>(() => getAllBookings());

  // Editable settings
  const [companySettings, setCompanySettings] = useState(COMPANY_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Refund requests state
  const [refundRequests, setRefundRequests] = useState([
    {
      id: 'ref-1',
      pnr: 'AR8921X',
      customer: 'Rahim Ahmed',
      route: "Dhaka to Cox's Bazar",
      amountPaid: 1760,
      fee: 264,
      refundable: 1496,
      reason: 'Meeting postponed',
      status: 'pending',
    },
    {
      id: 'ref-2',
      pnr: 'AR7102Y',
      customer: 'Fatima Zohra',
      route: 'Dhaka to Chattogram',
      amountPaid: 1650,
      fee: 247.5,
      refundable: 1402.5,
      reason: 'Personal emergency',
      status: 'pending',
    },
  ]);

  const handleApproveRefund = (refId: string) => {
    setRefundRequests((prev) =>
      prev.map((r) => (r.id === refId ? { ...r, status: 'approved' } : r))
    );
  };

  const handleRejectRefund = (refId: string) => {
    setRefundRequests((prev) =>
      prev.map((r) => (r.id === refId ? { ...r, status: 'rejected' } : r))
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Executive Control Tower
          </span>
          <h2 className="text-2xl font-black text-deepBlack tracking-tight mt-1 font-display">
            Platform Analytics & Operations
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time fleet telemetry, revenue reconciliation, booking manifests, and administrative policy controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#search"
            className="px-5 py-2.5 rounded-xl bg-deepBlack text-white hover:bg-gold hover:text-deepBlack font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Live Site View
          </Link>
        </div>
      </div>

      {/* Analytics KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-deepBlack mt-2 block">৳ 1,48,250</span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last week
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Confirmed Bookings</span>
            <Ticket className="w-4 h-4 text-gold" />
          </div>
          <span className="text-2xl font-black text-deepBlack mt-2 block">128</span>
          <span className="text-[10px] text-gray-400">Online & Counter channels</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Active Fleet</span>
            <BusIcon className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-deepBlack mt-2 block">5 Coaches</span>
          <span className="text-[10px] text-blue-600">All GPS beacons online</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Pending Refunds</span>
            <RotateCcw className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600 mt-2 block">
            {refundRequests.filter((r) => r.status === 'pending').length} Requests
          </span>
          <span className="text-[10px] text-gray-400">Awaiting policy approval</span>
        </div>
      </div>

      {/* Revenue & Route Performance Bar Charts */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-base text-deepBlack font-display">
              Weekly Revenue Analytics (Bangladesh Taka ৳)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Calculated from confirmed online tokenized checkout & counter cash receipts
            </p>
          </div>
          <span className="text-xs font-bold text-gold font-mono">OCT 2026</span>
        </div>

        {/* Visual Chart Bars */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6">
          {[
            { day: 'Sat', amount: 18500, height: '65%' },
            { day: 'Sun', amount: 22400, height: '78%' },
            { day: 'Mon', amount: 14200, height: '50%' },
            { day: 'Tue', amount: 19800, height: '70%' },
            { day: 'Wed', amount: 26500, height: '92%' },
            { day: 'Thu', amount: 29850, height: '100%' },
            { day: 'Fri', amount: 17000, height: '60%' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-gold transition-colors font-mono">
                ৳{(bar.amount / 1000).toFixed(1)}k
              </span>
              <div className="w-full bg-luxuryGray rounded-t-xl h-36 flex items-end p-1">
                <div
                  style={{ height: bar.height }}
                  className="w-full rounded-lg bg-gold-gradient group-hover:bg-gold-gradient-hover transition-all shadow-sm"
                />
              </div>
              <span className="text-xs font-bold text-deepBlack">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Management Module */}
      <div id="fleet" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-deepBlack font-display">
              Fleet Operations Management
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              5 luxury coaches active with assigned license plates and amenities
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-luxuryGray text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <th className="py-3.5 px-6">Coach Name</th>
                <th className="py-3.5 px-6">Registration No</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Capacity</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-luxuryGray/50">
                  <td className="py-4 px-6 font-bold text-deepBlack">{bus.name}</td>
                  <td className="py-4 px-6 font-mono text-gray-500">{bus.registration_number}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold-dark">
                      {bus.bus_type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-deepBlack">{bus.seat_capacity} Seats</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Active Route
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Approvals Queue */}
      <div id="refunds" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-deepBlack font-display">
              Passenger Refund Approval Queue
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Review passenger cancellations and execute 15% cancellation deductions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-luxuryGray text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <th className="py-3.5 px-6">PNR / Passenger</th>
                <th className="py-3.5 px-6">Route</th>
                <th className="py-3.5 px-6">Paid Amount</th>
                <th className="py-3.5 px-6">Fee (15%)</th>
                <th className="py-3.5 px-6">Refundable</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {refundRequests.map((r) => (
                <tr key={r.id} className="hover:bg-luxuryGray/50">
                  <td className="py-4 px-6">
                    <span className="font-mono font-black text-deepBlack block">{r.pnr}</span>
                    <span className="text-[11px] text-gray-500">{r.customer}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{r.route}</td>
                  <td className="py-4 px-6 font-semibold">{formatBDT(r.amountPaid)}</td>
                  <td className="py-4 px-6 text-red-600">- {formatBDT(r.fee)}</td>
                  <td className="py-4 px-6 font-bold text-emerald-600">{formatBDT(r.refundable)}</td>
                  <td className="py-4 px-6">
                    {r.status === 'pending' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                    {r.status === 'approved' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Approved
                      </span>
                    )}
                    {r.status === 'rejected' && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveRefund(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRefund(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700 font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Company Settings Module */}
      <div id="settings" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-base text-deepBlack font-display">
              Company & Policy Configuration
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Live configuration for branding, cancellation fees, and customer hotlines
            </p>
          </div>
          <Settings className="w-5 h-5 text-gold" />
        </div>

        {settingsSaved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Company settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companySettings.company_name}
                onChange={(e) =>
                  setCompanySettings({ ...companySettings, company_name: e.target.value })
                }
                className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 font-semibold text-deepBlack focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={companySettings.slogan}
                onChange={(e) =>
                  setCompanySettings({ ...companySettings, slogan: e.target.value })
                }
                className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 font-semibold text-deepBlack focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                24/7 Hotline Number
              </label>
              <input
                type="text"
                value={companySettings.contact_phone}
                onChange={(e) =>
                  setCompanySettings({ ...companySettings, contact_phone: e.target.value })
                }
                className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 font-semibold text-deepBlack focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Cancellation Fee (%)
              </label>
              <input
                type="number"
                value={companySettings.cancellation_fee_percentage}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    cancellation_fee_percentage: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 font-semibold text-deepBlack focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Deadline Before Departure (Hours)
              </label>
              <input
                type="number"
                value={companySettings.cancellation_deadline_hours}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    cancellation_deadline_hours: parseInt(e.target.value),
                  })
                }
                className="w-full px-3.5 py-3 rounded-xl bg-luxuryGray border border-gray-200 font-semibold text-deepBlack focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all"
            >
              Save Company Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
