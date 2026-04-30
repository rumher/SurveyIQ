import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { subscriptionID, userId, planId } = await req.json()

    if (!subscriptionID || !userId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // 1. Verify subscription status with PayPal (Optional but recommended for production)
    // For now, we trust the onApprove callback, but in prod, you should verify via PayPal API
    
    // 2. Update User in Database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: 'PRO',
        paypalSubscriptionId: subscriptionID,
        proUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Add 30 days
      },
    })

    return NextResponse.json({ 
      message: 'Subscription activated', 
      userId: updatedUser.id 
    })

  } catch (error) {
    console.error('Subscription activation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    )
  }
}