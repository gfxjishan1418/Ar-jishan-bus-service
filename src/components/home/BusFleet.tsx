'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_BUSES } from '@/lib/data/mock-db';
import { Users, Wifi, Wind, ShieldCheck, ArrowRight } from 'lucide-react';

export default function BusFleet() {
  const { t } = useTranslation();

  return (
    <section id="fleet" className="py-20 bg-deepBlack text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              State-of-the-Art Highway Coaches
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 font-display">
              {t.fleet.title}
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              {t.fleet.subtitle}
            </p>
          </div>
          <Link
            href="/#search"
            className="mt-4 md:mt-0 text-sm font-bold text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1.5"
          >
            <span>{t.fleet.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {INITIAL_BUSES.map((bus) => (
            <div
              key={bus.id}
              className="bg-charcoal rounded-2xl overflow-hidden border border-charcoal-light/70 hover:border-gold/50 transition-all duration-300 flex flex-col group"
            >
              {/* Bus Photo - 3/4 Corner Perspective */}
              <div className="relative h-52 w-full overflow-hidden bg-pureBlack">
                <img
                  src={bus.thumbnail_url}
                  alt={bus.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-deepBlack/85 border border-gold/40 text-[11px] font-bold text-gold backdrop-blur-sm shadow-md">
                  {bus.bus_type}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-gold transition-colors">
                    {bus.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 tracking-wider font-mono mt-0.5">
                    {bus.registration_number}
                  </p>

                  {/* Amenities badges */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {bus.amenities.slice(0, 2).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-charcoal-dark text-gray-300 px-2 py-0.5 rounded border border-charcoal-light"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capacity Footer */}
                <div className="pt-3 border-t border-charcoal-light flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gold font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{bus.seat_capacity} {t.fleet.seats}</span>
                  </div>
                  <Link
                    href={`/search?type=${encodeURIComponent(bus.bus_type)}`}
                    className="text-[11px] text-gray-300 hover:text-gold font-semibold underline underline-offset-2"
                  >
                    Select
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
