'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_DESTINATIONS } from '@/lib/data/mock-db';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRightLeft,
  ChevronDown,
} from 'lucide-react';

export default function SearchSection() {
  const { t, language } = useTranslation();
  const router = useRouter();

  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [fromCity, setFromCity] = useState('Dhaka');
  const [toCity, setToCity] = useState('Chattogram');
  const [journeyDate, setJourneyDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: journeyDate,
      passengers: passengers.toString(),
      type: tripType,
    });
    if (tripType === 'roundTrip' && returnDate) {
      query.append('returnDate', returnDate);
    }
    router.push(`/search?${query.toString()}`);
  };

  const selectPopularDestination = (destName: string) => {
    if (fromCity === destName) {
      setFromCity('Dhaka');
      setToCity(destName);
    } else {
      setToCity(destName);
    }
  };

  return (
    <div id="search" className="relative z-30 -mt-16 sm:-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Luxury Search Container */}
      <div className="bg-white rounded-2xl shadow-dark border border-gray-100 p-5 sm:p-7">
        {/* Search Mode Tabs */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-luxuryGray p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTripType('oneWay')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                tripType === 'oneWay'
                  ? 'bg-deepBlack text-gold shadow-md'
                  : 'text-gray-600 hover:text-deepBlack'
              }`}
            >
              {t.search.oneWay}
            </button>
            <button
              type="button"
              onClick={() => setTripType('roundTrip')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                tripType === 'roundTrip'
                  ? 'bg-deepBlack text-gold shadow-md'
                  : 'text-gray-600 hover:text-deepBlack'
              }`}
            >
              {t.search.roundTrip}
            </button>
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Guaranteed Seat Locking & Verified Departures
          </span>
        </div>

        {/* Search Form Inputs */}
        <form onSubmit={handleSearch} className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* From City */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t.search.from}
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-gold pointer-events-none" />
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 bg-luxuryGray border border-gray-200 rounded-xl text-sm font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                  required
                >
                  {INITIAL_DESTINATIONS.map((dest) => (
                    <option key={dest.id} value={dest.name_en}>
                      {language === 'bn' ? dest.name_bn : dest.name_en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* To City & Swap */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {t.search.to}
                </label>
                <button
                  type="button"
                  onClick={swapCities}
                  className="text-xs text-gold font-semibold hover:underline flex items-center gap-1"
                  title={t.search.swap}
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span className="text-[11px]">{t.search.swap}</span>
                </button>
              </div>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-gold pointer-events-none" />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 bg-luxuryGray border border-gray-200 rounded-xl text-sm font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                  required
                >
                  {INITIAL_DESTINATIONS.map((dest) => (
                    <option key={dest.id} value={dest.name_en}>
                      {language === 'bn' ? dest.name_bn : dest.name_en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Journey Date */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t.search.journeyDate}
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3.5 w-4 h-4 text-gold pointer-events-none" />
                <input
                  type="date"
                  value={journeyDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3.5 bg-luxuryGray border border-gray-200 rounded-xl text-sm font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Passengers / Return Date */}
            {tripType === 'roundTrip' ? (
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {t.search.returnDate}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3.5 w-4 h-4 text-gold pointer-events-none" />
                  <input
                    type="date"
                    value={returnDate}
                    min={journeyDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3.5 bg-luxuryGray border border-gray-200 rounded-xl text-sm font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors cursor-pointer"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {t.search.passengers}
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3.5 w-4 h-4 text-gold pointer-events-none" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="w-full pl-10 pr-8 py-3.5 bg-luxuryGray border border-gray-200 rounded-xl text-sm font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={3}>3 Passengers</option>
                    <option value={4}>4 Passengers (Max)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Search Buses CTA Button */}
            <div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-black text-sm uppercase tracking-wider shadow-gold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>{t.search.searchBuses}</span>
              </button>
            </div>
          </div>

          {/* Popular Destination Pills */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 mr-1">
              {t.search.popularDestinations}:
            </span>
            {INITIAL_DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => selectPopularDestination(dest.name_en)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  toCity === dest.name_en
                    ? 'bg-deepBlack text-gold border border-gold'
                    : 'bg-luxuryGray text-gray-600 hover:bg-gray-200 hover:text-deepBlack'
                }`}
              >
                {language === 'bn' ? dest.name_bn : dest.name_en}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
