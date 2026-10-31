'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import CounterDirectory from '@/components/home/CounterDirectory';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />
      <main className="flex-1">
        <ContactSection />
        <CounterDirectory />
      </main>
      <Footer />
    </div>
  );
}
