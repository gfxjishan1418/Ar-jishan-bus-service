'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { ChevronLeft, ChevronRight, Play, Shield, Compass, Sparkles } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: '/images/fleet/ac-coach.jpg',
    title: 'AR Jishan Luxury Smart Bus Service',
    subtitle: 'Safe Journey • Better Tomorrow',
    badge: 'Premier Highway Fleet of Bangladesh',
  },
  {
    image: '/images/fleet/business-class.jpg',
    title: 'Ultra-Comfort Business Class Recliners',
    subtitle: '1x2 Executive Seating • Dhaka to Cox’s Bazar',
    badge: 'Exclusive Business Travel',
  },
  {
    image: '/images/fleet/sleeper-coach.jpg',
    title: 'Dreamliner Sleeper Coaches',
    subtitle: 'Flat-bed Privacy Pods For Overnight Highway Journeys',
    badge: 'Zero Fatigue Travel',
  },
];

export default function HeroSection() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full h-[620px] sm:h-[680px] bg-deepBlack overflow-hidden flex items-center">
      {/* Background Slides */}
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Dark Vignette */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 transform scale-105"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          />
          {/* Gradient Overlay for high legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-pureBlack/95 via-deepBlack/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-transparent to-pureBlack/60" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="max-w-2xl space-y-6">
          {/* Top Gold Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal/90 border border-gold/40 text-gold text-xs font-semibold uppercase tracking-widest shadow-gold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
            <span>{HERO_SLIDES[currentSlide].badge}</span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <p className="text-gold uppercase tracking-[0.25em] text-xs sm:text-sm font-bold">
              {t.brand.welcome}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-display">
              <span className="text-gold-gradient">AR Jishan</span>
              <br />
              <span className="text-white text-3xl sm:text-4xl lg:text-5xl">
                Luxury Smart Bus Service
              </span>
            </h1>
          </div>

          {/* Slogan */}
          <p className="text-gray-300 text-sm sm:text-base font-normal max-w-lg leading-relaxed">
            {t.brand.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="#search"
              className="px-8 py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-sm uppercase tracking-wider shadow-gold-lg transition-all transform hover:-translate-y-0.5"
            >
              {t.hero.bookYourTicket}
            </Link>
            <Link
              href="#fleet"
              className="px-6 py-4 rounded-xl bg-charcoal/80 border border-gold/40 hover:border-gold text-gray-200 hover:text-white font-semibold text-sm flex items-center gap-2.5 transition-all backdrop-blur-sm"
            >
              <Play className="w-4 h-4 text-gold fill-gold" />
              <span>{t.hero.watchVideo}</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-charcoal/60 max-w-lg text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <Shield className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Safe Travel</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Compass className="w-4 h-4 text-gold flex-shrink-0" />
              <span>GPS Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-charcoal/80 border border-gold/30 text-gold hover:bg-gold hover:text-deepBlack transition-colors hidden sm:flex items-center justify-center"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-charcoal/80 border border-gold/30 text-gold hover:bg-gold hover:text-deepBlack transition-colors hidden sm:flex items-center justify-center"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-charcoal-light hover:bg-gray-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
