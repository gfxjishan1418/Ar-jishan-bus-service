'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import PopularRoutes from '@/components/home/PopularRoutes';
import BusFleet from '@/components/home/BusFleet';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import LiveTrackingPreview from '@/components/home/LiveTrackingPreview';
import CustomerReviews from '@/components/home/CustomerReviews';
import CounterDirectory from '@/components/home/CounterDirectory';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header Navigation */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Banner & Image Carousel */}
        <HeroSection />

        {/* 3. Bus Ticket Search */}
        <SearchSection />

        {/* 4. Popular Routes & Fares */}
        <PopularRoutes />

        {/* 5. Our Bus Fleet */}
        <BusFleet />

        {/* 6. Why Choose Us */}
        <WhyChooseUs />

        {/* 7. Live Bus Tracking Preview */}
        <LiveTrackingPreview />

        {/* 8. Customer Reviews */}
        <CustomerReviews />

        {/* 9. Counter Locations */}
        <CounterDirectory />

        {/* 10. Contact Section */}
        <ContactSection />
      </main>

      {/* 11. Luxury Footer */}
      <Footer />
    </div>
  );
}
