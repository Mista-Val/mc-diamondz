import { NextResponse } from 'next/server';
import crypto from 'crypto';

// This would typically be stored in your database
const orders: any[] = [];

export async function POST(request: Request) {
  try {
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    const signature = request.headers.get('verif-hash');
    
    // Verify the webhook signature
    if (signature !== secretHash) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const { event, data } = payload;

    // Handle different webhook events
    switch (event) {
      case 'charge.completed':
        // Payment was successful
        await handleSuccessfulPayment(data);
        break;
      
      case 'charge.failed':
        // Payment failed
        await handleFailedPayment(data);
        break;
      
      case 'transfer.completed':
        // Transfer to merchant was successful
        await handleTransferCompleted(data);
        break;
      
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(data: any) {
  // In a real app, you would:
  // 1. Verify the payment with Flutterwave
  // 2. Update the order status in your database
  // 3. Send order confirmation email
  // 4. Update inventory, etc.
  
  console.log('Payment successful:', data);
  
  // Example: Find and update the order in your database
  const orderIndex = orders.findIndex(order => order.id === data.tx_ref);
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: 'paid',
      paymentStatus: 'paid',
      paymentReference: data.transaction_id || data.id,
      updatedAt: new Date().toISOString(),
    };
  }
}

async function handleFailedPayment(data: any) {
  // Handle failed payment
  console.log('Payment failed:', data);
  
  // Update order status to failed
  const orderIndex = orders.findIndex(order => order.id === data.tx_ref);
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: 'payment_failed',
      paymentStatus: 'failed',
      paymentError: data.processor_response || 'Payment failed',
      updatedAt: new Date().toISOString(),
    };
  }
}

async function handleTransferCompleted(data: any) {
  // Handle transfer completion to merchant account
  console.log('Transfer completed:', data);
  
  // Update order status to indicate funds have been transferred
  const orderIndex = orders.findIndex(order => order.transferCode === data.transfer_code);
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      transferStatus: 'completed',
      transferCompletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
