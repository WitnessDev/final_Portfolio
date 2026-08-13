import React, { useEffect } from 'react';
import { X, Play, Camera, Plane, Palette, Video, Calendar, User, Sparkles } from 'lucide-react';
import { PortfolioItem } from '../types';

interface LightboxModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onInquire: (serviceCategory: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose, onInquire }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0D0D0E] border border-white/10 rounded-sm max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] text-white">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-neutral-900">
          <div className="space-y-0.5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#EED98A] font-bold">
              PORTFOLIO PREVIEW • {item.categoryLabel}
            </p>
            <h3 className="text-xl font-display font-bold text-white">
              {item.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-sm bg-black/50 border border-white/10 text-white hover:bg-[#EED98A] hover:text-[#0D0D0E] transition-all"
            title="Close preview (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Media Viewport */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[300px] max-h-[500px]">
          {item.type === 'video' || item.videoUrl ? (
            <video
              src={item.mediaUrl || item.videoUrl || item.imageUrl}
              poster={item.imageUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain max-h-[500px]"
            />
          ) : (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-contain max-h-[500px]"
            />
          )}
        </div>

        {/* Details Footer */}
        <div className="p-6 bg-neutral-900 border-t border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400 border-b border-white/10 pb-3">
            {item.client && (
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-[#EED98A]" />
                <span>Client: {item.client}</span>
              </div>
            )}
            {item.year && (
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#EED98A]" />
                <span>Year: {item.year}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {item.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider font-mono"
            >
              Back to Gallery
            </button>

            <button
              onClick={() => {
                onClose();
                onInquire(item.category);
              }}
              className="bg-[#EED98A] text-[#0D0D0E] border border-[#EED98A] px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-white transition flex items-center gap-2"
            >
              <Sparkles size={14} /> Book Similar Production
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
