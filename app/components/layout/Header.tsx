import Link from 'next/link';
import AuthHeader from './AuthHeader';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-red-100 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="#home" className="flex items-center gap-3 px-3 py-2 rounded-lg border border-red-100 hover:border-red-400 hover:bg-red-50 transition-colors">
            <span className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-lg font-bold text-white text-lg">W</span>
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-sm">WIT.SBY</span>
              <span className="text-xs text-slate-500">Landing Page SaaS</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link href="#services" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">Services</Link>
            <Link href="#workflow" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">How It Works</Link>
            <Link href="#testimonials" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">Testimonials</Link>
            <Link href="#contact" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">Contact</Link>
          </nav>
          <AuthHeader />
        </div>
      </div>
    </header>
  );
}
