# AR Jishan Luxury Smart Bus Service
### Premium Bus Booking & Transportation Management Platform (Bangladesh)

A full-stack, enterprise-grade Bus Booking, Fleet Tracking, Counter Management, and Admin SaaS platform tailored for the Bangladesh intercity transport market.

---

## 🌟 Key Features

1. **Luxury Customer Experience (Bilingual EN / BN):**
   - High-fidelity Gold & Black luxury aesthetic.
   - Real-time bus search with popular BD destinations (Dhaka, Chattogram, Cox's Bazar, Sylhet, etc.).
   - Interactive seat map with real-time status (Available, Selected, Booked, Temporarily Locked, Reserved).
   - Passenger details capture, automated fare breakdown, discount coupon validation.
   - Official Bangladesh payment adapters (bKash Merchant Checkout API, Nagad API, Bank Deposit Slip upload, Counter Cash).
   - Instant downloadable & printable PDF Electronic Ticket with cryptographic QR Code.

2. **Concurrency & Anti-Double-Booking Engine:**
   - PostgreSQL atomic transactions & Row Level Security (RLS).
   - Automatic 10-minute temporary seat lock with expiration sweep.
   - Prevents simultaneous checkout collision.

3. **Customer Portal:**
   - Upcoming & past trips tracking.
   - One-click PDF ticket download & print.
   - Cancellation requests & refund calculation based on dynamic company policy.
   - Verified journey reviews submission.

4. **Counter Management Portal:**
   - Isolated counter-scoped access for ticket sellers.
   - Instant counter ticket issuance with cash payment receipting.
   - Counter passenger manifest & daily cash reconciliation reports.

5. **Super Admin Management Suite:**
   - Live revenue, bookings, active buses, and performance analytics.
   - Fleet Management (buses, categories, amenities, seating layout).
   - Route & Trip Management (intermediate stops, boarding/dropping points, pricing rules).
   - Refund approval/rejection workflow with audit trail.
   - Real GPS tracking hardware/driver integration receiver.
   - Customer and staff RBAC (Super Admin, Admin, Manager, Counter Operator).
   - Company branding & homepage carousel editor.

---

## 🏗️ Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend / Database:** Supabase, PostgreSQL 15, Row Level Security (RLS), Supabase Edge Functions / Next.js Server Actions
- **Ticketing & Verification:** jsPDF, html2canvas, QRCode generator & QR scanner
- **Payments:** bKash Checkout URL API v1.2, Nagad Merchant API, Manual Bank Verification, Counter Cash

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18.0.0+ or v20.0.0+
- npm v9.0.0+
- Supabase project (cloud or local)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# bKash Sandbox / Production credentials
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

# Nagad Sandbox / Production credentials
NAGAD_MERCHANT_ID=your_nagad_merchant_id
NAGAD_BASE_URL=http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs

# Next.js App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
Execute the migration scripts located in `supabase/migrations/` in order:
- `01_initial_schema.sql` (Creates all 30 relational tables, indexes, constraints)
- `02_atomic_booking_rpc.sql` (PostgreSQL functions for atomic seat locking and double-booking prevention)
- `03_row_level_security.sql` (RLS policies for customers, counters, and admins)
- `04_sample_bangladesh_data.sql` (Realistic routes, buses, counters, and trips for Bangladesh)

### 5. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
