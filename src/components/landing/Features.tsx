const features = [
  { title: "AI Data Audit", desc: "Detect errors in raw survey data instantly." },
  { title: "Smart Reports", desc: "Generate professional PDFs in seconds." },
  { title: "Coordinate Sync", desc: "Universal conversion for all global systems." },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 text-navy">Powerful Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-3 text-teal">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}