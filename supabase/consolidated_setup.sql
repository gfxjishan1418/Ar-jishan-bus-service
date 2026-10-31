-- ============================================================================

-- AR JISHAN LUXURY SMART BUS PLATFORM - COMPLETE DATABASE SETUP

-- Generated for Supabase Project: hgbhituomvyenborlkrw

-- ============================================================================



-- SECTION 1: CORE SCHEMA & TABLES

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
    estimated_duration VARCHAR(50), -- e.g. '5h 30m'
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




-- SECTION 2: ATOMIC TRANSACTIONAL BOOKING PROCEDURES

-- ==============================================================================
-- 02_atomic_booking_rpc.sql
-- AR Jishan Luxury Smart Bus Service – Anti-Double Booking & Atomic RPC Functions
-- ==============================================================================

-- 1. Helper function to sweep expired locks
CREATE OR REPLACE FUNCTION public.fn_cleanup_expired_seat_locks()
RETURNS INT AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM public.seat_locks
    WHERE expires_at <= NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Atomic Seat Locking Function
-- Locks seats for p_lock_seconds (default 600 = 10 mins).
-- Returns true if all requested seats are successfully locked; raises exception or returns false if any seat is taken.
CREATE OR REPLACE FUNCTION public.fn_acquire_seat_lock(
    p_trip_id UUID,
    p_seat_numbers TEXT[],
    p_session_id VARCHAR(100),
    p_user_id UUID DEFAULT NULL,
    p_lock_seconds INT DEFAULT 600
)
RETURNS JSONB AS $$
DECLARE
    v_seat TEXT;
    v_conflict_seat TEXT;
    v_now TIMESTAMPTZ := NOW();
    v_expires_at TIMESTAMPTZ := NOW() + (p_lock_seconds || ' seconds')::INTERVAL;
