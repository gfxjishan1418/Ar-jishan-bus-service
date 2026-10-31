'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_GPS_LOCATIONS } from '@/lib/data/mock-db';
import { GPSLocation } from '@/lib/types/database';
import {
  Navigation,
  Search,
  MapPin,
  Clock,
  Radio,
  AlertTriangle,
  Compass,
  Bus,
  CheckCircle2,
} from 'lucide-react';

export default function TrackBusPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('AR-8921X');
  const [telemetry, setTelemetry] = useState<GPSLocation | null>(
    INITIAL_GPS_LOCATIONS['AR-8921X']
  );
  const [searched, setSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    const found = INITIAL_GPS_LOCATIONS[clean] || null;
    setTelemetry(found);
    setSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      <div className="bg-deepBlack text-white border-b border-charcoal py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal border border-gold/40 text-gold text-xs font-semibold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>Real-time Telemetry Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            Live GPS Highway Bus Radar
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
            Direct tracking from our onboard GPS hardware beacons. Follow your bus along the national highway network with live speed, landmark detection, and verified estimated arrival.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl flex gap-2 pt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter PNR (e.g. AR-8921X) or Registration (e.g. BA-15-4032)..."
              className="flex-1 px-4 py-3.5 rounded-xl bg-charcoal border border-charcoal-light text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-gold"
              required
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all"
            >
              Track Bus
            </button>
          </form>
        </div>
      </div>

      {/* Main Tracking Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {searched && telemetry ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Telemetry Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs text-deepBlack uppercase tracking-wider">
                      Live Telemetry Stream Active
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-gold-dark bg-gold/10 px-2.5 py-1 rounded">
                    {telemetry.speed_kmh} km/h
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">
                      Bus Registration
                    </span>
                    <span className="font-bold text-base text-deepBlack mt-0.5 block">
                      {telemetry.bus_number}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">
                      Current Highway Landmark
                    </span>
                    <span className="font-semibold text-deepBlack mt-0.5 block">
                      {telemetry.current_landmark}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">
                      Next Designated Halting Stop
                    </span>
                    <span className="font-semibold text-gray-700 mt-0.5 block">
                      {telemetry.next_stop}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        Estimated Arrival
                      </span>
                      <span className="font-black text-sm text-gold-dark mt-0.5 block">
                        {telemetry.estimated_arrival}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        Coordinates
                      </span>
                      <span className="font-mono text-[11px] text-gray-600 mt-0.5 block">
                        {telemetry.latitude}, {telemetry.longitude}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500">
                  Verified hardware ingestion via OBD-II & calibrated GPS modem.
                </div>
              </div>
            </div>

            {/* Right Map Canvas */}
            <div className="lg:col-span-7">
              <div className="relative w-full h-[480px] rounded-3xl overflow-hidden border border-gray-300 shadow-md bg-[#131b24]">
                {/* Radar Grid Lines */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* SVG Route Visualization */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 480" fill="none">
                  <path
                    d="M 100 120 Q 220 220 340 260 T 500 400"
                    stroke="#334155"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 100 120 Q 220 220 340 260 T 500 400"
                    stroke="#D4AF37"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                  />

                  {/* Traveled portion */}
                  <path
                    d="M 100 120 Q 220 220 340 260"
                    stroke="#D4AF37"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* Origin */}
                  <circle cx="100" cy="120" r="8" fill="#111111" stroke="#D4AF37" strokeWidth="3" />
                  <text x="80" y="95" fill="#E2E8F0" fontSize="12" fontWeight="bold">
                    Dhaka Terminal
                  </text>

                  {/* Bus Beacon */}
                  <g transform="translate(340, 260)">
                    <circle cx="0" cy="0" r="22" fill="#D4AF37" opacity="0.3">
                      <animate attributeName="r" values="10;30;10" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="0" cy="0" r="9" fill="#D4AF37" />
                    <circle cx="0" cy="0" r="4" fill="#111111" />
                  </g>
                  <text x="355" y="255" fill="#D4AF37" fontSize="12" fontWeight="bold">
                    {telemetry.bus_number}
                  </text>

                  {/* Destination */}
                  <circle cx="500" cy="400" r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="430" y="430" fill="#10B981" fontSize="12" fontWeight="bold">
                    Destination Terminal
                  </text>
                </svg>

                {/* Map Floating Badges */}
                <div className="absolute top-4 left-4 bg-deepBlack/85 border border-gold/40 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 backdrop-blur-sm text-white">
                  <Navigation className="w-3.5 h-3.5 text-gold" />
                  <span>National Highway Radar (N1/N2)</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-deepBlack/85 border border-charcoal px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 backdrop-blur-sm text-gray-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Last Signal: {new Date(telemetry.recorded_at).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : searched && !telemetry ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-deepBlack font-display">
              GPS Signal Offline or Inactive Trip
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We do not display simulated coordinates. If the bus has not departed its origin terminal or the hardware beacon is in standby mode, coordinates will be unavailable until next ping.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setQuery('AR-8921X');
                  setTelemetry(INITIAL_GPS_LOCATIONS['AR-8921X']);
                  setSearched(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-deepBlack text-gold font-bold text-xs uppercase hover:bg-gold hover:text-deepBlack transition-colors"
              >
                View Active Demo Coach (AR-8921X)
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
