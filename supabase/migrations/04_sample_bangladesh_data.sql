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
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 248.5, '5h 30m', 850.00),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 395.0, '8h 30m', 1200.00),
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111104', 245.0, '5h 45m', 800.00),
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111105', 256.0, '5h 15m', 750.00),
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111103', 152.0, '3h 30m', 550.00)
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
