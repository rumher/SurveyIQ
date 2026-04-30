import checkout, { PayPalHttpClient } from '@paypal/checkout-server-sdk';

/**
 * Get configured PayPal HTTP client
 * Uses environment variables:
 * - PAYPAL_CLIENT_ID
 * - PAYPAL_CLIENT_SECRET
 */
export function getPayPalClient(): PayPalHttpClient {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env');
  }

  // Production environment
  const environment = new checkout.Core.SandboxEnvironment(clientId, clientSecret);
  return new checkout.PayPalHttpClient(environment);
}

/**
 * Get PayPal plan ID for a given plan name
 */
export function getPayPalPlanId(planName: string): string {
  const planIds: Record<string, string> = {
    'Pro Beta': process.env.PAYPAL_PLAN_ID_PRO_MONTHLY || '',
    'Pro Monthly': process.env.PAYPAL_PLAN_ID_PRO_MONTHLY || '',
    'Pro Annual': process.env.PAYPAL_PLAN_ID_PRO_ANNUAL || '',
    'Enterprise': process.env.PAYPAL_PLAN_ID_ENTERPRISE_MONTHLY || '',
    'Enterprise Annual': process.env.PAYPAL_PLAN_ID_ENTERPRISE_ANNUAL || '',
  };

  const planId = planIds[planName];
  if (!planId) {
    throw new Error(`No PayPal plan configured for: ${planName}`);
  }

  return planId;
}