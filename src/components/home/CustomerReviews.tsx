'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { INITIAL_REVIEWS } from '@/lib/data/mock-db';
import { formatDateBD } from '@/lib/utils';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export default function CustomerReviews() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-luxuryGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Verified Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-deepBlack tracking-tight mt-1 font-display">
            {t.reviews.title}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-gold transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/15 group-hover:text-gold/30 transition-colors" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'text-gold fill-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  &ldquo;{rev.review_text}&rdquo;
                </p>
              </div>

              {/* Author & Route */}
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-deepBlack flex items-center gap-1.5">
                    {rev.customer_name}
                    {rev.is_verified && (
                      <span title="Verified Passenger">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-gold font-medium mt-0.5">
                    {rev.route_name}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400">
                  {formatDateBD(rev.journey_date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
