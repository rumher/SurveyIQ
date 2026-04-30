export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 bg-gray-50">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-navy">Contact Us</h2>
        <form className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <input 
            type="text" 
            placeholder="Your Name" 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber focus:border-transparent outline-none"
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber focus:border-transparent outline-none"
          />
          <textarea 
            rows={4}
            placeholder="How can we help?" 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber focus:border-transparent outline-none"
          ></textarea>
          <button type="button" className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-yellow-400 transition">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}