BEGIN
    -- Clean up already expired locks first
    PERFORM public.fn_cleanup_expired_seat_locks();

    -- Acquire an exclusive advisory lock or row-level check to prevent race condition between concurrent lock attempts on the same trip
    PERFORM pg_advisory_xact_lock(hashtext(p_trip_id::TEXT));

    -- Check if any of the requested seats are already confirmed in an active booking
    SELECT bs.seat_number INTO v_conflict_seat
    FROM public.booking_seats bs
    JOIN public.bookings b ON b.id = bs.booking_id
    WHERE b.trip_id = p_trip_id
      AND bs.seat_number = ANY(p_seat_numbers)
      AND b.booking_status = 'confirmed'
      AND bs.is_cancelled = false
    LIMIT 1;

    IF v_conflict_seat IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'SEAT_ALREADY_BOOKED',
            'conflict_seat', v_conflict_seat,
            'message', 'Seat ' || v_conflict_seat || ' has already been purchased.'
        );
    END IF;

    -- Check if any of the requested seats are locked by another session and not yet expired
    SELECT sl.seat_number INTO v_conflict_seat
    FROM public.seat_locks sl
    WHERE sl.trip_id = p_trip_id
      AND sl.seat_number = ANY(p_seat_numbers)
      AND sl.session_id <> p_session_id
      AND sl.expires_at > v_now
    LIMIT 1;

    IF v_conflict_seat IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'SEAT_LOCKED_BY_ANOTHER',
            'conflict_seat', v_conflict_seat,
            'message', 'Seat ' || v_conflict_seat || ' is currently being booked by another customer.'
        );
    END IF;

    -- Upsert/insert seat locks for this session
    FOREACH v_seat IN ARRAY p_seat_numbers
    LOOP
        INSERT INTO public.seat_locks (trip_id, seat_number, session_id, user_id, locked_at, expires_at)
        VALUES (p_trip_id, v_seat, p_session_id, p_user_id, v_now, v_expires_at)
        ON CONFLICT (trip_id, seat_number)
        DO UPDATE SET
            session_id = EXCLUDED.session_id,
            user_id = EXCLUDED.user_id,
            locked_at = EXCLUDED.locked_at,
            expires_at = EXCLUDED.expires_at;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'locked_seats', p_seat_numbers,
        'expires_at', v_expires_at,
        'ttl_seconds', p_lock_seconds
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Release Seat Lock Function
CREATE OR REPLACE FUNCTION public.fn_release_seat_lock(
    p_trip_id UUID,
    p_seat_numbers TEXT[],
    p_session_id VARCHAR(100)
)
RETURNS JSONB AS $$
BEGIN
    DELETE FROM public.seat_locks
    WHERE trip_id = p_trip_id
      AND seat_number = ANY(p_seat_numbers)
      AND session_id = p_session_id;

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Atomic Booking Confirmation Function
-- Validates locks, confirms booking, inserts booking seats, and clears locks in a single atomic transaction.
CREATE OR REPLACE FUNCTION public.fn_confirm_booking(
    p_trip_id UUID,
    p_session_id VARCHAR(100),
    p_customer_id UUID,
    p_customer_name VARCHAR(150),
    p_customer_email VARCHAR(150),
    p_customer_phone VARCHAR(50),
    p_boarding_point VARCHAR(150),
    p_dropping_point VARCHAR(150),
    p_seats JSONB, -- Array of objects: [{"seat_number":"A1", "fare":1200, "passenger_name":"Jishan", "gender":"male"}]
    p_discount_amount NUMERIC(10,2) DEFAULT 0.00,
    p_service_charge NUMERIC(10,2) DEFAULT 0.00,
    p_payment_method VARCHAR(50) DEFAULT 'bkash',
    p_transaction_id VARCHAR(100) DEFAULT NULL,
    p_booking_channel VARCHAR(30) DEFAULT 'online',
    p_counter_id UUID DEFAULT NULL,
    p_staff_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_booking_id_str VARCHAR(50);
    v_pnr_str VARCHAR(20);
    v_new_booking_id UUID;
    v_subtotal NUMERIC(10,2) := 0.00;
    v_total NUMERIC(10,2) := 0.00;
    v_seat_obj JSONB;
    v_seat_num TEXT;
    v_seat_fare NUMERIC(10,2);
    v_pname TEXT;
    v_gender TEXT;
    v_total_seats INT := jsonb_array_length(p_seats);
    v_conflict_seat TEXT;
BEGIN
    -- Prevent concurrency collision on trip
    PERFORM pg_advisory_xact_lock(hashtext(p_trip_id::TEXT));

    -- Check if any seat is already booked
    FOR v_seat_obj IN SELECT * FROM jsonb_array_elements(p_seats)
    LOOP
        v_seat_num := v_seat_obj->>'seat_number';
        SELECT bs.seat_number INTO v_conflict_seat
        FROM public.booking_seats bs
        JOIN public.bookings b ON b.id = bs.booking_id
        WHERE b.trip_id = p_trip_id
          AND bs.seat_number = v_seat_num
          AND b.booking_status = 'confirmed'
          AND bs.is_cancelled = false
        LIMIT 1;

        IF v_conflict_seat IS NOT NULL THEN
            RAISE EXCEPTION 'Double booking collision detected: seat % is already booked.', v_conflict_seat;
        END IF;

        v_seat_fare := (v_seat_obj->>'fare')::NUMERIC;
        v_subtotal := v_subtotal + v_seat_fare;
    END LOOP;

    v_total := (v_subtotal + p_service_charge) - p_discount_amount;
    IF v_total < 0 THEN
        v_total := 0;
    END IF;

    -- Generate unique human-readable PNR and Booking ID
    v_pnr_str := 'AR' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
    v_booking_id_str := 'ARJ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0');

    -- Insert Master Booking
    INSERT INTO public.bookings (
        booking_id, pnr, trip_id, customer_id, customer_name, customer_email, customer_phone,
        boarding_point, dropping_point, total_seats, subtotal_fare, service_charge,
        discount_amount, total_amount, booking_status, payment_status, booking_channel,
        counter_id, booked_by_staff_id, qr_code_data
    ) VALUES (
        v_booking_id_str, v_pnr_str, p_trip_id, p_customer_id, p_customer_name, p_customer_email, p_customer_phone,
        p_boarding_point, p_dropping_point, v_total_seats, v_subtotal, p_service_charge,
        p_discount_amount, v_total, 'confirmed', 'paid', p_booking_channel,
        p_counter_id, p_staff_id, 'VERIFY:' || v_pnr_str || ':' || v_booking_id_str
    ) RETURNING id INTO v_new_booking_id;

    -- Insert individual seats and passenger records
    FOR v_seat_obj IN SELECT * FROM jsonb_array_elements(p_seats)
    LOOP
        v_seat_num := v_seat_obj->>'seat_number';
        v_seat_fare := (v_seat_obj->>'fare')::NUMERIC;
        v_pname := COALESCE(v_seat_obj->>'passenger_name', p_customer_name);
        v_gender := COALESCE(v_seat_obj->>'gender', 'unspecified');

        INSERT INTO public.booking_seats (booking_id, seat_number, seat_fare, passenger_name, passenger_gender)
        VALUES (v_new_booking_id, v_seat_num, v_seat_fare, v_pname, v_gender);

        INSERT INTO public.passengers (booking_id, seat_number, full_name, gender, contact_number)
        VALUES (v_new_booking_id, v_seat_num, v_pname, v_gender, p_customer_phone);

        -- Delete seat lock
        DELETE FROM public.seat_locks
        WHERE trip_id = p_trip_id AND seat_number = v_seat_num;
    END LOOP;

    -- Insert initial payment record
    INSERT INTO public.payments (
        booking_id, payment_method, transaction_id, amount, payment_status, provider_reference
    ) VALUES (
        v_new_booking_id, p_payment_method, COALESCE(p_transaction_id, 'TXN-' || v_pnr_str), v_total, 'paid', 'INITIAL_CHECKOUT'
    );

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id_str,
        'pnr', v_pnr_str,
        'db_id', v_new_booking_id,
        'total_amount', v_total
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;




