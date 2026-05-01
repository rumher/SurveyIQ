// app/api/paypal/route.ts
import { NextResponse } from 'next/server'
import { Client, Environment, OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk'

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.NODE_ENV === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
})

const ordersController = new OrdersController(client)

export async function POST(request: Request) {
  try {
    const { amount, currency = 'USD' } = await request.json()
    
    const response = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [{
          amount: {
            currencyCode: currency,
            value: amount.toString(),
          },
        }],
      },
    })
    
    return NextResponse.json({ orderId: response.result?.id })
  } catch (error) {
    console.error('PayPal API error:', error)
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
  }
}