export default function Footer() {
  return (
    <footer className="border-t border-red-100 bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-lg font-bold text-white text-lg">W</span>
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-sm">WIT.SBY</span>
              <span className="text-xs text-slate-500">Landing Page SaaS</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">Services</a>
            <a href="#workflow" className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">Workflow</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">Pricing</a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">Contact</a>
          </div>
          <p className="text-sm text-slate-500">© 2026 WIT.SBY. Built for login, subscription, template selection, and launch.</p>
        </div>
      </div>
    </footer>
  );
}
