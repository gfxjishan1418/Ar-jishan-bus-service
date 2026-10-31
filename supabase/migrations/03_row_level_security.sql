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
