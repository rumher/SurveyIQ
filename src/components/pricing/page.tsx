import Navbar from '@/components/landing/Navbar';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20"></div> {/* Spacer for fixed navbar */}
      <Pricing />
      <Footer />
    </main>
  );
}