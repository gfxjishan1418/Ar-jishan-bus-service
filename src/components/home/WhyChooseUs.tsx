'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';
import {
  Armchair,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Navigation,
  Headphones,
} from 'lucide-react';

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Armchair,
      title: t.whyUs.comfortTitle,
      description: t.whyUs.comfortDesc,
    },
    {
      icon: ShieldCheck,
      title: t.whyUs.secureTitle,
      description: t.whyUs.secureDesc,
    },
    {
      icon: UserCheck,
      title: t.whyUs.serviceTitle,
      description: t.whyUs.serviceDesc,
    },
    {
      icon: CreditCard,
      title: t.whyUs.paymentTitle,
      description: t.whyUs.paymentDesc,
    },
    {
      icon: Navigation,
      title: t.whyUs.trackingTitle,
      description: t.whyUs.trackingDesc,
    },
    {
      icon: Headphones,
      title: t.whyUs.supportTitle,
      description: t.whyUs.supportDesc,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Excellence in Transit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-deepBlack tracking-tight mt-1 font-display">
            {t.whyUs.title}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-luxuryGray border border-gray-100 hover:border-gold/50 hover:shadow-gold transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-deepBlack border border-gold/40 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-md">
                  <Icon className="w-7 h-7 text-gold stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-deepBlack group-hover:text-gold transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
