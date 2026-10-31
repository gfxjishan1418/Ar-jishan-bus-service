import { NextRequest, NextResponse } from 'next/server';
import { bkashAdapter } from '@/lib/payments/bkash';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get('paymentID');
  const status = searchParams.get('status');

  if (status !== 'success' || !paymentID) {
    return NextResponse.redirect(
      new URL('/booking/failed?reason=' + encodeURIComponent(status || 'cancelled'), req.url)
    );
  }

  try {
    const executed = await bkashAdapter.executePayment(paymentID);
    return NextResponse.redirect(
      new URL(`/booking/confirmation/${executed.trxID}?payment=success`, req.url)
    );
  } catch (err: any) {
    return NextResponse.redirect(
      new URL('/booking/failed?reason=' + encodeURIComponent(err.message), req.url)
    );
  }
}
