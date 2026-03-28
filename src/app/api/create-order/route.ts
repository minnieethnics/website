import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: 'Payments not yet enabled' }, { status: 503 });
  }
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const { items, total, customer } = await req.json();
  
  try {
    // 1. Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: 'INR',
      receipt: `me_${Date.now()}`,
    });

    // 2. Save order to Supabase
    const { data: order, error } = await supabaseAdmin()
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: `${customer.address}, ${customer.city} - ${customer.pincode}`,
        items,
        total,
        status: 'pending',
        razorpay_order_id: rzpOrder.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ orderId: order.id, razorpayOrderId: rzpOrder.id });
  } catch (err) {
    console.error('create-order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
