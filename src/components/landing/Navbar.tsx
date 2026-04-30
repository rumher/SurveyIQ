import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-16 bg-navy/95 backdrop-blur-sm flex items-center justify-between px-[5%] z-50 text-white">
      <Link href="/" className="font-display font-extrabold text-xl flex items-center gap-2 hover:opacity-80 transition">
        📐 SurveyIQ
      </Link>
      
      <ul className="hidden md:flex gap-8 list-none">
        <li><Link href="/#features" className="text-gray-300 hover:text-white text-sm font-medium transition">Features</Link></li>
        <li><Link href="/pricing" className="text-gray-300 hover:text-white text-sm font-medium transition">Pricing</Link></li>
        <li><Link href="/#contact" className="text-gray-300 hover:text-white text-sm font-medium transition">Contact</Link></li>
      </ul>

      <Link 
        href="/signup" 
        className="bg-amber text-navy px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition shadow-lg"
      >
        Join Beta
      </Link>
    </nav>
  );
}