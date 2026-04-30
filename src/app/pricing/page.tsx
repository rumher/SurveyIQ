import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PayPalSubscribeButton from '@/components/pricing/PayPalSubscribeButton';
import Link from 'next/link';

export default async function PricingPage() {
const supabase = await createClient();
const { data } = await supabase.auth.getSession();
    const session = data?.session;

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-navy mb-4 font-syne">
          Simple, Transparent Pricing
        </h1>
        <p className="text-center text-gray-600 mb-16">
          Choose the plan that fits your surveying needs.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Starter</h3>
            <p className="text-4xl font-bold my-4">$0<span className="text-lg text-gray-500">/mo</span></p>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>✓ 5 Projects/mo</li>
              <li>✓ Basic Validation</li>
              <li>✓ Community Support</li>
            </ul>
            <Link href="/dashboard" className="block w-full text-center bg-gray-100 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition">
              Current Plan
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#0F1F38] text-white p-8 rounded-xl shadow-xl border-2 border-teal-bright relative transform scale-105">
            <div className="absolute top-0 right-0 bg-amber-500 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold">Pro Beta</h3>
            <p className="text-4xl font-bold my-4">$49<span className="text-lg text-gray-400">/mo</span></p>
            <ul className="space-y-3 mb-8 text-gray-300">
              <li>✓ Unlimited Projects</li>
              <li>✓ AI Data Audit</li>
              <li>✓ Priority Support</li>
              <li>✓ PDF Reports</li>
            </ul>
            
            {session ? (
              <PayPalSubscribeButton planName="Pro Beta" />
            ) : (
              <Link 
                href="/login?redirect=/pricing" 
                className="block w-full text-center bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition"
              >
                Login to Subscribe
              </Link>
            )}
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
            <p className="text-4xl font-bold my-4">Custom</p>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>✓ Dedicated Server</li>
              <li>✓ Custom Integrations</li>
              <li>✓ 24/7 Phone Support</li>
            </ul>
            <a href="mailto:sales@surveyiq.com" className="block w-full text-center bg-navy text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}