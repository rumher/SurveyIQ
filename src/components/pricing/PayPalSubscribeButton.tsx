'use client';

import { useEffect, useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface PayPalSubscribeButtonProps {
  planName: string;
}

export default function PayPalSubscribeButton({ planName }: PayPalSubscribeButtonProps) {
  const [loading, setLoading] = useState(true);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 1. Fetch Subscription ID from our Backend on mount
  useEffect(() => {
    const initSubscription = async () => {
      try {
        // Get current session token
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (!session) {
          setError('You must be logged in to subscribe.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/paypal/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.error || 'Failed to init');

        setSubscriptionId(result.subscriptionID);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initSubscription();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading Secure Payment...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-50 rounded">{error}</div>;
  if (!subscriptionId) return null;

  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, 
      intent: 'subscription',
      vault: true 
    }}>
      <PayPalButtons
        style={{
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
          height: 45,
        }}
        createSubscription={(data, actions) => {
          // We already have the ID from our backend, just return it
          return actions.subscription.create({
            plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || '', // Fallback, though backend handled it
          });
        }}
        onApprove={async (approveData, actions) => {
          // 2. Activate on Backend
          const { data: sessionData } = await supabase.auth.getSession();
          const session = sessionData?.session;
          
          if (!session?.user?.id) {
            alert('Session expired. Please login again.');
            return;
          }

          try {
            const res = await fetch('/api/paypal/activate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscriptionID: approveData.subscriptionID,
                userId: session.user.id,
              }),
            });

            const result = await res.json();

            if (res.ok) {
              alert(`Success! You are now subscribed to ${planName}.`);
              router.push('/dashboard?upgrade=success');
            } else {
              throw new Error(result.error);
            }
          } catch (err: any) {
            alert('Payment verification failed: ' + err.message);
          }
        }}
        onError={(err) => {
          console.error('PayPal Error', err);
          setError('Payment failed. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
}