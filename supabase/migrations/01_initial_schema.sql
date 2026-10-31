-- ==============================================================================
-- 01_initial_schema.sql
-- AR Jishan Luxury Smart Bus Service – Supabase / PostgreSQL Database Architecture
-- 30 Relational Tables, Constraints, Indexes & Auditing
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends auth.users or standalone auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    address TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('super_admin', 'admin', 'manager', 'counter_manager', 'counter_operator', 'customer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ROLES
CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PERMISSIONS
CREATE TABLE IF NOT EXISTS public.permissions (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROLE_PERMISSIONS
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id VARCHAR(50) REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 5. DESTINATIONS (Bangladesh Cities / Terminals)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    division VARCHAR(50) NOT NULL,
    terminal_name VARCHAR(150),
    is_popular BOOLEAN NOT NULL DEFAULT false,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BUSES (Fleet)
CREATE TABLE IF NOT EXISTS public.buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    bus_type VARCHAR(50) NOT NULL CHECK (bus_type IN ('AC Coach', 'Non-AC Coach', 'Business Class', 'Sleeper Coach', 'Double Decker')),
    seat_capacity INT NOT NULL,
    deck_count INT NOT NULL DEFAULT 1 CHECK (deck_count IN (1, 2)),
    amenities JSONB DEFAULT '["Air Condition", "WiFi", "USB Charging", "Mineral Water", "Comfortable Reclining Seats"]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    thumbnail_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BUS_IMAGES
CREATE TABLE IF NOT EXISTS public.bus_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BUS_SEATS (Layout configuration per bus)
CREATE TABLE IF NOT EXISTS public.bus_seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL, -- e.g. A1, A2, B1, B2, S1
    deck INT NOT NULL DEFAULT 1 CHECK (deck IN (1, 2)),
    row_number INT NOT NULL,
    column_number INT NOT NULL,
    seat_class VARCHAR(50) NOT NULL DEFAULT 'standard' CHECK (seat_class IN ('standard', 'vip', 'sleeper_lower', 'sleeper_upper')),
    is_restricted_female BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(bus_id, seat_number, deck)
);

-- 9. ROUTES
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin_id UUID NOT NULL REFERENCES public.destinations(id),
    destination_id UUID NOT NULL REFERENCES public.destinations(id),
    distance_km NUMERIC(6,2),
    estimated_duration VARCHAR(50), -- e.g. 5h 30m
    starting_fare NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(origin_id, destination_id)
);

-- 10. ROUTE_STOPS (Intermediate halts)
CREATE TABLE IF NOT EXISTS public.route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    stop_name_en VARCHAR(100) NOT NULL,
    stop_name_bn VARCHAR(100) NOT NULL,
    stop_order INT NOT NULL,
    distance_from_origin_km NUMERIC(6,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. COUNTERS (Physical ticketing offices)
CREATE TABLE IF NOT EXISTS public.counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL, -- e.g. DHK-GBL-01
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    opening_hours VARCHAR(100) DEFAULT '06:00 AM - 11:30 PM',
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. COUNTER_STAFF (Assigns users to counter offices)
CREATE TABLE IF NOT EXISTS public.counter_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counter_id UUID NOT NULL REFERENCES public.counters(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_role VARCHAR(50) NOT NULL DEFAULT 'counter_operator' CHECK (staff_role IN ('counter_manager', 'counter_operator')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(counter_id, user_id)
);

-- 13. TRIPS (Specific scheduled bus journeys)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. ARJ-202610-001
    bus_id UUID NOT NULL REFERENCES public.buses(id),
    route_id UUID NOT NULL REFERENCES public.routes(id),
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    base_fare NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'boarding', 'in_transit', 'completed', 'cancelled')),
    origin_counter_id UUID REFERENCES public.counters(id),
    destination_counter_id UUID REFERENCES public.counters(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. TRIP_STOPS (Boarding and Dropping points with timing)
CREATE TABLE IF NOT EXISTS public.trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    stop_name VARCHAR(150) NOT NULL,
    stop_type VARCHAR(20) NOT NULL CHECK (stop_type IN ('boarding', 'dropping')),
    scheduled_time TIME NOT NULL,
    fare_adjustment NUMERIC(8,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. SEAT_LOCKS (Temporary atomic reservations with expiration TTL)
CREATE TABLE IF NOT EXISTS public.seat_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE(trip_id, seat_number)
);

-- 16. BOOKINGS (Master booking ticket records)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. ARJ-BKG-84920
    pnr VARCHAR(20) UNIQUE NOT NULL,        -- e.g. AR8921X
    trip_id UUID NOT NULL REFERENCES public.trips(id),
    customer_id UUID REFERENCES public.profiles(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150),
    customer_phone VARCHAR(50) NOT NULL,
    boarding_point VARCHAR(150) NOT NULL,
    dropping_point VARCHAR(150) NOT NULL,
    total_seats INT NOT NULL,
    subtotal_fare NUMERIC(10,2) NOT NULL,
    service_charge NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    booking_status VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'partially_cancelled', 'refunded')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    booking_channel VARCHAR(30) NOT NULL DEFAULT 'online' CHECK (booking_channel IN ('online', 'counter', 'app')),
    counter_id UUID REFERENCES public.counters(id),
    booked_by_staff_id UUID REFERENCES public.profiles(id),
    qr_code_data TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. BOOKING_SEATS
