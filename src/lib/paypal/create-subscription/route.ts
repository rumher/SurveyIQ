import { NextRequest, NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (to verify user exists if needed)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1. Verify User is Logged In
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.replace('Bearer ', '');
    
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    const user = userData?.user;

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // 2. Create Subscription with PayPal
    const client = getPayPalClient();
    const planId = process.env.PAYPAL_PLAN_ID;

    if (!planId) {
      throw new Error('PAYPAL_PLAN_ID not configured');
    }

    const response = await client.execute({
      path: '/v1/billing/subscriptions',
      method: 'POST',
      body: {
        plan_id: planId,
        start_time: new Date().toISOString(),
        application_context: {
          brand_name: 'SurveyIQ',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?session_success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        },
      },
    });

    const subscriptionData = response.result as { id: string; links?: Array<{ rel: string; href: string }> };

    // 3. Return the Approval Link/ID to frontend
    return NextResponse.json({
      subscriptionID: subscriptionData.id,
      approvalLink: subscriptionData.links?.find((l) => l.rel === 'approve')?.href,
    });

  } catch (error) {
    console.error('PayPal Create Subscription Error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}