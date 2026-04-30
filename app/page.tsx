import Header from '@/app/components/layout/Header';
import Hero from '@/app/components/sections/Hero';
import PartnerStrip from '@/app/components/sections/PartnerStrip';
import Services from '@/app/components/sections/Services';
import Workflow from '@/app/components/sections/Workflow';
import Pricing from '@/app/components/sections/Pricing';
import Testimonials from '@/app/components/sections/Testimonials';
import Contact from '@/app/components/sections/Contact';
import Footer from '@/app/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      <main>
        <Hero />
        <PartnerStrip />
        <Services />
        <Workflow />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
