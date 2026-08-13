import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Sparkles, CheckCircle2 } from 'lucide-react';
import { SHOWREEL_DATA } from '../data/portfolioData';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Container */}
      <div className="bg-[#0D0D0E] border border-white/10 rounded-sm max-w-5xl w-full overflow-hidden shadow-2xl relative flex flex-col text-white">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-neutral-900">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EED98A] animate-pulse" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#EED98A] font-bold">
                CINEMATIC SHOWREEL
              </p>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                {SHOWREEL_DATA.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-sm bg-black/50 border border-white/10 text-white hover:bg-[#EED98A] hover:text-[#0D0D0E] transition-all"
            title="Close showreel (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Stage */}
        <div className="relative aspect-video bg-black flex items-center justify-center group">
          <video
            ref={videoRef}
            src={SHOWREEL_DATA.videoSrc}
            poster={SHOWREEL_DATA.posterSrc}
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Video Controls Overlay Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 opacity-90 transition-opacity flex flex-col gap-2">
            {/* Progress Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-white/20 accent-[#EED98A] rounded cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs text-white pt-1">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded bg-white/10 hover:bg-[#EED98A] hover:text-[#0D0D0E] transition"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 rounded bg-white/10 hover:bg-[#EED98A] hover:text-[#0D0D0E] transition"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <span className="font-mono text-[11px] text-neutral-300">{SHOWREEL_DATA.duration}</span>
              </div>

              <span className="text-[10px] uppercase font-mono tracking-widest text-[#EED98A] hidden sm:inline">
                Honesty Visuals • 4K Master
              </span>
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="p-6 bg-neutral-900 border-t border-white/10 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#EED98A] flex items-center gap-1.5">
            <Sparkles size={13} /> Key Production Attributes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SHOWREEL_DATA.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 size={14} className="text-[#EED98A] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
