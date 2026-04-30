export default function Services() {
  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-200">Services &amp; Core Features</span>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Everything you need to turn visitors into leads on one page</h2>
        <p className="text-lg text-slate-600">
          WIT.SBY simplifies the journey from sign-in to published landing page, making it easy for users to subscribe, select a template, and build a polished web presence with confidence.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {[
          { icon: 'log-in', title: 'Secure user login flow', desc: 'Give your customers a straightforward entry point to their account so they can manage templates, pages, and subscriptions without confusion.' },
          { icon: 'layout-panel-top', title: 'Curated landing page templates', desc: 'Offer users a clean template gallery so they can choose a style that fits their brand, product, service, or event in seconds.' },
          { icon: 'wallet-cards', title: 'Simple payment subscription', desc: 'Keep pricing clear and easy with a single package at <span className="font-bold text-red-600">Rp100.000</span>, so customers know exactly what they get before checkout.' },
          { icon: 'pencil-ruler', title: 'GrapesJS-style visual editing', desc: 'Enable a visual builder experience for fast text updates, image swaps, CTA tweaks, and section arrangement without technical barriers.' },
          { icon: 'rocket', title: 'Fast publish workflow', desc: 'Help users move from template selection to a live landing page quickly so they can launch promotions, collect leads, and start selling sooner.' },
          { icon: 'headphones', title: 'Guided support experience', desc: 'Support new users with an onboarding path, clear contact options, and friendly assistance to keep the conversion journey frictionless.' },
        ].map((service, idx) => (
          <article key={idx} className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-red-300 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
              <img src={`https://api.iconify.design/lucide/${service.icon}.svg?color=%23dc2626`} alt={service.title} className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
            <p className="text-slate-600">{service.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
