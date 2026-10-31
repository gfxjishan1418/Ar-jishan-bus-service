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
