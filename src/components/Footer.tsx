import Link from 'next/link';
import { HiMail, HiPhone, HiGlobe } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-grey-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center font-bold text-white text-sm">
                GHL
              </div>
              <span className="text-white font-bold text-lg">GHL India Ventures</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Your trusted source for AIF analysis, real estate investment insights, and expert research.
              Make informed investment decisions with our daily updates and comprehensive reports.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Insights</Link></li>
              <li><Link href="/reports" className="hover:text-white transition-colors">Reports</Link></li>
              <li><Link href="https://ghlindiaventures.com" target="_blank" className="hover:text-white transition-colors">Main Website</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <HiMail className="text-brand-red" />
                <span>info@ghlindiaventures.com</span>
              </li>
              <li className="flex items-center gap-2">
                <HiGlobe className="text-brand-red" />
                <a href="https://ghlindiaventures.com" target="_blank" className="hover:text-white transition-colors">
                  ghlindiaventures.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} GHL India Ventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
