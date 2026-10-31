import { NextRequest, NextResponse } from 'next/server';
import { bkashAdapter } from '@/lib/payments/bkash';

export async function POST(req: NextRequest) {
  try {
    const { amount, invoiceNumber, callbackURL, payerReference } = await req.json();

    if (!amount || !invoiceNumber) {
      return NextResponse.json({ error: 'Missing amount or invoiceNumber' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const finalCallback = callbackURL || `${appUrl}/api/payments/bkash/callback`;

    const paymentRes = await bkashAdapter.createPayment({
      amount: parseFloat(amount),
      invoiceNumber,
      callbackURL: finalCallback,
      payerReference,
    });

    return NextResponse.json(paymentRes);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
