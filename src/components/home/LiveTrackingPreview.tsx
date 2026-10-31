'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_GPS_LOCATIONS } from '@/lib/data/mock-db';
import { GPSLocation } from '@/lib/types/database';
import {
  Navigation,
  Search,
  MapPin,
  Clock,
  Compass,
  AlertCircle,
  CheckCircle2,
  Radio,
  ArrowRight,
} from 'lucide-react';

export default function LiveTrackingPreview() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('AR-8921X');
  const [trackingResult, setTrackingResult] = useState<GPSLocation | null>(
    INITIAL_GPS_LOCATIONS['AR-8921X']
  );
  const [searched, setSearched] = useState(true);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const result = INITIAL_GPS_LOCATIONS[query] || null;
    setTrackingResult(result);
    setSearched(true);
  };

  return (
    <section className="py-20 bg-deepBlack text-white border-t border-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Form & Telemetry Data */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal border border-gold/40 text-gold text-xs font-semibold uppercase tracking-wider mb-3">
                <Radio className="w-3.5 h-3.5 text-gold animate-pulse" />
                <span>Live Fleet Radar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                {t.tracking.title}
              </h2>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {t.tracking.subtitle}
              </p>
            </div>

            {/* Lookup Form */}
            <form onSubmit={handleTrack} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.tracking.inputPlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-charcoal border border-charcoal-light focus:border-gold text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>{t.tracking.trackButton}</span>
              </button>
            </form>

            {/* Quick Helper */}
            <div className="text-[11px] text-gray-400 flex items-center gap-2 bg-charcoal/50 p-2.5 rounded-lg border border-charcoal-light">
              <span className="font-semibold text-gold">Try Demo PNR:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('AR-8921X');
                  setTrackingResult(INITIAL_GPS_LOCATIONS['AR-8921X']);
                  setSearched(true);
                }}
                className="underline hover:text-white"
              >
                AR-8921X
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('DHAKA-METRO-BA-15-4032');
                  setTrackingResult(INITIAL_GPS_LOCATIONS['DHAKA-METRO-BA-15-4032']);
                  setSearched(true);
                }}
                className="underline hover:text-white"
              >
                BA-15-4032
              </button>
            </div>

            {/* Telemetry Card */}
            {searched && trackingResult ? (
              <div className="p-5 rounded-2xl bg-charcoal border border-gold/30 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-light">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-white uppercase tracking-wider">
                      {t.tracking.statusOnline}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gold font-semibold">
                    {trackingResult.speed_kmh} km/h
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-medium">
                      {t.tracking.busNumber}
                    </span>
                    <span className="font-bold text-gray-200 mt-0.5 block">
                      {trackingResult.bus_number}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-medium">
                      {t.tracking.estimatedArrival}
                    </span>
                    <span className="font-bold text-gold mt-0.5 block">
                      {trackingResult.estimated_arrival}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-medium">
                      {t.tracking.currentLocation}
                    </span>
                    <span className="font-semibold text-white mt-0.5 block">
                      {trackingResult.current_landmark}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-medium">
                      {t.tracking.nextStop}
                    </span>
                    <span className="font-semibold text-gray-300 mt-0.5 block">
                      {trackingResult.next_stop}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-charcoal-light text-[10px] text-gray-400 flex items-center justify-between">
                  <span>GPS Telemetry: Lat {trackingResult.latitude}, Long {trackingResult.longitude}</span>
                  <Link href="/track" className="text-gold font-bold hover:underline flex items-center gap-1">
                    Full Radar <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : searched && !trackingResult ? (
              <div className="p-4 rounded-xl bg-charcoal border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">No active trip found for this query</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Please check the PNR number or verify that the bus has departed the terminal.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Interactive Bangladesh Highway Route Radar (Mockup Matching Image) */}
          <div className="lg:col-span-7">
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-gold/40 shadow-gold bg-[#141d26]">
              {/* Radar Grid overlay */}
              <div
                className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"
              />

              {/* Highway Route Vector Representation */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" fill="none">
                {/* Bangladesh Highway Path: Dhaka -> Feni -> Chattogram -> Cox's Bazar */}
                <path
                  d="M 120 100 Q 220 180 320 220 T 480 340"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 120 100 Q 220 180 320 220 T 480 340"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />

                {/* Traveled portion glowing */}
                <path
                  d="M 120 100 Q 220 180 320 220"
                  stroke="#D4AF37"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Dhaka Pin */}
                <circle cx="120" cy="100" r="7" fill="#111111" stroke="#D4AF37" strokeWidth="3" />
                <text x="100" y="80" fill="#E2E8F0" fontSize="11" fontWeight="bold">
                  Dhaka (Terminal)
                </text>

                {/* Comilla Halting Point */}
                <circle cx="230" cy="175" r="4" fill="#94A3B8" />
                <text x="240" y="175" fill="#94A3B8" fontSize="9">
                  Paduar Bazar
                </text>

                {/* Active Bus Marker (Near Feni) */}
                <g transform="translate(320, 220)">
                  <circle cx="0" cy="0" r="18" fill="#D4AF37" opacity="0.25">
                    <animate attributeName="r" values="10;24;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="8" fill="#D4AF37" />
                  <circle cx="0" cy="0" r="4" fill="#111111" />
                </g>
                <text x="335" y="215" fill="#D4AF37" fontSize="11" fontWeight="bold">
                  AR-8921X (Feni Bypass)
                </text>

                {/* Chattogram Pin */}
                <circle cx="410" cy="285" r="6" fill="#111111" stroke="#38BDF8" strokeWidth="2" />
                <text x="425" y="290" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                  Chattogram (Dampara)
                </text>

                {/* Cox's Bazar Destination Pin */}
                <circle cx="480" cy="340" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <text x="420" y="365" fill="#10B981" fontSize="11" fontWeight="bold">
                  Cox&apos;s Bazar (Kolatoli)
                </text>
              </svg>

              {/* Top info badge on map */}
              <div className="absolute top-4 left-4 bg-deepBlack/85 border border-gold/40 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 backdrop-blur-sm">
                <Navigation className="w-3.5 h-3.5 text-gold" />
                <span className="font-bold text-white">Route: Dhaka – Chattogram – Cox&apos;s Bazar</span>
              </div>

              {/* Bottom speed badge */}
              <div className="absolute bottom-4 right-4 bg-deepBlack/85 border border-charcoal px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-gray-300 font-mono">Live Ping: 4 sec ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
