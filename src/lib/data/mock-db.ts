import { Destination, Bus, Route, Counter, Trip, Booking, CustomerReview, PromoCoupon, GPSLocation, CompanySettings, SeatLock } from '../types/database';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name_en: 'Dhaka',
    name_bn: 'ঢাকা',
    division: 'Dhaka',
    terminal_name: 'Gabtoli / Sayedabad / Mohakhali',
    is_popular: true,
    display_order: 1,
    image_url: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name_en: 'Chattogram',
    name_bn: 'চট্টগ্রাম',
    division: 'Chattogram',
    terminal_name: 'Dampara / AK Khan Bus Terminal',
    is_popular: true,
    display_order: 2,
    image_url: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name_en: "Cox's Bazar",
    name_bn: 'কক্সবাজার',
    division: 'Chattogram',
    terminal_name: 'Kolatoli / Jhawtala Luxury Stand',
    is_popular: true,
    display_order: 3,
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name_en: 'Sylhet',
    name_bn: 'সিলেট',
    division: 'Sylhet',
    terminal_name: 'Kadamtoli Central Terminal',
    is_popular: true,
    display_order: 4,
    image_url: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name_en: 'Rajshahi',
    name_bn: 'রাজশাহী',
    division: 'Rajshahi',
    terminal_name: 'Shiroil Station Terminal',
    is_popular: true,
    display_order: 5,
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name_en: 'Khulna',
    name_bn: 'খুলনা',
    division: 'Khulna',
    terminal_name: 'Sonadanga Central Terminal',
    is_popular: true,
    display_order: 6,
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    name_en: 'Barishal',
    name_bn: 'বরিশাল',
    division: 'Barishal',
    terminal_name: 'Nathullabad Central Terminal',
    is_popular: true,
    display_order: 7,
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    name_en: 'Rangpur',
    name_bn: 'রংপুর',
    division: 'Rangpur',
    terminal_name: 'Modern Mor Terminal',
    is_popular: true,
    display_order: 8,
    image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111109',
    name_en: 'Cumilla',
    name_bn: 'কুমিল্লা',
    division: 'Chattogram',
    terminal_name: 'Paduar Bazar / Shashangachha',
    is_popular: true,
    display_order: 9,
    image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11111111-1111-1111-1111-111111111110',
    name_en: 'Noakhali',
    name_bn: 'নোয়াখালী',
    division: 'Chattogram',
    terminal_name: 'Maijdee Supermarket Stand',
    is_popular: true,
    display_order: 10,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_BUSES: Bus[] = [
  {
    id: 'bus-1',
    name: 'AR Royal Gold Express',
    registration_number: 'DHAKA-METRO-BA-14-8921',
    bus_type: 'AC Coach',
    seat_capacity: 45,
    deck_count: 1,
    amenities: ['Super Air Condition', 'Hi-Speed WiFi', 'Individual USB Ports', 'Mineral Water & Snacks', 'Reclining Comfort Seats'],
    is_active: true,
    thumbnail_url: '/images/fleet/ac-coach.jpg',
    notes: 'Flagship single deck coach with air suspension',
  },
  {
    id: 'bus-2',
    name: 'AR Platinum Executive',
    registration_number: 'DHAKA-METRO-BA-15-4032',
    bus_type: 'Business Class',
    seat_capacity: 32,
    deck_count: 1,
    amenities: ['1x2 Business Recliners', 'Leg Rests', 'Ultra Quiet Cabin', 'Live GPS Tracking', 'Complimentary Refreshments'],
    is_active: true,
    thumbnail_url: '/images/fleet/business-class.jpg',
    notes: 'Ultra-premium 1x2 seating for business travelers',
  },
  {
    id: 'bus-3',
    name: 'AR Dreamliner Sleeper',
    registration_number: 'DHAKA-METRO-BA-16-7788',
    bus_type: 'Sleeper Coach',
    seat_capacity: 24,
    deck_count: 1,
    amenities: ['Private Sleeper Pods', 'Blanket & Pillow', 'Individual Privacy Curtains', 'USB & Type-C Chargers', 'Air Purifier'],
    is_active: true,
    thumbnail_url: '/images/fleet/sleeper-coach.jpg',
    notes: 'Flat-bed sleeper coach for overnight highway journeys',
  },
  {
    id: 'bus-4',
    name: 'AR Grand Double Decker',
    registration_number: 'DHAKA-METRO-BA-17-9900',
    bus_type: 'Double Decker',
    seat_capacity: 70,
    deck_count: 2,
    amenities: ['Panoramic Top View', 'Twin Deck Climate Control', 'Onboard Restroom', 'Spacious Luggage Bay', 'Free WiFi'],
    is_active: true,
    thumbnail_url: '/images/fleet/double-decker.jpg',
    notes: 'Twin-deck luxury touring liner for Dhaka-Chattogram-Cox’s Bazar',
  },
  {
    id: 'bus-5',
    name: 'AR Economy Classic',
    registration_number: 'DHAKA-METRO-BA-11-2244',
    bus_type: 'Non-AC Coach',
    seat_capacity: 50,
    deck_count: 1,
    amenities: ['Generous Leg Space', 'Comfortable Seating', 'Window Curtains', 'Experienced Drivers'],
    is_active: true,
    thumbnail_url: '/images/fleet/non-ac.jpg',
    notes: 'Affordable comfortable regional highway service',
  },
];

