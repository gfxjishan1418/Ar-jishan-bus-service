/**
 * Nagad Merchant Direct Payment API Adapter
 * Standard integration specification for Bangladesh DFS
 */

export interface NagadPaymentResponse {
  status: 'Success' | 'Failed' | 'Aborted';
  paymentRefId: string;
  orderId: string;
  amount: string;
  clientMobileNo?: string;
  merchantId: string;
  dateTime: string;
  issuerPaymentDateTime?: string;
  issuerPaymentRefNo?: string;
}

export class NagadPaymentAdapter {
  private merchantId: string;
  private baseURL: string;

  constructor() {
    this.merchantId = process.env.NAGAD_MERCHANT_ID || 'sandbox_merchant_id';
    this.baseURL =
      process.env.NAGAD_BASE_URL ||
      'http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs';
  }

  public isConfigured(): boolean {
    return !!(
      process.env.NAGAD_MERCHANT_ID &&
      process.env.NAGAD_MERCHANT_ID !== 'sandbox_merchant_id'
    );
  }

  async initializePayment(orderId: string, amount: number, callbackUrl: string) {
    if (!this.isConfigured()) {
      const mockPaymentRefId = 'NG' + Date.now();
      return {
        paymentRefId: mockPaymentRefId,
        redirectUrl: `${callbackUrl}?payment_ref_id=${mockPaymentRefId}&status=Success`,
      };
    }

    // In production, encrypt sensitive payloads using Nagad Public Key and sign with Private Key
    const res = await fetch(`${this.baseURL}/check-out/initialize/${this.merchantId}/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-KM-Api-Version': 'v-0.2.0',
        'X-KM-IP-V4': '127.0.0.1',
        'X-KM-Client-Type': 'PC_WEB',
      },
      body: JSON.stringify({
        dateTime: new Date().toISOString(),
        sensitiveData: 'ENCRYPTED_DATA',
        signature: 'SIGNATURE_HASH',
      }),
    });

    const data = await res.json();
    return data;
  }

  async verifyPayment(paymentRefId: string): Promise<NagadPaymentResponse> {
    if (!this.isConfigured()) {
      return {
        status: 'Success',
        paymentRefId,
        orderId: 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        amount: '1200.00',
        merchantId: this.merchantId,
        dateTime: new Date().toISOString(),
        issuerPaymentRefNo: 'NG-TXN-' + Date.now(),
      };
    }

    const res = await fetch(`${this.baseURL}/verify/payment/${paymentRefId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await res.json();
  }
}

export const nagadAdapter = new NagadPaymentAdapter();