-- SECTION 3: ROW LEVEL SECURITY (RLS) POLICIES

-- ==============================================================================
-- 03_row_level_security.sql
-- AR Jishan Luxury Smart Bus Service – Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counter_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin or super admin
CREATE OR REPLACE FUNCTION public.fn_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check user's assigned counter ID
CREATE OR REPLACE FUNCTION public.fn_get_user_counter_id()
RETURNS UUID AS $$
DECLARE
    v_counter_id UUID;
BEGIN
    SELECT counter_id INTO v_counter_id
    FROM public.counter_staff
    WHERE user_id = auth.uid() AND is_active = true
    LIMIT 1;
    RETURN v_counter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
CREATE POLICY "Users can read their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.fn_is_admin());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())); -- Prevent self-privilege escalation

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
USING (public.fn_is_admin());

-- 2. PUBLIC CATALOG (Destinations, Buses, Routes, Trips, Counters)
CREATE POLICY "Public read active destinations"
ON public.destinations FOR SELECT
USING (true);

CREATE POLICY "Public read active buses"
ON public.buses FOR SELECT
USING (is_active = true OR public.fn_is_admin());

CREATE POLICY "Public read active routes"
ON public.routes FOR SELECT
USING (is_active = true OR public.fn_is_admin());

CREATE POLICY "Public read active trips"
ON public.trips FOR SELECT
USING (status <> 'cancelled' OR public.fn_is_admin());

CREATE POLICY "Public read active counters"
ON public.counters FOR SELECT
USING (is_active = true OR public.fn_is_admin());

-- 3. BOOKINGS POLICIES
CREATE POLICY "Customers can view their own bookings"
ON public.bookings FOR SELECT
USING (
    customer_id = auth.uid()
    OR public.fn_is_admin()
    OR counter_id = public.fn_get_user_counter_id()
);

CREATE POLICY "Booking seats viewable by owner or staff"
ON public.booking_seats FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = booking_id
          AND (b.customer_id = auth.uid() OR public.fn_is_admin() OR b.counter_id = public.fn_get_user_counter_id())
    )
);

-- 4. PAYMENTS POLICIES
CREATE POLICY "Payments visible to booking owner or admin"
ON public.payments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = booking_id
          AND (b.customer_id = auth.uid() OR public.fn_is_admin() OR b.counter_id = public.fn_get_user_counter_id())
    )
);

-- 5. REVIEWS POLICIES
CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
USING (is_approved = true OR customer_id = auth.uid() OR public.fn_is_admin());

CREATE POLICY "Customers can create review for their completed trip"
ON public.reviews FOR INSERT
WITH CHECK (
    customer_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = booking_id AND b.customer_id = auth.uid() AND b.booking_status = 'confirmed'
    )
);

