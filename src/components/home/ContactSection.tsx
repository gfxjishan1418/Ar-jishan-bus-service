'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <section className="py-20 bg-luxuryGray border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Form Side */}
            <div className="lg:col-span-7 p-8 sm:p-12">
              <span className="text-xs font-bold text-gold uppercase tracking-widest">
                Get In Touch
              </span>
              <h2 className="text-3xl font-extrabold text-deepBlack tracking-tight mt-1 font-display">
                {t.nav.contact}
              </h2>
              <p className="text-xs text-gray-500 mt-2 mb-8">
                Our support team and terminal dispatch managers are available round-the-clock.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Message Received</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Thank you for contacting AR Jishan. A passenger relations officer will contact you shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        {t.booking.fullName}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g. Rahim Ahmed"
                        className="w-full px-4 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="017XXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Message / Inquiries
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder="How may our customer desk assist you?"
                      className="w-full px-4 py-3 rounded-xl bg-luxuryGray border border-gray-200 text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Info Side with Bus Photo Backdrop */}
            <div className="lg:col-span-5 bg-deepBlack text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-deepBlack/85 to-transparent" />

              <div className="relative z-10 space-y-6">
                <span className="text-xs font-bold text-gold uppercase tracking-widest">
                  Corporate Headquarters
                </span>
                <h3 className="text-2xl font-black text-white font-display">
                  AR Jishan Luxury Smart Bus Service
                </h3>

                <div className="space-y-4 pt-4 text-xs text-gray-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Central Operations Complex</p>
                      <p className="text-gray-400 mt-0.5">
                        123, Mirpur Road, Dhaka 1216, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">24/7 Central Hotline</p>
                      <p className="text-gold font-semibold mt-0.5">+880 1711 234567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Passenger Support</p>
                      <p className="text-gray-400 mt-0.5">support@arjishanbus.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-8 mt-8 border-t border-charcoal-light text-[11px] text-gray-400">
                Safe Journey • Better Tomorrow
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