export const INITIAL_ROUTES: Route[] = [
  {
    id: 'route-1',
    origin_id: '11111111-1111-1111-1111-111111111101',
    destination_id: '11111111-1111-1111-1111-111111111102',
    origin: INITIAL_DESTINATIONS[0],
    destination: INITIAL_DESTINATIONS[1],
    distance_km: 248.5,
    estimated_duration: '5h 30m',
    starting_fare: 850,
    is_active: true,
  },
  {
    id: 'route-2',
    origin_id: '11111111-1111-1111-1111-111111111101',
    destination_id: '11111111-1111-1111-1111-111111111103',
    origin: INITIAL_DESTINATIONS[0],
    destination: INITIAL_DESTINATIONS[2],
    distance_km: 395.0,
    estimated_duration: '8h 30m',
    starting_fare: 1200,
    is_active: true,
  },
  {
    id: 'route-3',
    origin_id: '11111111-1111-1111-1111-111111111101',
    destination_id: '11111111-1111-1111-1111-111111111104',
    origin: INITIAL_DESTINATIONS[0],
    destination: INITIAL_DESTINATIONS[3],
    distance_km: 245.0,
    estimated_duration: '5h 45m',
    starting_fare: 800,
    is_active: true,
  },
  {
    id: 'route-4',
    origin_id: '11111111-1111-1111-1111-111111111101',
    destination_id: '11111111-1111-1111-1111-111111111105',
    origin: INITIAL_DESTINATIONS[0],
    destination: INITIAL_DESTINATIONS[4],
    distance_km: 256.0,
    estimated_duration: '5h 15m',
    starting_fare: 750,
    is_active: true,
  },
];