-- 6. CANCELLATION & REFUNDS
CREATE POLICY "Customer can view and insert cancellation requests"
ON public.cancellation_requests FOR ALL
USING (customer_id = auth.uid() OR public.fn_is_admin());

CREATE POLICY "Customer can view refund status"
ON public.refunds FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = booking_id AND (b.customer_id = auth.uid() OR public.fn_is_admin())
    )
);

-- 7. AUDIT LOGS
CREATE POLICY "Super admin only audit logs"
ON public.audit_logs FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);




-- SECTION 4: INITIAL BANGLADESH TRANSPORTATION DATA

-- ==============================================================================
-- 04_sample_bangladesh_data.sql
-- AR Jishan Luxury Smart Bus Service – Realistic Bangladesh Seed Data
-- ==============================================================================

-- 1. Insert Roles
INSERT INTO public.roles (id, name, description) VALUES
('super_admin', 'Super Administrator', 'Complete system authority, finance, database & config access'),
('admin', 'Operations Administrator', 'Fleet, route, counter & pricing operations management'),
('manager', 'Route / Station Manager', 'Daily trip oversight, driver assignment, customer dispute resolution'),
('counter_manager', 'Counter Branch Manager', 'Branch sales audit, counter cash collection, agent supervision'),
('counter_operator', 'Counter Ticketing Agent', 'Physical ticket sales, cash receipting, passenger manifest print'),
('customer', 'Passenger / Customer', 'Online seat reservation, ticket downloads, cancellations & tracking')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Popular Bangladesh Destinations
INSERT INTO public.destinations (id, name_en, name_bn, division, terminal_name, is_popular, display_order, image_url) VALUES
('11111111-1111-1111-1111-111111111101', 'Dhaka', 'ঢাকা', 'Dhaka', 'Gabtoli / Sayedabad / Mohakhali', true, 1, 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111102', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'Dampara / AK Khan Bus Terminal', true, 2, 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111103', 'Cox''s Bazar', 'কক্সবাজার', 'Chattogram', 'Kolatoli / Jhawtala Luxury Bus Stand', true, 3, 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111104', 'Sylhet', 'সিলেট', 'Sylhet', 'Kadamtoli Central Terminal', true, 4, 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111105', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'Shiroil Railway Gate Bus Terminal', true, 5, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111106', 'Khulna', 'খুলনা', 'Khulna', 'Sonadanga Central Bus Terminal', true, 6, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111107', 'Barishal', 'বরিশাল', 'Barishal', 'Nathullabad Central Bus Terminal', true, 7, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111108', 'Rangpur', 'রংপুর', 'Rangpur', 'Modern Mor Terminal', true, 8, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111109', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'Paduar Bazar / Shashangachha', true, 9, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111110', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'Maijdee Supermarket Stand', true, 10, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Luxury Fleet Buses
INSERT INTO public.buses (id, name, registration_number, bus_type, seat_capacity, deck_count, amenities, is_active, thumbnail_url, notes) VALUES
('22222222-2222-2222-2222-222222222201', 'AR Royal Gold Express', 'DHAKA-METRO-BA-14-8921', 'AC Coach', 45, 1, '["Super Air Condition", "Hi-Speed WiFi", "Individual USB Ports", "Mineral Water & Snacks", "Reclining Comfort Seats", "Reading Lamp"]'::jsonb, true, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', 'Flagship luxury single deck coach with air suspension'),
('22222222-2222-2222-2222-222222222202', 'AR Platinum Executive', 'DHAKA-METRO-BA-15-4032', 'Business Class', 32, 1, '["1x2 Business Recliners", "Leg Rests", "Ultra Quiet Cabin", "Live GPS Tracking", "Complimentary Refreshments", "Personal Media Screen"]'::jsonb, true, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', 'Ultra-premium 1x2 seating for business travelers'),
('22222222-2222-2222-2222-222222222203', 'AR Dreamliner Sleeper', 'DHAKA-METRO-BA-16-7788', 'Sleeper Coach', 24, 1, '["Private Sleeper Pods", "Blanket & Pillow", "Individual Privacy Curtains", "USB & Type-C Chargers", "Air Purifier", "Mineral Water"]'::jsonb, true, 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=800&q=80', 'Flat-bed sleeper coach for overnight highway journeys'),
('22222222-2222-2222-2222-222222222204', 'AR Grand Double Decker', 'DHAKA-METRO-BA-17-9900', 'Double Decker', 70, 2, '["Panoramic Top View", "Twin Deck Climate Control", "Onboard Restroom", "Spacious Luggage Bay", "Free WiFi", "CCTV Surveillance"]'::jsonb, true, 'https://images.unsplash.com/photo-1525962898597-a4ae6402826e?auto=format&fit=crop&w=800&q=80', 'Twin-deck luxury touring liner for Dhaka-Chattogram-Cox''s Bazar'),
('22222222-2222-2222-2222-222222222205', 'AR Economy Classic', 'DHAKA-METRO-BA-11-2244', 'Non-AC Coach', 50, 1, '["Generous Leg Space", "Comfortable Seating", "Window Curtains", "Experienced Drivers", "Emergency Medical Kit"]'::jsonb, true, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', 'Affordable comfortable regional highway service')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Physical Counters
INSERT INTO public.counters (id, name, code, district, address, contact_number, opening_hours, latitude, longitude) VALUES
('33333333-3333-3333-3333-333333333301', 'Dhaka Head Counter (Gabtoli)', 'DHK-GBT-01', 'Dhaka', '123 Mirpur Road, Gabtoli Bus Terminal, Dhaka 1216', '+880 1711 234567', '24 Hours', 23.7845, 90.3524),
('33333333-3333-3333-3333-333333333302', 'Dhaka Sayedabad Counter', 'DHK-SYD-02', 'Dhaka', 'Building 4, Sayedabad Inter-district Terminal, Dhaka 1204', '+880 1711 234568', '05:30 AM - 11:59 PM', 23.7149, 90.4262),
('33333333-3333-3333-3333-333333333303', 'Dhaka Mohakhali Counter', 'DHK-MHK-03', 'Dhaka', 'Shop 12, Mohakhali Bus Terminal, Dhaka 1212', '+880 1711 234569', '06:00 AM - 11:30 PM', 23.7776, 90.4039),
('33333333-3333-3333-3333-333333333304', 'Chattogram Dampara Counter', 'CTG-DMP-01', 'Chattogram', '14 CDA Avenue, Dampara, Chattogram 4000', '+880 1819 123456', '06:00 AM - 11:45 PM', 22.3569, 91.8213),
('33333333-3333-3333-3333-333333333305', 'Cox''s Bazar Kolatoli Counter', 'CXB-KLT-01', 'Cox''s Bazar', 'Kolatoli Beach Circle Road, Cox''s Bazar 4700', '+880 1819 654321', '07:00 AM - 11:30 PM', 21.4272, 91.9806),
('33333333-3333-3333-3333-333333333306', 'Sylhet Kadamtoli Counter', 'SYL-KDM-01', 'Sylhet', 'Railway Station Road, Kadamtoli, Sylhet 3100', '+880 1712 987654', '06:30 AM - 11:00 PM', 24.8864, 91.8679),
('33333333-3333-3333-3333-333333333307', 'Rajshahi Shiroil Counter', 'RJH-SHR-01', 'Rajshahi', 'Station Road, Shiroil, Rajshahi 6000', '+880 1713 554433', '06:00 AM - 11:00 PM', 24.3745, 88.6042)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Routes
INSERT INTO public.routes (id, origin_id, destination_id, distance_km, estimated_duration, starting_fare) VALUES
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 248.5, '5h 30m', 850.00), -- Dhaka -> Chattogram
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 395.0, '8h 30m', 1200.00), -- Dhaka -> Cox's Bazar
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111104', 245.0, '5h 45m', 800.00), -- Dhaka -> Sylhet
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111105', 256.0, '5h 15m', 750.00), -- Dhaka -> Rajshahi
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111103', 152.0, '3h 30m', 550.00)  -- Chattogram -> Cox's Bazar
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Scheduled Trips (Current and upcoming dates)
INSERT INTO public.trips (id, trip_number, bus_id, route_id, departure_date, departure_time, arrival_time, base_fare, status) VALUES
('55555555-5555-5555-5555-555555555501', 'ARJ-2026-101', '22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444401', CURRENT_DATE, '07:30:00', '13:00:00', 950.00, 'scheduled'),
('55555555-5555-5555-5555-555555555502', 'ARJ-2026-102', '22222222-2222-2222-2222-222222222202', '44444444-4444-4444-4444-444444444402', CURRENT_DATE, '08:00:00', '16:30:00', 1600.00, 'scheduled'),
('55555555-5555-5555-5555-555555555503', 'ARJ-2026-103', '22222222-2222-2222-2222-222222222203', '44444444-4444-4444-4444-444444444402', CURRENT_DATE, '22:30:00', '07:00:00', 2200.00, 'scheduled'),
('55555555-5555-5555-5555-555555555504', 'ARJ-2026-104', '22222222-2222-2222-2222-222222222204', '44444444-4444-4444-4444-444444444401', CURRENT_DATE + 1, '09:00:00', '14:30:00', 1250.00, 'scheduled'),
('55555555-5555-5555-5555-555555555505', 'ARJ-2026-105', '22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444403', CURRENT_DATE + 1, '08:30:00', '14:15:00', 900.00, 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Boarding / Dropping Stops for Trips
INSERT INTO public.trip_stops (trip_id, stop_name, stop_type, scheduled_time, fare_adjustment) VALUES
('55555555-5555-5555-5555-555555555501', 'Gabtoli Head Counter, Dhaka', 'boarding', '07:30:00', 0.00),
('55555555-5555-5555-5555-555555555501', 'Sayedabad Terminal, Dhaka', 'boarding', '08:15:00', 0.00),
('55555555-5555-5555-5555-555555555501', 'Kanchpur Bridge, Narayanganj', 'boarding', '08:45:00', 0.00),
('55555555-5555-5555-5555-555555555501', 'AK Khan Gate, Chattogram', 'dropping', '12:45:00', 0.00),
('55555555-5555-5555-5555-555555555501', 'Dampara Central Counter, Chattogram', 'dropping', '13:00:00', 0.00)
ON CONFLICT DO NOTHING;

-- 8. Insert Promotional Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, max_discount_amount, min_booking_amount, valid_from, valid_until, usage_limit, is_active) VALUES
('GOLDEN2026', 'percentage', 10.00, 300.00, 1000.00, CURRENT_DATE - 10, CURRENT_DATE + 180, 500, true),
('EIDSPECIAL', 'fixed', 150.00, 150.00, 1200.00, CURRENT_DATE - 5, CURRENT_DATE + 90, 1000, true),
('FIRSTTRIP', 'percentage', 15.00, 250.00, 800.00, CURRENT_DATE - 30, CURRENT_DATE + 365, 2000, true)
ON CONFLICT (code) DO NOTHING;

-- 9. Insert Verified Customer Reviews
INSERT INTO public.reviews (booking_id, customer_id, customer_name, rating, review_text, route_name, journey_date, is_verified, is_approved) VALUES
('66666666-6666-6666-6666-666666666601', '11111111-0000-0000-0000-000000000001', 'Rahim Ahmed', 5, 'The Scania Business Class coach is undeniably the smoothest bus journey in Bangladesh. On-time departure and very clean cabin.', 'Dhaka to Cox''s Bazar', CURRENT_DATE - 4, true, true),
('66666666-6666-6666-6666-666666666602', '11111111-0000-0000-0000-000000000002', 'Fatima Zohra', 5, 'Traveled with my family on the Sleeper coach. The private curtains and warm blankets made us feel like a luxury hotel room on wheels.', 'Dhaka to Chattogram', CURRENT_DATE - 7, true, true),
('66666666-6666-6666-6666-666666666603', '11111111-0000-0000-0000-000000000003', 'Tariqul Islam', 4, 'Very comfortable seats, driver drove very safely maintaining 80 km/h speed limit. The bKash payment was instant.', 'Dhaka to Sylhet', CURRENT_DATE - 12, true, true)
ON CONFLICT DO NOTHING;

-- 10. Insert Company Settings
INSERT INTO public.company_settings (id, company_name, slogan, address, contact_phone, contact_email, cancellation_deadline_hours, cancellation_fee_percentage)
VALUES (
    'primary',
    'AR Jishan Luxury Smart Bus Service',
    'Safe Journey • Better Tomorrow',
    '123, Mirpur Road, Dhaka 1216, Bangladesh',
    '+880 1711 234567',
    'support@arjishanbus.com',
    12,
    15.00
) ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    slogan = EXCLUDED.slogan;
