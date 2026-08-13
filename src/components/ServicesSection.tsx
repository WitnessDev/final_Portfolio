import React from 'react';
import { Clapperboard, Video, Plane, Camera, Palette, Share2, Check, ArrowUpRight } from 'lucide-react';
import { SERVICES_DATA } from '../data/portfolioData';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceId: string) => void;
  lang?: 'en' | 'sw';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
  lang = 'en'
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clapperboard':
        return <Clapperboard size={22} />;
      case 'Video':
        return <Video size={22} />;
      case 'Plane':
        return <Plane size={22} />;
      case 'Camera':
        return <Camera size={22} />;
      case 'Vector':
      case 'Palette':
        return <Palette size={22} />;
      case 'Share2':
      default:
        return <Share2 size={22} />;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14 pb-6 border-b border-white/10">
        <div className="space-y-2">
          {/* Main Section Header: Silver-Gold Gradient */}
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-gradient-to-r from-slate-200 via-[#EED98A] to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
            {lang === 'sw' ? 'Huduma' : 'Services'}
          </h2>
          <p className="text-xs sm:text-sm font-body text-neutral-300 max-w-lg font-light leading-relaxed">
            {lang === 'sw'
              ? 'Uzalishaji wa video za sinema na picha za hali ya juu kote Afrika Mashariki.'
              : 'Cinematic media production and visual design across East Africa.'}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {SERVICES_DATA.map((service) => {
          const title = lang === 'sw' && service.titleSw ? service.titleSw : service.title;
          const shortDesc = lang === 'sw' && service.shortDescSw ? service.shortDescSw : service.shortDesc;
          const deliverables = lang === 'sw' && service.deliverablesSw ? service.deliverablesSw : service.deliverables;

          return (
            <div
              key={service.id}
              className="group relative p-6 sm:p-8 rounded-sm border border-white/20 bg-neutral-950 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#EED98A] hover:shadow-[0_0_35px_rgba(238,217,138,0.25)] flex flex-col justify-between"
            >
              {/* Fully Visible & Vibrant Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none"
                style={{
                  backgroundImage: `url('${service.bgImageUrl}')`,
                }}
              />

              {/* Balanced Image Overlay - Smooth gradient without blocking image visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none group-hover:via-black/20 transition-all duration-500" />

              {/* Card Main Content - Clean & Transparent */}
              <div className="relative z-20 space-y-5">
                <div className="flex items-center justify-between">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded bg-black/60 border border-white/20 flex items-center justify-center text-[#EED98A] group-hover:bg-[#EED98A] group-hover:text-[#0D0D0E] group-hover:rotate-6 group-hover:scale-105 transition-all duration-500 shadow-xl backdrop-blur-xs">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#EED98A] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {service.number}
                  </span>
                </div>

                {/* Title & Description with crisp shadows for contrast */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-slate-100 via-[#EED98A] to-slate-200 bg-clip-text text-transparent group-hover:from-[#EED98A] group-hover:via-amber-200 group-hover:to-[#EED98A] transition-all duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {title}
                  </h3>
                  <p className="text-xs md:text-sm font-body text-neutral-100 font-medium leading-relaxed group-hover:text-white transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {shortDesc}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="pt-4 border-t border-white/20 space-y-2 font-body">
                  {deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-100 font-medium group-hover:text-white transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      <Check size={12} className="text-[#EED98A] shrink-0 drop-shadow-sm" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Action Button */}
              <div className="relative z-20 pt-6 mt-6 border-t border-white/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectServiceForInquiry(service.id)}
                  className="w-full bg-black/70 hover:bg-[#EED98A] hover:text-[#0D0D0E] border border-white/20 hover:border-[#EED98A] text-white transition-all duration-300 py-2.5 px-4 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer group/btn shadow-xl backdrop-blur-xs"
                >
                  <span>{lang === 'sw' ? 'Omba Huduma' : 'Book Discipline'}</span>
                  <ArrowUpRight size={15} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300 text-[#EED98A] group-hover/btn:text-[#0D0D0E]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};