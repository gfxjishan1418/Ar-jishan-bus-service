/**
 * bKash Merchant Tokenized Checkout API Adapter (v1.2.0-beta)
 * Production & Sandbox adapter for Bangladesh MFS payment
 */

export interface BkashCreatePaymentResponse {
  paymentID: string;
  createTime: string;
  orgLogo: string;
  orgName: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  bkashURL: string;
  statusCode: string;
  statusMessage: string;
}

export interface BkashExecutePaymentResponse {
  paymentID: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  paymentExecuteTime: string;
  statusCode: string;
  statusMessage: string;
  payerReference?: string;
  customerMsisdn?: string;
}

export class BkashPaymentAdapter {
  private appKey: string;
  private appSecret: string;
  private username: string;
  private password: string;
  private baseURL: string;

  constructor() {
    this.appKey = process.env.BKASH_APP_KEY || 'sandbox_app_key';
    this.appSecret = process.env.BKASH_APP_SECRET || 'sandbox_app_secret';
    this.username = process.env.BKASH_USERNAME || 'sandbox_username';
    this.password = process.env.BKASH_PASSWORD || 'sandbox_password';
    this.baseURL = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
  }

  public isConfigured(): boolean {
    return !!(
      process.env.BKASH_APP_KEY &&
      process.env.BKASH_APP_KEY !== 'sandbox_app_key' &&
      process.env.BKASH_APP_SECRET &&
      process.env.BKASH_APP_SECRET !== 'sandbox_app_secret'
    );
  }

  /**
   * Generates or fetches tokenized session grant
   */
  async grantToken(): Promise<string> {
    if (!this.isConfigured()) {
      return 'mock_bkash_id_token_' + Date.now();
    }

    const res = await fetch(`${this.baseURL}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: this.username,
        password: this.password,
      },
      body: JSON.stringify({
        app_key: this.appKey,
        app_secret: this.appSecret,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.statusCode !== '0000') {
      throw new Error(data.statusMessage || 'bKash token grant failed');
    }
    return data.id_token;
  }

  /**
   * Initializes payment with bKash Checkout
   */
  async createPayment(params: {
    amount: number;
    invoiceNumber: string;
    callbackURL: string;
    payerReference?: string;
  }): Promise<{ paymentID: string; bkashURL: string }> {
    if (!this.isConfigured()) {
      // Return simulated sandbox URL for demonstration
      const simulatedPaymentId = 'BK' + Date.now();
      return {
        paymentID: simulatedPaymentId,
        bkashURL: `${params.callbackURL}?paymentID=${simulatedPaymentId}&status=success`,
      };
    }

    const token = await this.grantToken();
    const res = await fetch(`${this.baseURL}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: params.payerReference || '01700000000',
        callbackURL: params.callbackURL,
        amount: params.amount.toFixed(2),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: params.invoiceNumber,
      }),
    });

    const data: BkashCreatePaymentResponse = await res.json();
    if (data.statusCode !== '0000') {
      throw new Error(`bKash Create Payment Failed: ${data.statusMessage}`);
    }

    return {
      paymentID: data.paymentID,
      bkashURL: data.bkashURL,
    };
  }

  /**
   * Executes payment server-to-server after customer OTP verification
   */
  async executePayment(paymentID: string): Promise<BkashExecutePaymentResponse> {
    if (!this.isConfigured()) {
      return {
        paymentID,
        trxID: 'TRX' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        transactionStatus: 'Completed',
        amount: '1200.00',
        currency: 'BDT',
        intent: 'sale',
        paymentExecuteTime: new Date().toISOString(),
        statusCode: '0000',
        statusMessage: 'Sandbox payment verified successfully',
      };
    }

    const token = await this.grantToken();
    const res = await fetch(`${this.baseURL}/tokenized/checkout/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify({ paymentID }),
    });

    const data: BkashExecutePaymentResponse = await res.json();
    if (data.statusCode !== '0000') {
      throw new Error(`bKash Execute Failed: ${data.statusMessage}`);
    }

    return data;
  }
}

export const bkashAdapter = new BkashPaymentAdapter();