CREATE TABLE IF NOT EXISTS public.booking_seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    seat_fare NUMERIC(10,2) NOT NULL,
    passenger_name VARCHAR(150) NOT NULL,
    passenger_gender VARCHAR(20) DEFAULT 'unspecified' CHECK (passenger_gender IN ('male', 'female', 'other', 'unspecified')),
    is_cancelled BOOLEAN NOT NULL DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    UNIQUE(booking_id, seat_number)
);

-- 18. PASSENGERS (Detailed passenger records per booking)
CREATE TABLE IF NOT EXISTS public.passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    gender VARCHAR(20),
    contact_number VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. PAYMENTS (Audit log of transactions)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('bkash', 'nagad', 'bank_transfer', 'cash', 'card')),
    transaction_id VARCHAR(100) UNIQUE,
    amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
    provider_reference VARCHAR(255),
    bank_name VARCHAR(100),
    bank_account_info VARCHAR(100),
    bank_slip_url TEXT,
    verified_by_user_id UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. REFUNDS
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    cancellation_request_id UUID,
    refund_amount NUMERIC(10,2) NOT NULL,
    cancellation_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    refund_method VARCHAR(50) NOT NULL CHECK (refund_method IN ('bkash', 'nagad', 'bank_transfer', 'cash')),
    refund_transaction_id VARCHAR(100),
    refund_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (refund_status IN ('pending', 'approved', 'processed', 'rejected')),
    remarks TEXT,
    processed_by_user_id UUID REFERENCES public.profiles(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. CANCELLATION_REQUESTS
CREATE TABLE IF NOT EXISTS public.cancellation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id),
    seats_to_cancel TEXT[] NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    requested_refund_amount NUMERIC(10,2) NOT NULL,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    customer_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    route_name VARCHAR(200),
    journey_date DATE,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    max_discount_amount NUMERIC(10,2),
    min_booking_amount NUMERIC(10,2) DEFAULT 0.00,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_limit INT,
    times_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. COUPON_USAGE
CREATE TABLE IF NOT EXISTS public.coupon_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id),
    discount_applied NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. TRACKING_DEVICES (GPS hardware or driver app identifier)
CREATE TABLE IF NOT EXISTS public.tracking_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_imei VARCHAR(100) UNIQUE NOT NULL,
    bus_id UUID REFERENCES public.buses(id),
    device_type VARCHAR(50) DEFAULT 'obd2_gps' CHECK (device_type IN ('obd2_gps', 'hardwired_gps', 'driver_app')),
    api_key_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_ping_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. TRACKING_LOCATIONS (Telemetry stream)
CREATE TABLE IF NOT EXISTS public.tracking_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES public.tracking_devices(id) ON DELETE CASCADE,
    bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES public.trips(id),
    latitude NUMERIC(10,7) NOT NULL,
    longitude NUMERIC(10,7) NOT NULL,
    speed_kmh NUMERIC(5,2) DEFAULT 0.00,
    heading NUMERIC(5,2),
    current_landmark VARCHAR(200),
    next_stop VARCHAR(150),
    battery_level INT,
    recorded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    booking_id UUID REFERENCES public.bookings(id),
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('in_app', 'sms', 'email')),
    recipient_target VARCHAR(150) NOT NULL, -- phone or email
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    delivery_status VARCHAR(30) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed', 'mock_sent')),
    provider_message_id VARCHAR(100),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. HOMEPAGE_BANNERS
CREATE TABLE IF NOT EXISTS public.homepage_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    image_url TEXT NOT NULL,
    cta_text VARCHAR(100) DEFAULT 'Book Your Ticket',
    cta_link VARCHAR(255) DEFAULT '/#search',
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 29. COMPANY_SETTINGS
CREATE TABLE IF NOT EXISTS public.company_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
    company_name VARCHAR(200) NOT NULL DEFAULT 'AR Jishan Luxury Smart Bus Service',
    slogan VARCHAR(255) DEFAULT 'Safe Journey • Better Tomorrow',
    logo_url TEXT,
    address TEXT DEFAULT '123, Mirpur Road, Dhaka 1216, Bangladesh',
    contact_phone VARCHAR(50) DEFAULT '+880 1711 234567',
    contact_email VARCHAR(100) DEFAULT 'support@arjishanbus.com',
    cancellation_deadline_hours INT DEFAULT 12,
    cancellation_fee_percentage NUMERIC(5,2) DEFAULT 15.00,
    currency VARCHAR(10) DEFAULT 'BDT',
    timezone VARCHAR(50) DEFAULT 'Asia/Dhaka',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 30. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_trips_date_route ON public.trips(departure_date, route_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON public.bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_seat_locks_trip_expiry ON public.seat_locks(trip_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_tracking_loc_bus_time ON public.tracking_locations(bus_id, recorded_at DESC);
