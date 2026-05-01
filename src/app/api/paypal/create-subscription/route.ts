import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, SubscriptionsController, ApplicationContextUserAction, ExperienceContextShippingPreference } from '@paypal/paypal-server-sdk';
import { createClient } from '@/lib/supabase/server';

// 1. Initialize PayPal Client securely on the server
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials in environment variables');
  }

  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    environment: process.env.NODE_ENV === 'production'
      ? Environment.Production
      : Environment.Sandbox,
  });

  return new SubscriptionsController(client);
}

export async function POST(req: NextRequest) {
  try {
    // 2. Security Check: Ensure user is logged in before creating subscription
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const planId = process.env.PAYPAL_PLAN_ID;

    if (!planId) {
      throw new Error('PAYPAL_PLAN_ID is not defined in environment variables');
    }

    // 3. Initialize PayPal Client
    const subscriptionsController = getPayPalClient();

    // 4. Call PayPal API to create the subscription
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await subscriptionsController.createSubscription({
      body: {
        planId: planId,
        startTime: new Date().toISOString(),
        applicationContext: {
          brandName: 'SurveyIQ',
          locale: 'en-US',
          shippingPreference: ExperienceContextShippingPreference.NoShipping,
          userAction: ApplicationContextUserAction.SubscribeNow,
          returnUrl: `${appUrl}/dashboard/settings?session_success=true`,
          cancelUrl: `${appUrl}/pricing?canceled=true`,
        },
      },
    });

    // 5. Extract the Approval URL and Subscription ID
    const approvalLink = response.result?.links?.find(
      (link: { rel?: string; href?: string }) => link.rel === 'approve'
    )?.href;

    const subscriptionId = response.result?.id;

    if (!approvalLink) {
      throw new Error('PayPal did not return an approval link');
    }

    // 6. Return data to frontend
    return NextResponse.json({
      subscriptionID: subscriptionId,
      approvalLink: approvalLink,
      message: 'Subscription created successfully. Redirect user to approvalLink.'
    });

  } catch (error) {
    console.error('PayPal Create Subscription Error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}