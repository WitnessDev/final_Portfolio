import React, { useState, useEffect, useMemo } from 'react';
import { PortfolioItem, Category, getPublishedPortfolio, getCategories } from '../lib/portfolioService';
import { OptimizedImage } from './OptimizedImage';
import { Search, Image as ImageIcon, Sparkles, Video, Play } from 'lucide-react';

interface PortfolioSectionProps {
  onOpenItem: (item: any) => void;
}

const ITEMS_PER_PAGE = 9;

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenItem }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  useEffect(() => {
    loadPublicPortfolio();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCatId, searchQuery]);

  const loadPublicPortfolio = async () => {
    setLoading(true);
    try {
      const [fetchedItems, fetchedCats] = await Promise.all([
        getPublishedPortfolio(),
        getCategories()
      ]);
      setItems(fetchedItems);
      setCategories(fetchedCats);
    } catch (err) {
      console.error('Error loading published portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = selectedCatId === 'ALL' || item.categoryId === selectedCatId;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCat && matchesSearch;
    });
  }, [items, selectedCatId, searchQuery]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section id="portfolio" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Header: Silver-Gold Gradient Title */}
      <div className="text-center space-y-3 mb-12 sm:mb-16">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight bg-gradient-to-r from-slate-200 via-[#EED98A] to-slate-300 bg-clip-text text-transparent">
         Portfolio showcase
        </h2>
        <p className="text-xs sm:text-sm font-body text-neutral-300 max-w-xl mx-auto font-light leading-relaxed mt-2">
          Real commercial, editorial, and creative productions curated directly by Honesty Visuals.
        </p>
        <div className="h-[1px] w-16 bg-[#EED98A] mx-auto mt-4" />
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10 sm:mb-12">
        <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest w-full lg:w-auto">
          <button
            onClick={() => setSelectedCatId('ALL')}
            className={`px-3.5 sm:px-4 py-2 rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              selectedCatId === 'ALL'
                ? 'bg-[#EED98A] text-[#0D0D0E] font-bold border border-[#EED98A]'
                : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-[#EED98A]'
            }`}
          >
            <span>All Works</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${selectedCatId === 'ALL' ? 'bg-[#0D0D0E] text-[#EED98A] font-bold' : 'bg-black/50 text-neutral-400'}`}>
              {items.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            const isActive = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#EED98A] text-[#0D0D0E] font-bold border border-[#EED98A]'
                    : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-[#EED98A]'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${isActive ? 'bg-[#0D0D0E] text-[#EED98A] font-bold' : 'bg-black/50 text-neutral-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72 lg:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search published works..."
            className="w-full bg-neutral-900 border border-white/10 rounded-sm pl-9 pr-8 py-2 text-xs font-body text-white focus:outline-none focus:border-[#EED98A] transition shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#EED98A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Loading portfolio database...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 sm:py-28 text-center bg-neutral-900/60 border border-white/10 rounded-sm p-8 space-y-4 max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#EED98A]/10 border border-[#EED98A]/30 flex items-center justify-center mx-auto text-[#EED98A]">
            <ImageIcon size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-slate-200 via-[#EED98A] to-slate-300 bg-clip-text text-transparent">
              Portfolio Coming Soon
            </h3>
            <p className="text-xs sm:text-sm font-body text-neutral-400 max-w-md mx-auto font-light leading-relaxed">
              We are currently finalizing our latest published commercial and creative showcase.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  onOpenItem({
                    id: item.id,
                    title: item.title || 'Honesty Visuals Production',
                    category: item.categoryId,
                    categoryLabel: item.categoryName || 'Gallery',
                    imageUrl: item.imageUrl,
                    mediaUrl: item.mediaUrl || item.imageUrl,
                    type: item.type || 'image',
                    description: item.description || 'Commercial portfolio production by Honesty Visuals.'
                  })
                }
                className="portfolio-item relative aspect-[4/5] bg-neutral-900 group overflow-hidden border border-white/10 rounded-sm cursor-pointer transition-all duration-500 hover:border-[#EED98A] shadow-xl"
              >
                {item.type === 'video' ? (
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                    <video
                      src={item.mediaUrl || item.imageUrl}
                      poster={item.thumbnailUrl || item.imageUrl}
                      preload="metadata"
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono font-bold text-[#EED98A] border border-white/10 flex items-center gap-1 z-10">
                      <Video size={11} />
                      <span>VIDEO</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/60 border border-[#EED98A]/50 text-[#EED98A] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#EED98A] group-hover:text-black transition-all duration-300">
                        <Play size={20} className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <OptimizedImage
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.title || 'Honesty Visuals Work'}
                    widthParam={600}
                    qualityParam={80}
                    containerClassName="absolute inset-0 w-full h-full"
                    className="w-full h-full object-cover object-center grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0E] via-[#0D0D0E]/30 to-transparent opacity-90 group-hover:opacity-80 transition-all duration-500 pointer-events-none" />

                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-neutral-900/90 backdrop-blur-md text-[#EED98A] w-8 h-8 flex items-center justify-center rounded-sm border border-white/10 group-hover:bg-[#EED98A] group-hover:text-[#0D0D0E] transition-all duration-300 shadow-md">
                    <Sparkles size={13} />
                  </div>
                </div>

                {/* Portfolio Card Title: Silver-Gold Gradient */}
                <div className="absolute bottom-0 left-0 w-full p-6 space-y-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 z-10">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#EED98A]">
                    {item.categoryName || 'Portfolio'}
                  </p>
                  <h3 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-slate-200 via-[#EED98A] to-slate-300 bg-clip-text text-transparent group-hover:from-[#EED98A] group-hover:via-amber-200 group-hover:to-[#EED98A] transition-all duration-300 leading-tight">
                    {item.title || 'Untitled Work'}
                  </h3>
                  {item.description && (
                    <p className="text-xs font-body text-neutral-300 font-light line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filteredItems.length && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                className="bg-neutral-900 border border-[#EED98A]/50 text-[#EED98A] hover:bg-[#EED98A] hover:text-[#0D0D0E] font-mono font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#EED98A]/20"
              >
                Load More Works ({filteredItems.length - visibleCount} Remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};