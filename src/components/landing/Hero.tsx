import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-navy text-white text-center pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Automate Surveying Data <br />
          <em className="text-amber not-italic">without the errors.</em>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          SurveyIQ handles validation, reports, and coordinate conversion so you can focus on the field.
        </p>
        <Link 
          href="/pricing" 
          className="inline-block bg-amber text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition transform hover:-translate-y-1 shadow-xl"
        >
          Start Free Trial
        </Link>
      </div>
    </section>
  );
}