export const INITIAL_COUNTERS: Counter[] = [
  {
    id: 'counter-1',
    name: 'Dhaka Head Counter (Gabtoli)',
    code: 'DHK-GBT-01',
    district: 'Dhaka',
    address: '123 Mirpur Road, Gabtoli Bus Terminal, Dhaka 1216',
    contact_number: '+880 1711 234567',
    opening_hours: '24 Hours',
    latitude: 23.7845,
    longitude: 90.3524,
    is_active: true,
  },
  {
    id: 'counter-2',
    name: 'Dhaka Sayedabad Counter',
    code: 'DHK-SYD-02',
    district: 'Dhaka',
    address: 'Building 4, Sayedabad Inter-district Terminal, Dhaka 1204',
    contact_number: '+880 1711 234568',
    opening_hours: '05:30 AM - 11:59 PM',
    latitude: 23.7149,
    longitude: 90.4262,
    is_active: true,
  },
  {
    id: 'counter-3',
    name: 'Chattogram Dampara Counter',
    code: 'CTG-DMP-01',
    district: 'Chattogram',
    address: '14 CDA Avenue, Dampara, Chattogram 4000',
    contact_number: '+880 1819 123456',
    opening_hours: '06:00 AM - 11:45 PM',
    latitude: 22.3569,
    longitude: 91.8213,
    is_active: true,
  },
  {
    id: 'counter-4',
    name: "Cox's Bazar Kolatoli Counter",
    code: 'CXB-KLT-01',
    district: "Cox's Bazar",
    address: "Kolatoli Beach Circle Road, Cox's Bazar 4700",
    contact_number: '+880 1819 654321',
    opening_hours: '07:00 AM - 11:30 PM',
    latitude: 21.4272,
    longitude: 91.9806,
    is_active: true,
  },
  {
    id: 'counter-5',
    name: 'Sylhet Kadamtoli Counter',
    code: 'SYL-KDM-01',
    district: 'Sylhet',
    address: 'Railway Station Road, Kadamtoli, Sylhet 3100',
    contact_number: '+880 1712 987654',
    opening_hours: '06:30 AM - 11:00 PM',
    latitude: 24.8864,
    longitude: 91.8679,
    is_active: true,
  },
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-101',
    trip_number: 'ARJ-2026-101',
    bus_id: 'bus-1',
    route_id: 'route-1',
    bus: INITIAL_BUSES[0],
    route: INITIAL_ROUTES[0],
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '07:30 AM',
    arrival_time: '01:00 PM',
    base_fare: 950,
    status: 'scheduled',
    available_seats_count: 36,
    boarding_points: ['Gabtoli Terminal (07:30 AM)', 'Sayedabad Terminal (08:15 AM)', 'Kanchpur (08:45 AM)'],
    dropping_points: ['AK Khan Gate (12:45 PM)', 'Dampara Central Lounge (01:00 PM)'],
  },
  {
    id: 'trip-102',
    trip_number: 'ARJ-2026-102',
    bus_id: 'bus-2',
    route_id: 'route-2',
    bus: INITIAL_BUSES[1],
    route: INITIAL_ROUTES[1],
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '08:00 AM',
    arrival_time: '04:30 PM',
    base_fare: 1600,
    status: 'scheduled',
    available_seats_count: 24,
    boarding_points: ['Gabtoli Terminal (08:00 AM)', 'Sayedabad (08:45 AM)'],
    dropping_points: ['Kolatoli Beach Circle (04:30 PM)', 'Jhawtala Lounge (04:45 PM)'],
  },
  {
    id: 'trip-103',
    trip_number: 'ARJ-2026-103',
    bus_id: 'bus-3',
    route_id: 'route-2',
    bus: INITIAL_BUSES[2],
    route: INITIAL_ROUTES[1],
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '10:30 PM',
    arrival_time: '07:00 AM',
    base_fare: 2200,
    status: 'scheduled',
    available_seats_count: 18,
    boarding_points: ['Sayedabad Terminal (10:30 PM)', 'Arambagh (10:50 PM)'],
    dropping_points: ['Kolatoli Stand (07:00 AM)'],
  },
  {
    id: 'trip-104',
    trip_number: 'ARJ-2026-104',
    bus_id: 'bus-4',
    route_id: 'route-1',
    bus: INITIAL_BUSES[3],
    route: INITIAL_ROUTES[0],
    departure_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departure_time: '09:00 AM',
    arrival_time: '02:30 PM',
    base_fare: 1250,
    status: 'scheduled',
    available_seats_count: 58,
    boarding_points: ['Gabtoli (09:00 AM)', 'Mohakhali (09:30 AM)'],
    dropping_points: ['Dampara Lounge (02:30 PM)'],
  },
  {
    id: 'trip-105',
    trip_number: 'ARJ-2026-105',
    bus_id: 'bus-1',
    route_id: 'route-3',
    bus: INITIAL_BUSES[0],
    route: INITIAL_ROUTES[2],
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '08:30 AM',
    arrival_time: '02:15 PM',
    base_fare: 900,
    status: 'scheduled',
    available_seats_count: 32,
    boarding_points: ['Mohakhali (08:30 AM)', 'Uttara (09:00 AM)'],
    dropping_points: ['Kadamtoli Central Lounge (02:15 PM)'],
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    booking_id: 'bkg-1',
    customer_id: 'cust-1',
    customer_name: 'Rahim Ahmed',
    rating: 5,
    review_text: 'The Scania Business Class coach is undeniably the smoothest bus journey in Bangladesh. On-time departure and very clean cabin.',
    route_name: "Dhaka to Cox's Bazar",
    journey_date: '2026-10-25',
    is_verified: true,
    is_approved: true,
    created_at: '2026-10-26T10:00:00Z',
  },
  {
    id: 'rev-2',
    booking_id: 'bkg-2',
    customer_id: 'cust-2',
    customer_name: 'Fatima Zohra',
    rating: 5,
    review_text: 'Traveled with my family on the Sleeper coach. The private curtains and warm blankets made us feel like a luxury hotel room on wheels.',
    route_name: 'Dhaka to Chattogram',
    journey_date: '2026-10-22',
    is_verified: true,
    is_approved: true,
    created_at: '2026-10-23T14:30:00Z',
  },
  {
    id: 'rev-3',
    booking_id: 'bkg-3',
    customer_id: 'cust-3',
    customer_name: 'Tariqul Islam',
    rating: 4,
    review_text: 'Very comfortable seats, driver drove very safely maintaining 80 km/h speed limit. The bKash payment was instant.',
    route_name: 'Dhaka to Sylhet',
    journey_date: '2026-10-18',
    is_verified: true,
    is_approved: true,
    created_at: '2026-10-19T09:15:00Z',
  },
];

