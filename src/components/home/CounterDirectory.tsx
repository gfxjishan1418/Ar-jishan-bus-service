'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_COUNTERS } from '@/lib/data/mock-db';
import {
  MapPin,
  Phone,
  Clock,
  Search,
  ExternalLink,
  Building,
  CheckCircle2,
} from 'lucide-react';

export default function CounterDirectory() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCounters = INITIAL_COUNTERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="counters" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Nationwide Presence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-deepBlack tracking-tight mt-1 font-display">
              {t.counters.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              {t.counters.subtitle}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-4 md:mt-0 relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.counters.searchCounter}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-medium text-deepBlack placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCounters.map((counter) => (
            <div
              key={counter.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gold/60 shadow-sm hover:shadow-gold transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-deepBlack border border-gold/40 flex items-center justify-center shadow-sm">
                    <Building className="w-5 h-5 text-gold" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold-dark font-mono font-bold text-[10px]">
                    {counter.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-deepBlack mt-4">
                  {counter.name}
                </h3>
                <span className="inline-block text-[11px] font-semibold text-gold mt-0.5">
                  District: {counter.district}
                </span>

                <div className="space-y-2 mt-4 text-xs text-gray-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{counter.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{counter.opening_hours}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-deepBlack">{counter.contact_number}</span>
                  </div>
                </div>

                {/* Lounge services */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-500">
                  <span className="bg-luxuryGray px-2 py-0.5 rounded">AC Lounge</span>
                  <span className="bg-luxuryGray px-2 py-0.5 rounded">Luggage Bay</span>
                  <span className="bg-luxuryGray px-2 py-0.5 rounded">Cash Counter</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:${counter.contact_number.replace(/\s+/g, '')}`}
                  className="px-3.5 py-1.5 rounded-lg bg-deepBlack text-white hover:bg-gold hover:text-deepBlack font-bold text-xs transition-colors"
                >
                  {t.counters.callCounter}
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${counter.latitude},${counter.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
