'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { UserRole } from '@/lib/types/database';
import {
  Lock,
  Mail,
  Phone,
  User,
  Shield,
  Eye,
  EyeOff,
  Bus,
  CheckCircle2,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, switchDemoRole } = useAuth();
  const { t } = useTranslation();

  const isRegisterParam = searchParams.get('register') === 'true';
  const [isRegister, setIsRegister] = useState(isRegisterParam);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('rahim@example.com');
  const [password, setPassword] = useState('Password123!');
  const [roleSelect, setRoleSelect] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(identifier, roleSelect);
    setLoading(false);

    if (roleSelect === 'super_admin' || roleSelect === 'admin') {
      router.push('/admin');
    } else if (roleSelect === 'counter_operator' || roleSelect === 'counter_manager') {
      router.push('/counter');
    } else {
      router.push('/customer');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    switchDemoRole(role);
    if (role === 'super_admin' || role === 'admin') {
      router.push('/admin');
    } else if (role === 'counter_operator' || role === 'counter_manager') {
      router.push('/counter');
    } else {
      router.push('/customer');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxuryGray">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl max-w-md w-full p-8 sm:p-10 space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="AR Jishan Luxury Smart Bus Service"
                className="h-16 w-auto mx-auto object-contain drop-shadow-md"
              />
            </Link>
            <h1 className="text-2xl font-black text-deepBlack font-display">
              {isRegister ? 'Passenger Registration' : 'Account Login'}
            </h1>
            <p className="text-xs text-gray-500">
              {isRegister
                ? 'Create your AR Jishan account for faster ticket booking'
                : 'Access your confirmed electronic tickets and live bus tracking'}
            </p>
          </div>

          {/* Quick Demo Switcher Card for Test Evaluation */}
          <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 text-xs space-y-2">
            <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider block">
              1-Click Demo Evaluation Sign-in:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="py-1.5 px-2 rounded-lg bg-white border border-gold/40 text-deepBlack font-bold text-[10px] hover:bg-gold hover:text-deepBlack transition-colors text-center"
              >
                Passenger
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('counter_operator')}
                className="py-1.5 px-2 rounded-lg bg-white border border-gold/40 text-deepBlack font-bold text-[10px] hover:bg-gold hover:text-deepBlack transition-colors text-center"
              >
                Counter Staff
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('super_admin')}
                className="py-1.5 px-2 rounded-lg bg-white border border-gold/40 text-deepBlack font-bold text-[10px] hover:bg-gold hover:text-deepBlack transition-colors text-center"
              >
                Super Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-gold" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Rahim Ahmed"
                    className="w-full pl-10 pr-4 py-3 bg-luxuryGray border border-gray-200 rounded-xl text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email or Mobile Number
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-gold" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="name@example.com or 017XXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 bg-luxuryGray border border-gray-200 rounded-xl text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email.')}
                    className="text-[11px] text-gold font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-gold" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-luxuryGray border border-gray-200 rounded-xl text-xs font-semibold text-deepBlack focus:outline-none focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-deepBlack font-bold text-xs uppercase tracking-wider shadow-gold transition-all"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In to Account'}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2 text-xs text-gray-600">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-gold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-gold hover:underline"
                >
                  Register Now
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-deepBlack text-gold flex items-center justify-center">
          Loading Security Portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