export const INITIAL_COUPONS: PromoCoupon[] = [
  {
    id: 'cpn-1',
    code: 'GOLDEN2026',
    discount_type: 'percentage',
    discount_value: 10,
    max_discount_amount: 300,
    min_booking_amount: 1000,
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
    usage_limit: 500,
    times_used: 42,
    is_active: true,
  },
  {
    id: 'cpn-2',
    code: 'FIRSTTRIP',
    discount_type: 'fixed',
    discount_value: 150,
    min_booking_amount: 800,
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
    usage_limit: 1000,
    times_used: 119,
    is_active: true,
  },
];

export const INITIAL_GPS_LOCATIONS: Record<string, GPSLocation> = {
  'DHAKA-METRO-BA-14-8921': {
    id: 'gps-1',
    bus_id: 'bus-1',
    bus_number: 'DHAKA-METRO-BA-14-8921',
    latitude: 23.0186,
    longitude: 91.3966,
    speed_kmh: 76.4,
    heading: 142.5,
    current_landmark: 'Feni Highway, Feni Bypass',
    next_stop: 'AK Khan Gate, Chattogram',
    estimated_arrival: '12:45 PM',
    recorded_at: new Date().toISOString(),
    is_online: true,
  },
  'DHAKA-METRO-BA-15-4032': {
    id: 'gps-2',
    bus_id: 'bus-2',
    bus_number: 'DHAKA-METRO-BA-15-4032',
    latitude: 22.3569,
    longitude: 91.8213,
    speed_kmh: 0.0,
    heading: 0,
    current_landmark: 'Dampara Station Lounge, Chattogram',
    next_stop: 'Chakaria Bypass',
    estimated_arrival: '02:15 PM',
    recorded_at: new Date(Date.now() - 300000).toISOString(),
    is_online: true,
  },
  'AR-8921X': {
    id: 'gps-pnr-1',
    bus_id: 'bus-1',
    bus_number: 'DHAKA-METRO-BA-14-8921',
    latitude: 23.0186,
    longitude: 91.3966,
    speed_kmh: 76.4,
    heading: 142.5,
    current_landmark: 'Feni Highway, Feni Bypass',
    next_stop: 'AK Khan Gate, Chattogram',
    estimated_arrival: '12:45 PM',
    recorded_at: new Date().toISOString(),
    is_online: true,
  },
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    booking_id: 'ARJ-20261028-49210',
    pnr: 'AR8921X',
    trip_id: 'trip-101',
    trip: INITIAL_TRIPS[0],
    customer_id: 'cust-1',
    customer_name: 'Rahim Ahmed',
    customer_email: 'rahim@example.com',
    customer_phone: '01711998877',
    boarding_point: 'Gabtoli Terminal (07:30 AM)',
    dropping_point: 'Dampara Central Lounge (01:00 PM)',
    total_seats: 2,
    subtotal_fare: 1900,
    service_charge: 50,
    discount_amount: 190,
    total_amount: 1760,
    booking_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'bkash',
    booking_channel: 'online',
    qr_code_data: 'VERIFY:AR8921X:ARJ-20261028-49210',
    seats: [
      { seat_number: 'A1', passenger_name: 'Rahim Ahmed', gender: 'male', fare: 950 },
      { seat_number: 'A2', passenger_name: 'Nusrat Jahan', gender: 'female', fare: 950 },
    ],
    created_at: '2026-10-28T08:30:00Z',
  },
  {
    id: 'bkg-102',
    booking_id: 'ARJ-20261029-71024',
    pnr: 'AR7102Y',
    trip_id: 'trip-102',
    trip: INITIAL_TRIPS[1],
    customer_id: 'cust-1',
    customer_name: 'Rahim Ahmed',
    customer_email: 'rahim@example.com',
    customer_phone: '01711998877',
    boarding_point: 'Sayedabad (08:45 AM)',
    dropping_point: 'Kolatoli Beach Circle (04:30 PM)',
    total_seats: 1,
    subtotal_fare: 1600,
    service_charge: 50,
    discount_amount: 0,
    total_amount: 1650,
    booking_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'nagad',
    booking_channel: 'online',
    qr_code_data: 'VERIFY:AR7102Y:ARJ-20261029-71024',
    seats: [
      { seat_number: 'B1', passenger_name: 'Rahim Ahmed', gender: 'male', fare: 1600 },
    ],
    created_at: '2026-10-29T11:15:00Z',
  },
];

