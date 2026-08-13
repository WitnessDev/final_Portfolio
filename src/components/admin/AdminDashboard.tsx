import React, { useState, useEffect } from 'react';
import { signOut, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import {
  PortfolioItem,
  Category,
  getAllPortfolioAdmin,
  getCategories,
  togglePublishStatus,
  deletePortfolioItem
} from '../../lib/portfolioService';
import { AdminPhotoUpload } from './AdminPhotoUpload';
import { AdminPhotoEditModal } from './AdminPhotoEditModal';
import { AdminCategoryManager } from './AdminCategoryManager';
import {
  LayoutDashboard,
  Upload,
  Video,
  FolderTree,
  LogOut,
  ExternalLink,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Shield,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onSignOut: () => void;
  onViewPublic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onSignOut,
  onViewPublic
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'upload-photos' | 'upload-videos' | 'categories' | 'settings'>('photos');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPublish, setFilterPublish] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Modal editing
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [items, cats] = await Promise.all([
      getAllPortfolioAdmin(),
      getCategories()
    ]);
    setPortfolioItems(items);
    setCategories(cats);
    setLoading(false);
  };

  const handleTogglePublish = async (item: PortfolioItem) => {
    try {
      const newStatus = await togglePublishStatus(item.id, item.published);
      setPortfolioItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, published: newStatus } : i))
      );
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleDeleteItem = async (item: PortfolioItem) => {
    if (!window.confirm(`Delete photograph "${item.title || 'Untitled'}"?`)) return;
    try {
      await deletePortfolioItem(item.id, item.storagePath);
      setPortfolioItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSignOutClick = async () => {
    await signOut(auth);
    onSignOut();
  };

  // Filter items
  const filteredItems = portfolioItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === 'ALL' || item.categoryId === filterCategory;

    const matchesPublish =
      filterPublish === 'ALL' ||
      (filterPublish === 'PUBLISHED' && item.published) ||
      (filterPublish === 'DRAFT' && !item.published);

    return matchesSearch && matchesCategory && matchesPublish;
  });

  const totalPhotos = portfolioItems.length;
  const publishedPhotos = portfolioItems.filter((i) => i.published).length;
  const draftPhotos = totalPhotos - publishedPhotos;

  return (
    <div className="min-h-screen bg-[#0D0D0E] text-white flex flex-col md:flex-row">
      {/* Sidebar for Desktop / Header for Mobile */}
      <aside className="w-full md:w-64 bg-neutral-900 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Logo & Mobile Bar */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <a
                href="#home"
                onClick={onViewPublic}
                className="text-base font-display font-black tracking-widest text-white uppercase"
              >
                <span>HONESTY</span> <span className="text-[#EED98A]">CMS</span>
              </a>
              <p className="text-[10px] text-neutral-400 font-mono">Portfolio Control Panel</p>
            </div>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 text-white hover:text-[#EED98A]"
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={`${
              mobileNavOpen ? 'block' : 'hidden md:block'
            } p-4 space-y-1.5`}
          >
            <button
              onClick={() => {
                setActiveTab('photos');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>All Media ({totalPhotos})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('upload-photos');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'upload-photos'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Upload size={16} />
              <span>Upload Photos</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('upload-videos');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'upload-videos'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Video size={16} />
              <span>Upload Videos</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <FolderTree size={16} />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#EED98A] text-[#0D0D0E]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Shield size={16} />
              <span>Admin Account</span>
            </button>
          </nav>
        </div>

        {/* User Info & Actions Footer */}
        <div className={`${mobileNavOpen ? 'block' : 'hidden md:block'} p-4 border-t border-white/10 space-y-3`}>
          <div className="p-2.5 rounded bg-neutral-950 border border-white/10 text-xs text-neutral-300">
            <p className="text-[10px] font-mono text-neutral-500 uppercase">Signed in as</p>
            <p className="font-mono truncate font-bold text-white">{user.email}</p>
          </div>

          <button
            onClick={onViewPublic}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 text-xs uppercase tracking-wider font-bold transition cursor-pointer"
          >
            <ExternalLink size={14} />
            <span>Public Website</span>
          </button>

          <button
            onClick={handleSignOutClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 hover:bg-red-900 text-xs uppercase tracking-wider font-bold transition cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Top Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 bg-neutral-900 border border-white/10 rounded-sm">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Total Photographs
            </p>
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#EED98A] mt-1">
              {totalPhotos}
            </p>
          </div>

          <div className="p-4 bg-neutral-900 border border-white/10 rounded-sm">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Published Live
            </p>
            <p className="text-2xl sm:text-3xl font-display font-bold text-emerald-400 mt-1">
              {publishedPhotos}
            </p>
          </div>

          <div className="p-4 bg-neutral-900 border border-white/10 rounded-sm">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Unpublished Drafts
            </p>
            <p className="text-2xl sm:text-3xl font-display font-bold text-amber-400 mt-1">
              {draftPhotos}
            </p>
          </div>

          <div className="p-4 bg-neutral-900 border border-white/10 rounded-sm">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Categories
            </p>
            <p className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              {categories.length}
            </p>
          </div>
        </div>

        {/* Tab 1: Photos List & Management */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-neutral-900 p-4 border border-white/10 rounded-sm">
              {/* Search input */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search titles, descriptions, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/15 rounded pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#EED98A]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-neutral-950 border border-white/15 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EED98A]"
                >
                  <option value="ALL">All Categories ({categories.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filterPublish}
                  onChange={(e) => setFilterPublish(e.target.value as any)}
                  className="bg-neutral-950 border border-white/15 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EED98A]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published Only</option>
                  <option value="DRAFT">Drafts Only</option>
                </select>

                <button
                  onClick={() => setActiveTab('upload-photos')}
                  className="bg-[#EED98A] text-[#0D0D0E] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded hover:bg-white transition flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Upload size={14} />
                  <span>+ Upload Media</span>
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            {loading ? (
              <div className="py-16 text-center text-xs font-mono text-neutral-400 animate-pulse">
                Loading portfolio database...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900 border border-white/10 rounded-sm space-y-3">
                <ImageIcon size={36} className="mx-auto text-neutral-600" />
                <h4 className="text-lg font-display font-bold text-white">No Photographs Found</h4>
                <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
                  {portfolioItems.length === 0
                    ? 'Your portfolio database is currently empty. Click "Upload Photos" above to start publishing photography.'
                    : 'No photographs match your current search and filter criteria.'}
                </p>
                {portfolioItems.length === 0 && (
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="inline-flex items-center gap-2 bg-[#EED98A] text-[#0D0D0E] font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded hover:bg-white transition cursor-pointer mt-2"
                  >
                    <Upload size={14} /> Upload First Photograph
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-900 border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#EED98A] transition-all"
                  >
                    <div className="relative aspect-4/3 bg-black overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono font-bold text-[#EED98A] border border-white/10">
                        {item.categoryName || 'Uncategorized'}
                      </div>
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition border border-white/10 cursor-pointer ${
                          item.published
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-950/90 text-amber-300 border-amber-500/30'
                        }`}
                        title="Click to toggle published / draft state"
                      >
                        {item.published ? 'Live' : 'Draft'}
                      </button>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white truncate">
                          {item.title || 'Untitled Photograph'}
                        </h5>
                        {item.description && (
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 font-light">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {item.published ? (
                            <>
                              <EyeOff size={13} /> Unpublish
                            </>
                          ) : (
                            <>
                              <Eye size={13} /> Publish
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded bg-neutral-950 border border-white/10 text-neutral-300 hover:text-white hover:border-[#EED98A] transition cursor-pointer"
                            title="Edit details"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1.5 rounded bg-neutral-950 border border-white/10 text-neutral-300 hover:text-red-400 transition cursor-pointer"
                            title="Delete photograph"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Upload Photos */}
        {activeTab === 'upload-photos' && (
          <AdminPhotoUpload
            initialType="image"
            onSuccess={() => {
              loadData();
              setActiveTab('photos');
            }}
          />
        )}

        {/* Tab: Upload Videos */}
        {activeTab === 'upload-videos' && (
          <AdminPhotoUpload
            initialType="video"
            onSuccess={() => {
              loadData();
              setActiveTab('photos');
            }}
          />
        )}

        {/* Tab 3: Categories */}
        {activeTab === 'categories' && <AdminCategoryManager />}

        {/* Tab 4: Settings & Account */}
        {activeTab === 'settings' && (
          <div className="bg-neutral-900 border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <p className="text-[10px] font-mono tracking-widest text-[#EED98A] uppercase font-bold">
                SYSTEM CONFIGURATION
              </p>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                Admin Master Account
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-neutral-950 border border-white/10 rounded space-y-1">
                <p className="text-[10px] font-mono uppercase text-neutral-500">Authenticated Admin Email</p>
                <p className="text-sm font-mono font-bold text-white">{user.email}</p>
                <p className="text-[11px] font-mono text-neutral-400">UID: {user.uid}</p>
              </div>

              <div className="p-4 bg-neutral-950 border border-white/10 rounded space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Firebase Backend Connection
                </p>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 size={14} /> Cloud Firestore & Auth Active
                </p>
                <p className="text-[11px] text-neutral-400 font-light">
                  All uploads, published photographs, and category changes synchronize instantly to the public site.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={onViewPublic}
                  className="bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-neutral-700 transition"
                >
                  Preview Public Portfolio
                </button>

                <button
                  onClick={handleSignOutClick}
                  className="bg-red-950/80 border border-red-500/30 text-red-300 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-red-900 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <AdminPhotoEditModal
          item={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
          onUpdated={() => {
            loadData();
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};
