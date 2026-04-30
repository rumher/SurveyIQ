    import RoiCalculator from './RoiCalculator';
import Link from 'next/link';

export default function Pricing() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 text-navy">Simple Pricing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Starter */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col">
          <h3 className="text-xl font-bold text-gray-500">Starter</h3>
          <p className="text-4xl font-extrabold my-4">$0<span className="text-lg font-normal text-gray-400">/mo</span></p>
          <ul className="space-y-3 mb-8 flex-1 text-gray-600">
            <li>• 5 Projects/mo</li>
            <li>• Basic Validation</li>
          </ul>
          <Link href="/signup" className="w-full block text-center bg-gray-100 text-navy py-3 rounded-lg font-bold hover:bg-gray-200 transition">Get Started</Link>
        </div>

        {/* Pro */}
        <div className="bg-white p-8 rounded-2xl border-2 border-teal-bright relative shadow-xl flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-teal-bright text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
          <h3 className="text-xl font-bold text-teal-bright">Pro</h3>
          <p className="text-4xl font-extrabold my-4">$49<span className="text-lg font-normal text-gray-400">/mo</span></p>
          <ul className="space-y-3 mb-8 flex-1 text-gray-600">
            <li>• Unlimited Projects</li>
            <li>• AI Data Audit</li>
            <li>• Smart Reports</li>
          </ul>
          <Link href="/signup" className="w-full block text-center bg-teal-bright text-white py-3 rounded-lg font-bold hover:bg-teal-600 transition">Start Free Trial</Link>
        </div>

        {/* Enterprise */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col">
          <h3 className="text-xl font-bold text-gray-500">Enterprise</h3>
          <p className="text-4xl font-extrabold my-4">Custom</p>
          <ul className="space-y-3 mb-8 flex-1 text-gray-600">
            <li>• API Access</li>
            <li>• Dedicated Support</li>
            <li>• Custom Integrations</li>
          </ul>
          <Link href="/#contact" className="w-full block text-center bg-gray-100 text-navy py-3 rounded-lg font-bold hover:bg-gray-200 transition">Contact Us</Link>
        </div>
      </div>

      <RoiCalculator />
    </section>
  );
}