export const COMPANY_SETTINGS: CompanySettings = {
  id: 'primary',
  company_name: 'AR Jishan Luxury Smart Bus Service',
  slogan: 'Safe Journey • Better Tomorrow',
  address: '123, Mirpur Road, Dhaka 1216, Bangladesh',
  contact_phone: '+880 1711 234567',
  contact_email: 'support@arjishanbus.com',
  cancellation_deadline_hours: 12,
  cancellation_fee_percentage: 15,
  currency: 'BDT',
  timezone: 'Asia/Dhaka',
};

// In-Memory state store for live interactions in mock/offline mode
let activeLocks: SeatLock[] = [];
let bookingsStore: Booking[] = [...INITIAL_BOOKINGS];

export function cleanupExpiredLocks() {
  const now = new Date().toISOString();
  activeLocks = activeLocks.filter((l) => l.expires_at > now);
}

export function acquireSeatLocks(
  tripId: string,
  seatNumbers: string[],
  sessionId: string,
  userId?: string,
  ttlSeconds = 600
): { success: boolean; conflict_seat?: string; error?: string } {
  cleanupExpiredLocks();

  // Check if any seat is already booked in confirmed bookings
  for (const b of bookingsStore) {
    if (b.trip_id === tripId && b.booking_status === 'confirmed') {
      for (const seat of b.seats) {
        if (seatNumbers.includes(seat.seat_number)) {
          return {
            success: false,
            conflict_seat: seat.seat_number,
            error: `Seat ${seat.seat_number} is already booked.`,
          };
        }
      }
    }
  }

  // Check if locked by another session
  const now = new Date().toISOString();
  for (const lock of activeLocks) {
    if (lock.trip_id === tripId && seatNumbers.includes(lock.seat_number) && lock.session_id !== sessionId) {
      return {
        success: false,
        conflict_seat: lock.seat_number,
        error: `Seat ${lock.seat_number} is currently held by another customer.`,
      };
    }
  }

  // Add / refresh locks
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  activeLocks = activeLocks.filter(
    (l) => !(l.trip_id === tripId && seatNumbers.includes(l.seat_number))
  );

  for (const seat of seatNumbers) {
    activeLocks.push({
      id: 'lock-' + Math.random().toString(36).substring(2, 9),
      trip_id: tripId,
      seat_number: seat,
      session_id: sessionId,
      user_id: userId,
      locked_at: now,
      expires_at: expiresAt,
    });
  }

  return { success: true };
}

export function releaseSeatLocks(tripId: string, seatNumbers: string[], sessionId: string) {
  activeLocks = activeLocks.filter(
    (l) => !(l.trip_id === tripId && seatNumbers.includes(l.seat_number) && l.session_id === sessionId)
  );
}

export function getBookedAndLockedSeats(tripId: string, currentSessionId: string): { booked: string[]; locked: string[] } {
  cleanupExpiredLocks();
  const booked: string[] = [];
  const locked: string[] = [];

  for (const b of bookingsStore) {
    if (b.trip_id === tripId && b.booking_status === 'confirmed') {
      for (const s of b.seats) {
        booked.push(s.seat_number);
      }
    }
  }

  for (const l of activeLocks) {
    if (l.trip_id === tripId && l.session_id !== currentSessionId) {
      locked.push(l.seat_number);
    }
  }

  return { booked, locked };
}

export function confirmBookingRecord(newBooking: Booking): Booking {
  // Clear any locks for these seats
  activeLocks = activeLocks.filter(
    (l) => !(l.trip_id === newBooking.trip_id && newBooking.seats.some((s) => s.seat_number === l.seat_number))
  );
  bookingsStore.unshift(newBooking);
  return newBooking;
}

export function getAllBookings(): Booking[] {
  return bookingsStore;
}

export function getBookingByPNR(pnrOrId: string): Booking | undefined {
  const query = pnrOrId.trim().toUpperCase();
  return bookingsStore.find(
    (b) => b.pnr.toUpperCase() === query || b.booking_id.toUpperCase() === query
  );
}
