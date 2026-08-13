import React from 'react';
import { Compass, Clapperboard, Plane, BarChart3, Music, ShieldCheck, MapPin } from 'lucide-react';
import { CLIENT_CREDENTIALS } from '../data/portfolioData';
import { OptimizedImage } from './OptimizedImage';

export const AboutSection: React.FC = () => {
  const coreDisciplines = [
    { label: "Graphic Design", icon: Compass, desc: "Architectural layouts & vector branding" },
    { label: "Media Directing", icon: Clapperboard, desc: "Script, blocking & narrative pacing" },
    { label: "Drone Piloting", icon: Plane, desc: "4K 60fps aerial cinematography" },
    { label: "Financial Analysis", icon: BarChart3, desc: "Corporate logic & brand strategy" },
    { label: "Worship & Music", icon: Music, desc: "Keyboardist rhythm & emotional tone" },
  ];

  return (
    <section id="about" className="py-28 px-6 max-w-7xl mx-auto border-t border-white/10 relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-5 space-y-6 md:sticky md:top-28">
          <div className="w-full aspect-[3/4] bg-neutral-900 border border-white/10 rounded-sm overflow-hidden relative group shadow-2xl">
            <OptimizedImage
              src="/images/honesty2.jpeg"
              alt="Honesty Visuals Profile"
              widthParam={800}
              qualityParam={80}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0E] via-[#0D0D0E]/30 to-transparent opacity-90" />

            

            {/* Profile Title: Silver-Gold Gradient */}
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <h2 className="text-2xl font-display font-extrabold uppercase tracking-tight bg-gradient-to-r from-slate-200 via-[#EED98A] to-slate-300 bg-clip-text text-transparent">
                Honesty George
              </h2>
              <p className="text-xs font-mono text-[#EED98A] font-light tracking-wide">
                Founder & Lead Visual Architect
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-white/10 rounded-sm p-4 sm:p-5 space-y-3 shadow-xl font-body">
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs border-b border-white/10 pb-2">
              <span className="text-neutral-400">Location Base</span>
              <span className="text-white font-medium">{CLIENT_CREDENTIALS.location}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs border-b border-white/10 pb-2">
              <span className="text-neutral-400">Direct Contact</span>
              <a href={`tel:${CLIENT_CREDENTIALS.phone}`} className="text-[#EED98A] hover:underline font-mono">
                {CLIENT_CREDENTIALS.phone}
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
              <span className="text-neutral-400">Official Email</span>
              <a href={`mailto:${CLIENT_CREDENTIALS.email}`} className="text-[#EED98A] hover:underline font-mono text-[11px] truncate max-w-[200px]">
                {CLIENT_CREDENTIALS.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Main Story Heading with Silver-Gold Accent */}
        <div className="md:col-span-7 space-y-8 text-white border-l-0 md:border-l border-white/10 pl-0 md:pl-10 pt-4 md:pt-0">
          
          <div className="space-y-2">
           
            <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight tracking-tight bg-gradient-to-r from-slate-200 via-[#EED98A] to-slate-300 bg-clip-text text-transparent">
              Precision Engineering Meets Cinematic Emotion
            </h2>
          </div>

          <p className="text-lg md:text-xl font-display italic leading-relaxed text-[#EED98A] border-l-2 border-[#EED98A] pl-4">
            "{CLIENT_CREDENTIALS.bio[0]}"
          </p>

          <p className="text-sm md:text-base font-body leading-relaxed font-light text-neutral-300">
            {CLIENT_CREDENTIALS.bio[1]}
          </p>

          <p className="text-sm md:text-base font-body leading-relaxed font-light text-neutral-300">
            {CLIENT_CREDENTIALS.bio[2]}
          </p>

          {/* Core Disciplines List */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <h3 className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#EED98A] flex items-center gap-2">
              <ShieldCheck size={16} />
              Core Architecture & Technical Stack
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium uppercase tracking-wider text-white">
              {coreDisciplines.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 bg-neutral-900/80 border border-white/10 p-4 rounded-sm hover:border-[#EED98A] transition-all duration-300 group shadow-lg"
                  >
                    <div className="w-10 h-10 rounded bg-black/50 flex items-center justify-center text-[#EED98A] border border-white/10 group-hover:bg-[#EED98A] group-hover:text-[#0D0D0E] transition-colors shrink-0">
                      <IconComponent size={18} />
                    </div>
                    <div>
                      {/* Subcard Title: Silver-Gold metallic tint */}
                      <p className="font-display font-bold text-base bg-gradient-to-r from-slate-100 via-[#EED98A] to-slate-200 bg-clip-text text-transparent group-hover:from-[#EED98A] group-hover:to-[#EED98A] transition-all duration-300 capitalize tracking-normal">
                        {item.label}
                      </p>
                      <p className="text-[10px] font-body text-neutral-400 font-light lowercase tracking-normal mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};