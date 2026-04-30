export default function PartnerStrip() {
  return (
    <div className="border-y border-red-100 bg-red-50/60 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Built for campaigns, agencies, products, and local businesses</p>
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-sm font-bold text-slate-700">Fast onboarding</span>
          <span className="text-sm font-bold text-slate-700">Easy template selection</span>
          <span className="text-sm font-bold text-slate-700">Simple monthly pricing</span>
          <span className="text-sm font-bold text-slate-700">Conversion-first layouts</span>
        </div>
      </div>
    </div>
  );
}
