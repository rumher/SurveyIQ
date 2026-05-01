import { NextRequest, NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const client = getPayPalClient();
    
    let paypalResponse;
    try {
      paypalResponse = await client.execute({
        path: `/v1/billing/subscriptions/${subscriptionID}`,
        method: 'GET',
      });
    } catch (paypalError) {
      console.error('PayPal verification failed:', paypalError);
      return NextResponse.json(
        { error: 'Failed to verify subscription with PayPal' },
        { status: 502 }
      );
    }

    const status = paypalResponse.result.status;

    // 2. Check if status is valid
    // ACTIVE = paying, APPROVED = approved but start date in future
    if (status !== 'ACTIVE' && status !== 'APPROVED') {
      return NextResponse.json(
        { error: `Subscription status is ${status}, not active.` },
        { status: 400 }
      );
    }

    // 3. Update Database via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: 'PRO', // Matches your Enum
        paypalSubscriptionId: subscriptionID,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      status: status,
      user: {
        id: updatedUser.id,
        subscriptionTier: updatedUser.subscriptionTier,
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