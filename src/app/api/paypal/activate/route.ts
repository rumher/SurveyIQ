import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, SubscriptionsController } from '@paypal/paypal-server-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getSubscriptionsController() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
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
    const body = await req.json();
    const { subscriptionID, userId } = body;

    if (!subscriptionID || !userId) {
      return NextResponse.json(
        { error: 'Missing subscriptionID or userId' },
        { status: 400 }
      );
    }

    // 1. Verify with PayPal
    const subscriptionsController = getSubscriptionsController();
    
    let paypalResponse;
    try {
      paypalResponse = await subscriptionsController.getSubscription({
        id: subscriptionID,
        fields: 'plan',
      });
    } catch (paypalError) {
      console.error('PayPal verification failed:', paypalError);
      return NextResponse.json(
        { error: 'Failed to verify subscription with PayPal' },
        { status: 502 }
      );
    }

    // If we got a valid response, the subscription exists
    // We'll just activate it - PayPal handles the status internally
    
    // 2. Update Database via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: 'PRO', // Matches your Enum
        paypalSubscriptionId: subscriptionID,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      user: {
        id: updatedUser.id,
        subscription: updatedUser.subscription,
      },
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}