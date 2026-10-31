'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_ROUTES } from '@/lib/data/mock-db';
import { formatBDT } from '@/lib/utils';
import { Clock, ArrowRight, Bus } from 'lucide-react';

export default function PopularRoutes() {
  const { t, language } = useTranslation();

  return (
    <section id="routes" className="py-20 bg-luxuryGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Direct Highway Connections
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-deepBlack tracking-tight mt-1 font-display">
              {t.routes.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              {t.routes.subtitle}
            </p>
          </div>
          <Link
            href="/search?from=Dhaka&to=Chattogram"
            className="mt-4 md:mt-0 text-sm font-bold text-gold hover:text-gold-dark transition-colors inline-flex items-center gap-1.5"
          >
            <span>{t.routes.viewAllRoutes}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_ROUTES.map((route) => {
            const originName = language === 'bn' ? route.origin?.name_bn : route.origin?.name_en;
            const destName = language === 'bn' ? route.destination?.name_bn : route.destination?.name_en;

            return (
              <div
                key={route.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-gold transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Image Box */}
                <div className="relative h-48 w-full overflow-hidden bg-charcoal">
                  <img
                    src={route.destination?.image_url}
                    alt={`${route.origin?.name_en} to ${route.destination?.name_en}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deepBlack/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 bg-deepBlack/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>{route.estimated_duration}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-deepBlack group-hover:text-gold transition-colors">
                      {originName} → {destName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Bus className="w-3.5 h-3.5 text-gold" />
                      <span>AC Coach • Sleeper • Business Class</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 block uppercase font-medium">
                        {t.routes.startingFrom}
                      </span>
                      <span className="text-lg font-black text-deepBlack">
                        {formatBDT(route.starting_fare)}
                      </span>
                    </div>

                    <Link
                      href={`/search?from=${route.origin?.name_en}&to=${route.destination?.name_en}`}
                      className="px-4 py-2 rounded-xl bg-deepBlack text-white hover:bg-gold hover:text-deepBlack font-bold text-xs transition-colors shadow-sm"
                    >
                      {t.routes.viewSchedule}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
