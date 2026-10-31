import { NextRequest, NextResponse } from 'next/server';
import { acquireSeatLocks, releaseSeatLocks } from '@/lib/data/mock-db';

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
      releaseSeatLocks(tripId, seatNumbers, sessionId);
      return NextResponse.json({ success: true });
    }

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
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
