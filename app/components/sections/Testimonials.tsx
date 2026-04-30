export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-red-50/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-4 py-2 bg-white text-red-600 rounded-full text-sm font-bold border border-red-200">Testimonials</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">What customers say about the WIT.SBY experience</h2>
          <p className="text-lg text-slate-600">
            Businesses want speed, simplicity, and clear pricing. This is exactly where WIT.SBY creates confidence and helps users get online faster.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              quote: "The flow is very easy to understand. I logged in, paid Rp100.000, chose a template, and had a solid landing page structure in minutes.",
              name: "Nadia Pramesti",
              role: "Online Course Creator",
              img: "https://app.grapesjs.com/api/assets/random-image?query=professional business woman portrait&w=96&h=96",
            },
            {
              quote: "As a small agency, we needed a simple landing page solution for quick campaigns. The template selection flow made onboarding clients much faster.",
              name: "Raka Santoso",
              role: "Creative Agency Founder",
              img: "https://app.grapesjs.com/api/assets/random-image?query=male agency founder portrait&w=96&h=96",
            },
            {
              quote: "The white and red interface feels premium and focused. It clearly communicates the offer and helps visitors understand the service instantly.",
              name: "Dimas Wijaya",
              role: "Product Marketer",
              img: "https://app.grapesjs.com/api/assets/random-image?query=young entrepreneur portrait&w=96&h=96",
            },
          ].map((item, idx) => (
            <article key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img key={star} src="https://api.iconify.design/lucide/star.svg?color=%23dc2626" alt="Star icon" className="w-5 h-5 text-red-600" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-6">"{item.quote}"</p>
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                <img src={item.img} alt={item.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
