// Database entity definitions matching 30 Supabase tables

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'counter_manager' | 'counter_operator' | 'customer';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  avatar_url?: string | null;
  address?: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Destination {
  id: string;
  name_en: string;
  name_bn: string;
  division: string;
  terminal_name?: string;
  is_popular: boolean;
  image_url: string;
  display_order: number;
}

export type BusType = 'AC Coach' | 'Non-AC Coach' | 'Business Class' | 'Sleeper Coach' | 'Double Decker';

export interface Bus {
  id: string;
  name: string;
  registration_number: string;
  bus_type: BusType;
  seat_capacity: number;
  deck_count: number;
  amenities: string[];
  is_active: boolean;
  thumbnail_url: string;
  notes?: string;
}

export type SeatClass = 'standard' | 'vip' | 'sleeper_lower' | 'sleeper_upper';
export type SeatStatus = 'available' | 'selected' | 'booked' | 'locked' | 'reserved' | 'unavailable';

export interface BusSeat {
  id: string;
  bus_id: string;
  seat_number: string;
  deck: number;
  row_number: number;
  column_number: number;
  seat_class: SeatClass;
  is_restricted_female: boolean;
  is_active: boolean;
}

export interface Route {
  id: string;
  origin_id: string;
  destination_id: string;
  origin?: Destination;
  destination?: Destination;
  distance_km: number;
  estimated_duration: string;
  starting_fare: number;
  is_active: boolean;
}

export interface Counter {
  id: string;
  name: string;
  code: string;
  district: string;
  address: string;
  contact_number: string;
  opening_hours: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

export interface CounterStaff {
  id: string;
  counter_id: string;
  user_id: string;
  staff_role: 'counter_manager' | 'counter_operator';
  is_active: boolean;
  assigned_at: string;
  counter?: Counter;
  profile?: Profile;
}

export type TripStatus = 'scheduled' | 'boarding' | 'in_transit' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  trip_number: string;
  bus_id: string;
  route_id: string;
  bus?: Bus;
  route?: Route;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  base_fare: number;
  status: TripStatus;
  available_seats_count?: number;
  boarding_points: string[];
  dropping_points: string[];
}

export interface SeatLock {
  id: string;
  trip_id: string;
  seat_number: string;
  session_id: string;
  user_id?: string;
  locked_at: string;
  expires_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'partially_cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'bkash' | 'nagad' | 'bank_transfer' | 'cash' | 'card' | 'bank';

export interface BookingPassenger {
  seat_number: string;
  passenger_name: string;
  gender: 'male' | 'female' | 'other' | 'unspecified';
  fare: number;
  contact_number?: string;
}

export interface Booking {
  id: string;
  booking_id: string;
  pnr: string;
  trip_id: string;
  trip?: Trip;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  boarding_point: string;
  dropping_point: string;
  total_seats: number;
  subtotal_fare: number;
  service_charge: number;
  discount_amount: number;
  total_amount: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  booking_channel: 'online' | 'counter' | 'app';
  counter_id?: string;
  qr_code_data?: string;
  seats: BookingPassenger[];
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  booking_id: string;
  payment_method: PaymentMethod;
  transaction_id: string;
  amount: number;
  payment_status: PaymentStatus;
  provider_reference?: string;
  bank_name?: string;
  bank_slip_url?: string;
  created_at: string;
}

export interface RefundRecord {
  id: string;
  booking_id: string;
  cancellation_request_id?: string;
  refund_amount: number;
  cancellation_fee: number;
  refund_method: PaymentMethod;
  refund_transaction_id?: string;
  refund_status: 'pending' | 'approved' | 'processed' | 'rejected';
  remarks?: string;
  created_at: string;
}

export interface CancellationRequest {
  id: string;
  booking_id: string;
  customer_id?: string;
  customer_name?: string;
  seats_to_cancel: string[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_refund_amount: number;
  cancellation_fee: number;
  admin_notes?: string;
  created_at: string;
}

export interface CustomerReview {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  route_name: string;
  journey_date: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface PromoCoupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount?: number;
  min_booking_amount: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  times_used: number;
  is_active: boolean;
}

export interface GPSLocation {
  id: string;
  bus_id: string;
  bus_number: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  heading: number;
  current_landmark: string;
  next_stop: string;
  estimated_arrival: string;
  recorded_at: string;
  is_online: boolean;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  slogan: string;
  logo_url?: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  cancellation_deadline_hours: number;
  cancellation_fee_percentage: number;
  currency: string;
  timezone: string;
}
