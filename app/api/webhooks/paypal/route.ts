import { NextResponse } from 'next/server';
import { verifyPayPalWebhook } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('paypal-transmission-sig') || '';
    const certUrl = request.headers.get('paypal-cert-url') || '';
    const transmissionId = request.headers.get('paypal-transmission-id') || '';
    const transmissionTime = request.headers.get('paypal-transmission-time') || '';
    const webhookId = process.env.PAYPAL_WEBHOOK_ID || '';

    // Verify the webhook signature
    const isValid = await verifyPayPalWebhook({
      transmissionId,
      transmissionTime,
      certUrl,
      webhookId,
      transmissionSig: signature,
      webhookEvent: payload
    });

    if (!isValid) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const eventType = payload.event_type;
    const resource = payload.resource;

    // Handle different webhook events
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Handle successful payment
        console.log('Payment captured:', resource.id);
        // Update order status in your database
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.PENDING':
      case 'PAYMENT.CAPTURE.REFUNDED':
      case 'PAYMENT.CAPTURE.REVERSED':
        // Handle other payment statuses
        console.log(`Payment ${eventType}:`, resource.id);
        break;
      
      default:
        console.log('Unhandled event type:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic route handling
