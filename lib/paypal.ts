import axios from 'axios';

type PayPalWebhookVerifyParams = {
  transmissionId: string;
  transmissionTime: string;
  certUrl: string;
  webhookId: string;
  transmissionSig: string;
  webhookEvent: any;
};

export async function verifyPayPalWebhook({
  transmissionId,
  transmissionTime,
  certUrl,
  webhookId,
  transmissionSig,
  webhookEvent,
}: PayPalWebhookVerifyParams): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: 'SHA256withRSA',
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying PayPal webhook:', error);
    return false;
  }
}

export async function getPayPalAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      `${getPayPalBaseUrl()}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }
}

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_ENVIRONMENT === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

export async function capturePayPalOrder(orderId: string): Promise<any> {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
}

export async function createPayPalOrder(amount: number, currency: string = 'USD'): Promise<string> {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${getPayPalBaseUrl()}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toString(),
            },
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}
