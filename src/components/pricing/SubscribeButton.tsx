'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SubscribeButtonProps {
  planName: string;
  price: string;
}

export default function SubscribeButton({ planName, price }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // If not logged in, redirect to login page with a return URL
        router.push(`/login?redirect=/pricing`);
        return;
      }

      // 2. Call our Backend API to create the subscription
      const response = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send token so backend can verify user identity
          'Authorization': `Bearer ${session.access_token}`, 
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start subscription');
      }

      // 3. Redirect user to PayPal Approval URL
      // This takes them off your site to PayPal securely
      if (data.approvalLink) {
        window.location.href = data.approvalLink;
      } else {
        throw new Error('No approval link received from PayPal');
      }

    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`
          w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-amber-500 hover:bg-amber-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          `Subscribe to ${planName}`
        )}
      </button>
      
      <p className="mt-2 text-xs text-center text-gray-500">
        Secure payment via PayPal • Cancel anytime
      </p>
    </div>
  );
}