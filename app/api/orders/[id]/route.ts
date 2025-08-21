import { NextResponse } from 'next/server';
import { orders } from '../route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching order with ID:', params.id);
    console.log('Available order IDs:', orders.map(o => o.id));
    
    const order = orders.find(order => order.id === params.id);
    
    if (!order) {
      console.log('Order not found');
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log('Found order:', order);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
