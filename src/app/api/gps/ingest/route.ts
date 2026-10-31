import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_GPS_LOCATIONS } from '@/lib/data/mock-db';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    // Validate driver / hardware token
    if (!authHeader && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized GPS device beacon' }, { status: 401 });
    }

    const body = await req.json();
    const { bus_number, latitude, longitude, speed_kmh, heading, landmark, next_stop } = body;

    if (!bus_number || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing mandatory telemetry fields (bus_number, latitude, longitude)' },
        { status: 400 }
      );
    }

    // Update in-memory telemetry or database
    INITIAL_GPS_LOCATIONS[bus_number] = {
      id: 'gps-' + Date.now(),
      bus_id: 'bus-active',
      bus_number,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      speed_kmh: parseFloat(speed_kmh || 0),
      heading: parseFloat(heading || 0),
      current_landmark: landmark || 'Highway Marker (National Highway)',
      next_stop: next_stop || 'Next Terminal',
      estimated_arrival: 'En Route',
      recorded_at: new Date().toISOString(),
      is_online: true,
    };

    return NextResponse.json({
      success: true,
      message: 'Telemetry coordinates successfully recorded',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
