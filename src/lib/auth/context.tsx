'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Profile } from '../types/database';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isAuthenticated: boolean;
  assignedCounter: { id: string; name: string } | null;
  login: (emailOrPhone: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  isAdmin: boolean;
  isCounterStaff: boolean;
}

const DEMO_PROFILES: Record<UserRole, Profile> = {
  customer: {
    id: 'cust-1',
    email: 'rahim@example.com',
    phone: '01711998877',
    full_name: 'Rahim Ahmed',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: 'Mirpur-10, Dhaka',
    is_active: true,
    created_at: '2026-01-15T00:00:00Z',
  },
  counter_operator: {
    id: 'staff-1',
    email: 'operator.gabtoli@arjishanbus.com',
    phone: '01711234567',
    full_name: 'Kamal Hossain (Counter Agent)',
    role: 'counter_operator',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    address: 'Gabtoli Counter Terminal, Dhaka',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  counter_manager: {
    id: 'mgr-1',
    email: 'manager.gabtoli@arjishanbus.com',
    phone: '01711234568',
    full_name: 'Anisur Rahman (Branch Manager)',
    role: 'counter_manager',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    address: 'Gabtoli Counter Terminal, Dhaka',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  admin: {
    id: 'admin-1',
    email: 'admin@arjishanbus.com',
    phone: '01711000111',
    full_name: 'Operations Controller',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    address: 'Head Office, Dhaka',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  super_admin: {
    id: 'super-1',
    email: 'superadmin@arjishanbus.com',
    phone: '01711000000',
    full_name: 'AR Jishan (Managing Director)',
    role: 'super_admin',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    address: 'Corporate Headquarters, Dhaka',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  manager: {
    id: 'route-mgr-1',
    email: 'operations@arjishanbus.com',
    phone: '01711333444',
    full_name: 'Sultana Parvin (Fleet Manager)',
    role: 'manager',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    address: 'Fleet Control Center, Dhaka',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(DEMO_PROFILES.customer);
  const [role, setRole] = useState<UserRole>('customer');

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('arjishan_user_role') as UserRole;
      if (savedRole && DEMO_PROFILES[savedRole]) {
        setRole(savedRole);
        setUser(DEMO_PROFILES[savedRole]);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = async (emailOrPhone: string, targetRole: UserRole = 'customer'): Promise<boolean> => {
    const profile = DEMO_PROFILES[targetRole] || DEMO_PROFILES.customer;
    setUser({
      ...profile,
      email: emailOrPhone.includes('@') ? emailOrPhone : profile.email,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : profile.phone,
    });
    setRole(targetRole);
    try {
      localStorage.setItem('arjishan_user_role', targetRole);
    } catch {
      // ignore
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    setRole('customer');
    try {
      localStorage.removeItem('arjishan_user_role');
    } catch {
      // ignore
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    setUser(profile);
    setRole(newRole);
    try {
      localStorage.setItem('arjishan_user_role', newRole);
    } catch {
      // ignore
    }
  };

  const assignedCounter =
    role === 'counter_operator' || role === 'counter_manager'
      ? { id: 'counter-1', name: 'Dhaka Head Counter (Gabtoli)' }
      : null;

  const isAdmin = role === 'admin' || role === 'super_admin';
  const isCounterStaff = role === 'counter_operator' || role === 'counter_manager';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        assignedCounter,
        login,
        logout,
        switchDemoRole,
        isAdmin,
        isCounterStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
