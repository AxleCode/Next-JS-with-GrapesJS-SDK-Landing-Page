export default function Pricing() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 lg:p-10 shadow-2xl text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 bg-white/25 rounded-full text-sm font-bold border border-white/25">Simple Pricing</span>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">One subscription. One easy decision. One landing page system that sells.</h2>
            <p className="text-red-50 text-lg">
              No complicated packages. WIT.SBY keeps things focused so users can subscribe, pick a template, and get moving immediately.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 border border-white/25 rounded-xl p-4">
                <p className="font-bold">Template gallery access</p>
                <p className="text-sm text-red-50 mt-1">Select professional layouts for business, product, or service promotions.</p>
              </div>
              <div className="bg-white/20 border border-white/25 rounded-xl p-4">
                <p className="font-bold">Visual builder workflow</p>
                <p className="text-sm text-red-50 mt-1">Edit your landing page with a simple, fast, block-based experience.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 text-slate-900 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Starter Plan</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-5xl font-bold text-red-600">Rp100.000</span>
              <span className="text-sm font-semibold text-slate-500">/ access</span>
            </div>
            <p className="text-slate-600 mt-4">Perfect for businesses that need a clean one-page site with an easy flow from account login to launch.</p>
            <ul className="space-y-3 mt-6">
              {[
                'User login and account access',
                'Template selection flow',
                'Visual editing experience',
                'Lead generation landing page setup',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <img src="https://api.iconify.design/lucide/check-circle-2.svg?color=%23dc2626" alt="Check icon" className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 w-full mt-8 px-6 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
              <img src="https://api.iconify.design/lucide-arrow-right.svg?color=%23ffffff" alt="Arrow right icon" className="w-5 h-5" />
              <span>Subscribe and get started</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
