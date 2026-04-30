export default function Contact() {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-red-600 rounded-3xl p-8 text-white shadow-lg">
          <span className="inline-block px-4 py-2 bg-white/25 rounded-full text-sm font-bold border border-white/25 mb-4">Contact Us</span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Need help building your landing page offer?</h2>
          <p className="text-red-50 mb-8">
            Send us your questions about login setup, subscription flow, template selection, or customizing your landing page experience for your users.
          </p>
          <div className="space-y-4">
            {[
              { icon: 'mail', text: 'hello@wit.sby' },
              { icon: 'phone', text: '+62 812 0000 1000' },
              { icon: 'map-pin', text: 'Surabaya, Indonesia' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/10 border border-white/25 rounded-xl p-4">
                <img src={`https://api.iconify.design/lucide/${item.icon}.svg?color=%23ffffff`} alt={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
          <div className="space-y-4 mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Request a demo or ask a question</h3>
            <p className="text-slate-600">Fill in your details and tell us what kind of landing page system you want to launch.</p>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</label>
                <input type="text" id="name" placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" id="email" placeholder="name@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-sm font-bold text-slate-700">WhatsApp Number</label>
                <input type="tel" id="whatsapp" placeholder="+62..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label htmlFor="business" className="text-sm font-bold text-slate-700">Business Type</label>
                <select id="business" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all">
                  <option>Startup</option>
                  <option>Agency</option>
                  <option>Personal Brand</option>
                  <option>Online Shop</option>
                  <option>Local Business</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold text-slate-700">Message</label>
              <textarea id="message" rows={5} placeholder="Tell us about your project, user flow, or template needs..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"></textarea>
            </div>
            <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-300 transition-colors cursor-pointer">
              <input type="checkbox" className="mt-1 w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500" />
              <span className="text-sm text-slate-600">I agree to be contacted by WIT.SBY regarding landing page services, subscription setup, and template recommendations.</span>
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
              <img src="https://api.iconify.design/lucide/send.svg?color=%23ffffff" alt="Send icon" className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
