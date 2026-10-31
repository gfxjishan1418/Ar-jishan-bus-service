import { NextRequest, NextResponse } from 'next/server';
import { acquireSeatLocks, releaseSeatLocks } from '@/lib/data/mock-db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tripId, seatNumbers, sessionId, userId, action } = body;

    if (!tripId || !seatNumbers || !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Missing tripId, seatNumbers or sessionId' },
        { status: 400 }
      );
    }

    if (action === 'release') {
      if (isSupabaseConfigured()) {
        try {
          await supabase
            .from('seat_locks')
            .delete()
            .match({ trip_id: tripId, session_id: sessionId });
        } catch (_) {}
      }
      releaseSeatLocks(tripId, seatNumbers, sessionId);
      return NextResponse.json({ success: true });
    }

    // If Supabase is active, execute atomic PostgreSQL RPC
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('lock_seats_atomic', {
          p_trip_id: tripId,
          p_seat_numbers: seatNumbers,
          p_session_id: sessionId,
          p_user_id: userId || null,
          p_lock_duration_seconds: 600,
        });

        if (error) {
          return NextResponse.json(
            { success: false, message: error.message },
            { status: 409 }
          );
        }

        return NextResponse.json({
          success: true,
          locked_seats: seatNumbers,
          ttl_seconds: 600,
          database: 'supabase_live',
        });
      } catch (err: any) {
        // Fallback to in-memory lock if network fails
        console.warn('Supabase lock error, falling back to local lock engine:', err.message);
      }
    }

    // Standalone / fallback in-memory lock engine
    const result = acquireSeatLocks(tripId, seatNumbers, sessionId, userId, 600);
    if (!result.success) {
      return NextResponse.json(
        { success: false, conflict_seat: result.conflict_seat, message: result.error },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      locked_seats: seatNumbers,
      ttl_seconds: 600,
      database: 'local_memory',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
