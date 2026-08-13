import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquare } from 'lucide-react';
import { CLIENT_CREDENTIALS } from '../data/portfolioData';

interface NavbarProps {
  activeSection: string;
  onOpenShowreel?: () => void;
  lang: 'en' | 'sw';
  onLanguageChange: (lang: 'en' | 'sw') => void;
  audioEnabled?: boolean;
  onToggleAudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  lang,
  onLanguageChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 w-full max-w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0D0E]/95 backdrop-blur-md border-b border-white/10 py-3.5 sm:py-4 shadow-xl'
          : 'bg-[#0D0D0E]/80 backdrop-blur-sm border-b border-white/5 py-4 sm:py-5'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Brand Logo - Responsive sizing, NEVER truncated or clipped */}
        <a
          href="#home"
          id="nav-logo"
          className="group flex items-center gap-1 text-[11px] sm:text-xs lg:text-sm font-display font-black tracking-wider sm:tracking-[0.12em] text-white uppercase shrink-0 whitespace-nowrap"
        >
          <span className="font-extrabold text-white">HONESTY</span>
          <span className="font-extrabold text-[#EED98A]">VISUALS</span>
          <span className="inline-block w-1 h-1 rounded-full bg-[#EED98A] group-hover:scale-125 transition-transform shrink-0" />
        </a>

        {/* Desktop Navigation Links (ONLY visible on Desktop min-width: 1024px / lg) */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 shrink-0">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`relative pb-1 transition-colors duration-300 ${
                    isActive
                      ? 'text-white font-bold border-b-2 border-[#EED98A]'
                      : 'hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop Action Controls (ONLY visible on Desktop min-width: 1024px / lg) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Main Language Switcher */}
          <div className="flex items-center gap-0.5 bg-neutral-900 border border-white/15 p-1 rounded-full shrink-0 shadow-md">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-neutral-600 text-[10px] font-mono">•</span>
            <button
              type="button"
              onClick={() => onLanguageChange('sw')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition cursor-pointer ${
                lang === 'sw'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              SW
            </button>
          </div>

          {/* Direct WhatsApp CTA */}
          <a
            href={CLIENT_CREDENTIALS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-btn"
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded bg-[#EED98A] text-[#0D0D0E] hover:bg-white transition-all duration-300 shadow-sm shrink-0"
          >
            <MessageSquare size={12} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile & Tablet Right Controls (< 1024px / lg) */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3 shrink-0">
          {/* Main Language Switcher for Mobile & Tablet */}
          <div className="flex items-center gap-0.5 bg-neutral-900 border border-white/15 p-0.5 sm:p-1 rounded-full shrink-0 shadow-md">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider transition cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-neutral-600 text-[9px] sm:text-[10px] font-mono">•</span>
            <button
              type="button"
              onClick={() => onLanguageChange('sw')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider transition cursor-pointer ${
                lang === 'sw'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              SW
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className="text-white p-1.5 focus:outline-none hover:text-[#EED98A] transition cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Hamburger Drawer Menu Overlay & Content (< 1024px / lg) */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            id="mobile-menu-drawer"
            className="lg:hidden bg-[#0D0D0E]/98 backdrop-blur-xl border-b border-white/10 px-6 py-6 fixed inset-x-0 top-full shadow-2xl z-50 max-h-[85vh] overflow-y-auto flex flex-col gap-6"
          >
            <ul className="flex flex-col items-center gap-4 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-300">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <li key={link.name} className="w-full text-center">
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 transition-colors ${
                        isActive
                          ? 'text-[#EED98A] font-bold border-b-2 border-[#EED98A] inline-block'
                          : 'hover:text-white'
                      }`}
                    >
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Language Selector in Drawer */}
            <div className="pt-4 border-t border-white/10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                {lang === 'sw' ? 'CHAGUA LUGHA' : 'SELECT LANGUAGE'}
              </span>
              <div className="flex items-center gap-1 bg-neutral-900 border border-white/15 p-1 rounded-full shadow-md">
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider transition cursor-pointer ${
                    lang === 'en'
                      ? 'bg-[#EED98A] text-[#0D0D0E]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <span className="text-neutral-600 text-xs font-mono">•</span>
                <button
                  type="button"
                  onClick={() => onLanguageChange('sw')}
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider transition cursor-pointer ${
                    lang === 'sw'
                      ? 'bg-[#EED98A] text-[#0D0D0E]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  SW
                </button>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <a
                href={CLIENT_CREDENTIALS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#EED98A] text-[#0D0D0E] text-xs uppercase tracking-widest font-bold hover:bg-white transition shadow-md"
              >
                <MessageSquare size={14} /> WhatsApp Direct (+255 794292948)
              </a>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
