'use client';

import { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';

interface PayPalSubscribeButtonProps {
  userId: string;
  planId: string;
}

export default function PayPalSubscribeButton({ userId, planId }: PayPalSubscribeButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!userId) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded">
        Please log in to subscribe.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        intent: 'subscription',
        vault: true,
      }}
    >
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <PayPalButtons
        style={{
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
        }}
        disabled={isProcessing}
        
        // 1. Create the subscription on PayPal's side
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: planId,
          });
        }}

        // 2. Handle Approval
        onApprove={async (data, actions) => {
          setIsProcessing(true);
          setError(null);

          try {
            // Send the Subscription ID to OUR backend for verification
            const response = await fetch('/api/paypal/activate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscriptionID: data.subscriptionID,
                userId: userId,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || 'Payment verification failed');
            }

            // Success! Redirect to dashboard
            alert('🎉 Welcome to Pro! Your account has been upgraded.');
            router.push('/dashboard?upgrade=success');
            
          } catch (err: any) {
            console.error(err);
            setError(err.message);
          } finally {
            setIsProcessing(false);
          }
        }}

        onError={(err) => {
          console.error('PayPal Error', err);
          setError('Something went wrong with PayPal. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
}