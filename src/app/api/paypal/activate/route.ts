import { NextRequest, NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { subscriptionID, userId } = await req.json();

    if (!subscriptionID || !userId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 1. Verify Subscription Status with PayPal
    const client = getPayPalClient();
    
    const response = await client.execute({
      path: `/v1/billing/subscriptions/${subscriptionID}`,
      method: 'GET',
    });

    const paypalData = response.result as { status: string };
    const status = paypalData.status;

    // Only activate if PayPal says it's active or approved
    if (status !== 'ACTIVE' && status !== 'APPROVED') {
      return NextResponse.json(
        { error: `Payment status is ${status}, not active.` },
        { status: 400 }
      );
    }

    // 2. Update Database
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: 'PRO',
        paypalSubscriptionId: subscriptionID,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, status });

  } catch (error) {
    console.error('PayPal Activation Error:', error);
    return NextResponse.json(
      { error: 'Failed to activate subscription' },
      { status: 500 }
    );
  }
}