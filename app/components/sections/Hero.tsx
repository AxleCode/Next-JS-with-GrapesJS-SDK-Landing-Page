export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-white text-red-600 text-sm font-semibold shadow-sm">
                <img src="https://api.iconify.design/lucide-layout-template.svg?color=%23dc2626" alt="Template icon" className="w-4 h-4" />
                <span>One-page builder flow for fast campaigns</span>
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                Launch your landing page faster with a simple login, payment, and template flow.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                WIT.SBY is a landing page SaaS built for creators, small businesses, and agencies. Users log in, subscribe for only <span className="font-bold text-red-600">Rp100.000</span>, choose a ready-to-use template, and start customizing their page with a smooth GrapesJS-style editing experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 hover:shadow-xl transition-all">
                <img src="https://api.iconify.design/lucide-credit-card.svg?color=%23ffffff" alt="Credit card icon" className="w-5 h-5" />
                <span>Start for Rp100.000</span>
              </a>
              <a href="#services" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold shadow-sm hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all">
                <img src="https://api.iconify.design/lucide-eye.svg?color=%231f2937" alt="Eye icon" className="w-5 h-5" />
                <span>See Features</span>
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className="border border-slate-200 bg-white p-4 rounded-xl shadow-sm">
                <p className="text-2xl font-bold text-slate-900">1 Page</p>
                <p className="text-sm text-slate-500">Focused conversion flow</p>
              </div>
              <div className="border border-slate-200 bg-white p-4 rounded-xl shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Rp100.000</p>
                <p className="text-sm text-slate-500">Simple subscription price</p>
              </div>
              <div className="border border-slate-200 bg-white p-4 rounded-xl shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Fast Setup</p>
                <p className="text-sm text-slate-500">Login, choose, publish</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between border-b border-red-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                </div>
                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">WIT.SBY Editor Flow</span>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1.1 gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900">Choose template</h3>
                      <img src="https://api.iconify.design/lucide-sparkles.svg?color=%23dc2626" alt="Sparkles icon" className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-2 border border-slate-200">
                        <img src="https://app.grapesjs.com/api/assets/random-image?query=red white saas landing page dashboard&w=320&h=220" alt="Template preview" className="w-full h-28 rounded-md object-cover" />
                        <p className="font-bold text-sm text-slate-900 mt-2">Startup Conversion</p>
                        <p className="text-xs text-slate-500">Hero + pricing + CTA</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-slate-200">
                        <img src="https://app.grapesjs.com/api/assets/random-image?query=white red product landing page interface&w=320&h=220" alt="Template preview" className="w-full h-28 rounded-md object-cover" />
                        <p className="font-bold text-sm text-slate-900 mt-2">Business Lead Gen</p>
                        <p className="text-xs text-slate-500">Form + testimonials</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <h3 className="font-bold text-slate-900 mb-2">Subscription</h3>
                    <p className="text-sm text-slate-600 mb-4">Unlock premium templates and editing flow.</p>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-slate-500">Monthly access</p>
                      <p className="text-3xl font-bold text-red-600 mt-1">Rp100.000</p>
                      <ul className="mt-4 space-y-2 text-sm text-slate-700">
                        <li className="flex items-center gap-2">
                          <img src="https://api.iconify.design/lucide-check.svg?color=%23dc2626" alt="Check icon" className="w-4 h-4 text-red-600" />
                          <span>Ready-made landing page templates</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <img src="https://api.iconify.design/lucide-check.svg?color=%23dc2626" alt="Check icon" className="w-4 h-4 text-red-600" />
                          <span>Easy editing workflow</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <img src="https://api.iconify.design/lucide-check.svg?color=%23dc2626" alt="Check icon" className="w-4 h-4 text-red-600" />
                          <span>Fast campaign launch</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-red-600 font-bold">01</p>
                    <p className="font-bold text-slate-900 mt-1">Login account</p>
                    <p className="text-sm text-slate-500 mt-1">Create or access your workspace securely.</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-red-600 font-bold">02</p>
                    <p className="font-bold text-slate-900 mt-1">Choose template</p>
                    <p className="text-sm text-slate-500 mt-1">Pick a layout that matches your campaign goal.</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-red-600 font-bold">03</p>
                    <p className="font-bold text-slate-900 mt-1">Edit and publish</p>
                    <p className="text-sm text-slate-500 mt-1">Customize content and launch in minutes.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white border border-red-200 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <img src="https://api.iconify.design/lucide-badge-check.svg?color=%23ffffff" alt="Badge check icon" className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Template-ready experience</p>
                  <p className="text-sm text-slate-500">Designed to convert from first click.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
