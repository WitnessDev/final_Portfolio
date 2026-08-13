import React from 'react';
import { Instagram, Youtube, MessageSquare } from 'lucide-react';
import { CLIENT_CREDENTIALS } from '../data/portfolioData';
import heroBg from '../images/bg-image.jpg'; // Ensure 'images' folder is inside 'src'

interface HeroProps {
  onOpenShowreel?: () => void;
  lang?: 'en' | 'sw';
}

export const Hero: React.FC<HeroProps> = ({ lang = 'en' }) => {
  return (
    <section id="home" className="relative w-full overflow-hidden min-h-screen flex items-center justify-center">
      
      {/* Background Image Layer - High visibility */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 transform scale-105 pointer-events-none"
        style={{
          backgroundImage: `url(src/images/bg-image.jpg)`, // Ensure the path is correct
        }}
      />

      {/* Subtle Dark Editorial Vignette (Allows image to show through) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0D0D0E]/80 via-[#0D0D0E]/50 to-[#0D0D0E]/90 pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center pt-24 pb-12">
        <div className="flex flex-col items-center justify-center gap-y-[clamp(0.75rem,2.2vh,1.75rem)] w-full max-w-4xl">

          {/* Main Brand Hero Display Title */}
          <div className="w-full select-none px-2 overflow-hidden flex flex-col items-center justify-center">
            <h1 className="w-full text-center tracking-tight uppercase select-none font-display font-black bg-gradient-to-b from-white via-neutral-100 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
              <span className="block sm:inline text-[clamp(1.6rem,7.5vw,3.2rem)] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.88] sm:leading-tight break-words">
                HONESTY
              </span>{' '}
              <span className="block sm:inline text-[clamp(1.6rem,7.5vw,3.2rem)] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.88] sm:leading-tight text-[#CDB26B] sm:text-transparent break-words">
                VISUALS
              </span>
            </h1>
          </div>

          {/* Specialty Roles Subtitle line */}
          <div className="text-[clamp(10px,1.2vh,13px)] sm:text-xs md:text-sm font-bold tracking-[0.12em] sm:tracking-[0.2em] uppercase text-[#CDB26B] max-w-3xl leading-snug flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3.5 gap-y-1 px-2">
            <span>{lang === 'sw' ? 'UBUNI' : 'GRAPHICS'}</span>
            <span className="text-[#CDB26B]/40 font-light hidden sm:inline">|</span>
            <span>{lang === 'sw' ? 'RUBANI WA DRONI' : 'DRONE PILOT'}</span>
            <span className="text-[#CDB26B]/40 font-light hidden sm:inline">|</span>
            <span>{lang === 'sw' ? 'MREKODI VIDEO' : 'VIDEOGRAPHER'}</span>
            <span className="text-[#CDB26B]/40 font-light hidden sm:inline">|</span>
            <span>{lang === 'sw' ? 'MUONGOZA VIDEO' : 'VIDEO DIRECTOR'}</span>
            <span className="text-[#CDB26B]/40 font-light hidden sm:inline">|</span>
            <span>{lang === 'sw' ? 'MPIGAPICHA' : 'PHOTOGRAPHER'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-5 w-full max-w-xs sm:max-w-none px-2 sm:px-0">
            <a
              href="#portfolio"
              id="hero-portfolio-cta"
              className="flex-1 sm:flex-initial border border-[#CDB26B]/60 hover:border-[#CDB26B] bg-black/60 text-white hover:bg-[#CDB26B] hover:text-[#0D0D0E] px-5 sm:px-9 py-2 sm:py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-2xs shadow-md text-center shrink-0"
            >
              {lang === 'sw' ? 'PORTFOLIO' : 'WORK'}
            </a>

            <a
              href="#contact"
              id="hero-contact-cta"
              className="flex-1 sm:flex-initial border border-[#CDB26B]/60 hover:border-[#CDB26B] bg-black/60 text-white hover:bg-[#CDB26B] hover:text-[#0D0D0E] px-5 sm:px-9 py-2 sm:py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-2xs shadow-md text-center shrink-0"
            >
              {lang === 'sw' ? 'MAWASILIANO' : 'CONTACT'}
            </a>
          </div>

          {/* Social Media Circular Icon Buttons */}
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4.5 z-20 mt-2">
            <a
              href={CLIENT_CREDENTIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              title="Instagram"
              className="w-[clamp(2.25rem,4.5vh,2.75rem)] h-[clamp(2.25rem,4.5vh,2.75rem)] rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#CDB26B] hover:text-[#0D0D0E] hover:border-[#CDB26B] transition-all duration-300 shadow-lg shrink-0"
            >
              <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>

            <a
              href={CLIENT_CREDENTIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Profile"
              title="TikTok"
              className="w-[clamp(2.25rem,4.5vh,2.75rem)] h-[clamp(2.25rem,4.5vh,2.75rem)] rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#CDB26B] hover:text-[#0D0D0E] hover:border-[#CDB26B] transition-all duration-300 shadow-lg shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 1 1-2.896-2.896c.214 0 .422.023.623.067V9.381a6.32 6.32 0 0 0-.623-.031 6.337 6.337 0 1 0 6.337 6.337V8.841a8.214 8.214 0 0 0 4.245 1.286V6.686z" />
              </svg>
            </a>

            <a
              href="https://youtube.com/@honestyvisuals"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
              title="YouTube"
              className="w-[clamp(2.25rem,4.5vh,2.75rem)] h-[clamp(2.25rem,4.5vh,2.75rem)] rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#CDB26B] hover:text-[#0D0D0E] hover:border-[#CDB26B] transition-all duration-300 shadow-lg shrink-0"
            >
              <Youtube className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>

            <a
              href={CLIENT_CREDENTIALS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Direct"
              title="WhatsApp"
              className="w-[clamp(2.25rem,4.5vh,2.75rem)] h-[clamp(2.25rem,4.5vh,2.75rem)] rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#CDB26B] hover:text-[#0D0D0E] hover:border-[#CDB26B] transition-all duration-300 shadow-lg shrink-0"
            >
              <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};