'use client'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

export default function PayPalButton({ amount }: { amount: number }) {
  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
      currency: 'USD'
    }}>
      <PayPalButtons
        createOrder={async () => {
          const res = await fetch('/api/paypal', {
            method: 'POST',
            body: JSON.stringify({ amount }),
          })
          const { orderId } = await res.json()
          return orderId
        }}
        onApprove={async (data) => {
          // Handle successful payment
          console.log('Payment approved:', data.orderID)
        }}
      />
    </PayPalScriptProvider>
  )
}