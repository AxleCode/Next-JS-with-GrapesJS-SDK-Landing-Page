export default function Workflow() {
  return (
    <section id="workflow" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 bg-white text-red-600 rounded-full text-sm font-bold border border-red-200">How It Works</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">A clear user journey from login to live landing page</h2>
            <p className="text-lg text-slate-600">
              This one-page SaaS flow is designed for easy conversion. Your users understand the process immediately, making the website ideal for subscription campaigns and fast product activation.
            </p>
            <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Ideal flow</p>
              <p className="text-xl font-bold text-slate-900 mt-2">Login → Subscribe → Choose Template → Customize → Publish</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { step: '1', title: 'Login to dashboard', desc: 'Users enter the platform and access their page builder workspace with a clean and welcoming dashboard.' },
              { step: '2', title: 'Pay Rp100.000', desc: 'A clear subscription step keeps the decision simple and helps users unlock premium templates and editing access instantly.' },
              { step: '3', title: 'Choose your template', desc: 'Users browse conversion-focused layouts and select the landing page structure that best matches their brand objective.' },
              { step: '4', title: 'Customize and launch', desc: 'Update headlines, forms, buttons, and images using the builder, then publish the page when everything feels ready.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">{item.step}</div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
