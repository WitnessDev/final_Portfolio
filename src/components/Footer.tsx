import React from 'react';
import { ArrowUp, Instagram, MessageSquare, MapPin, Youtube } from 'lucide-react';
import { CLIENT_CREDENTIALS } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D0D0E] border-t border-white/10 pt-16 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/10 pb-12">
          {/* Logo & Tagline */}
          <div className="space-y-2">
            <a href="#home" className="text-xl font-display font-black tracking-[0.15em] text-white uppercase">
              <span>HONESTY</span> <span className="text-[#EED98A]">VISUALS</span>
            </a>
            <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
              Industrial precision, cinematic video direction, drone piloting, and visual identity architecture based in Dar es Salaam, Tanzania.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={CLIENT_CREDENTIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[#EED98A] hover:bg-[#EED98A] hover:text-[#0D0D0E] transition-all"
            >
              <Instagram size={18} />
            </a>
            <a
              href={CLIENT_CREDENTIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[#EED98A] hover:bg-[#EED98A] hover:text-[#0D0D0E] transition-all"
            >
              <svg size={18} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.32 0 .62.06.9.15V9.01a6.32 6.32 0 00-.9-.06 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1.0-.43z"/>
              </svg>
            </a>
            <a
              href={CLIENT_CREDENTIALS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[#EED98A] hover:bg-[#EED98A] hover:text-[#0D0D0E] transition-all"
            >
              <Youtube size={18} />
            </a>
            <a
              href={CLIENT_CREDENTIALS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[#EED98A] hover:bg-[#EED98A] hover:text-[#0D0D0E] transition-all"
            >
              <MessageSquare size={18} />
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-10 h-10 rounded-full bg-[#EED98A] text-[#0D0D0E] flex items-center justify-center hover:bg-white transition-all shadow-md font-bold"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-400 font-mono">
          <p>© {new Date().getFullYear()} Honesty Visuals. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-neutral-300">
            <MapPin size={12} className="text-[#EED98A]" />
            <span>Dar es Salaam, Tanzania 🇹🇿 (EAC)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
