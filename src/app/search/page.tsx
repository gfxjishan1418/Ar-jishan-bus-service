'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_TRIPS, INITIAL_DESTINATIONS } from '@/lib/data/mock-db';
import { formatBDT, formatDateBD } from '@/lib/utils';
import {
  Bus,
  Clock,
  MapPin,
  Calendar,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useTranslation();

  const fromParam = searchParams.get('from') || 'Dhaka';
  const toParam = searchParams.get('to') || 'Chattogram';
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const typeParam = searchParams.get('type') || '';

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    typeParam ? [typeParam] : []
  );
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');
  const [sortBy, setSortBy] = useState<'departure' | 'fare_asc' | 'fare_desc'>('departure');

  // Filter & Sort trips
  const filteredTrips = useMemo(() => {
    return INITIAL_TRIPS.filter((trip) => {
      // Filter bus types
      if (selectedTypes.length > 0 && !selectedTypes.includes(trip.bus?.bus_type || '')) {
        return false;
      }

      // Filter by departure time range
      if (timeFilter !== 'all') {
        const timeStr = trip.departure_time; // e.g. "07:30 AM" or "10:30 PM"
        const isPM = timeStr.includes('PM');
        const hour = parseInt(timeStr.split(':')[0]) + (isPM && !timeStr.startsWith('12') ? 12 : 0);

        if (timeFilter === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (timeFilter === 'night' && hour < 18) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'fare_asc') return a.base_fare - b.base_fare;
      if (sortBy === 'fare_desc') return b.base_fare - a.base_fare;
      return a.departure_time.localeCompare(b.departure_time);
    });
  }, [selectedTypes, timeFilter, sortBy]);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      {/* Sticky Quick-Search Bar */}
      <div className="bg-deepBlack text-white border-b border-charcoal py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-charcoal border border-gold/40 flex items-center justify-center">
              <Bus className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
                <span>{fromParam}</span>
                <span className="text-gold">→</span>
                <span>{toParam}</span>
              </h1>
              <p className="text-xs text-gray-400">
                {formatDateBD(dateParam)} • Available Luxury Coaches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/#search')}
              className="px-4 py-2 rounded-lg bg-charcoal border border-charcoal-light text-xs font-semibold text-gray-300 hover:text-gold hover:border-gold transition-colors"
            >
              Modify Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-sm text-deepBlack flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gold" />
                  Filter Coaches
                </h3>
                {(selectedTypes.length > 0 || timeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedTypes([]);
                      setTimeFilter('all');
                    }}
                    className="text-[11px] text-gold font-bold hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Coach Type Filter */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Coach Category
                </label>
                {['AC Coach', 'Business Class', 'Sleeper Coach', 'Double Decker', 'Non-AC Coach'].map(
                  (type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer hover:text-deepBlack"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleTypeFilter(type)}
                        className="rounded border-gray-300 text-gold focus:ring-gold"
                      />
                      <span>{type}</span>
                    </label>
                  )
                )}
              </div>

              {/* Departure Time Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Departure Time
                </label>
                {[
                  { id: 'all', label: 'All Departures' },
                  { id: 'morning', label: 'Morning (06:00 - 11:59 AM)' },
                  { id: 'afternoon', label: 'Afternoon (12:00 - 05:59 PM)' },
                  { id: 'night', label: 'Night (06:00 PM - 11:59 PM)' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer hover:text-deepBlack"
                  >
                    <input
                      type="radio"
                      name="timeFilter"
                      checked={timeFilter === item.id}
                      onChange={() => setTimeFilter(item.id as any)}
                      className="text-gold focus:ring-gold"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort & Count Header */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="font-bold text-deepBlack">
                Showing {filteredTrips.length} Scheduled Coaches
              </span>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-luxuryGray border border-gray-200 rounded-lg px-3 py-1.5 font-semibold text-deepBlack focus:outline-none focus:border-gold"
                >
                  <option value="departure">Departure Time</option>
                  <option value="fare_asc">Price: Low to High</option>
                  <option value="fare_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Trip Cards */}
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-gold transition-all duration-300 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Trip Left: Coach details */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark font-bold text-[10px] uppercase tracking-wider">
                      {trip.bus?.bus_type}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      {trip.bus?.registration_number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-deepBlack group-hover:text-gold transition-colors font-display">
                      {trip.bus?.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Trip ID: <span className="font-mono font-semibold">{trip.trip_number}</span>
                    </p>
                  </div>

                  {/* Timings & Duration */}
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Departure</span>
                      <span className="text-base font-black text-deepBlack">{trip.departure_time}</span>
                      <span className="text-[11px] text-gray-500 block truncate max-w-[140px]">
                        {trip.boarding_points[0]}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gold font-bold">{trip.route?.estimated_duration}</span>
                      <div className="w-20 h-0.5 bg-gray-200 my-1 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold" />
                      </div>
                      <span className="text-[10px] text-gray-400">Direct Express</span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Arrival</span>
                      <span className="text-base font-black text-deepBlack">{trip.arrival_time}</span>
                      <span className="text-[11px] text-gray-500 block truncate max-w-[140px]">
                        {trip.dropping_points[0]}
                      </span>
                    </div>
                  </div>

                  {/* Amenities Preview */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {trip.bus?.amenities.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-luxuryGray text-gray-600 px-2 py-0.5 rounded border border-gray-100"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trip Right: Fare & Booking CTA */}
                <div className="md:border-l md:border-gray-100 md:pl-8 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-gray-400 block font-medium">Fare per seat</span>
                    <span className="text-2xl font-black text-deepBlack block">
                      {formatBDT(trip.base_fare)}
                    </span>
                    <span className="inline-block text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                      {trip.available_seats_count} Seats Left
                    </span>
                  </div>

                  <button
                    onClick={() => router.push(`/booking/${trip.id}`)}
                    className="px-6 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span>Select Seats</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-deepBlack text-gold flex items-center justify-center">
          Loading Luxury Trips...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
