import React, { useState } from 'react';
import { PortfolioItem, Category, updatePortfolioItem, deletePortfolioItem } from '../../lib/portfolioService';
import { X, Save, Trash2, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminPhotoEditModalProps {
  item: PortfolioItem;
  categories: Category[];
  onClose: () => void;
  onUpdated: () => void;
}

export const AdminPhotoEditModal: React.FC<AdminPhotoEditModalProps> = ({
  item,
  categories,
  onClose,
  onUpdated
}) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [published, setPublished] = useState(item.published);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const activeCat = categories.find((c) => c.id === categoryId);
      const categoryName = activeCat ? activeCat.name : item.categoryName;

      await updatePortfolioItem(item.id, {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        categoryName,
        published
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to update photo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this photograph from the portfolio?')) {
      return;
    }
    setDeleting(true);
    setError('');

    try {
      await deletePortfolioItem(item.id, item.storagePath);
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete photo.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D0D0E] border border-white/10 rounded-sm max-w-xl w-full p-6 space-y-6 relative text-white max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-[#EED98A] uppercase font-bold">
              EDIT PHOTOGRAPH
            </p>
            <h3 className="text-xl font-display font-bold text-white">
              {item.title || 'Untitled Image'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/30 text-red-300 text-xs rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Thumbnail Preview */}
        <div className="w-full h-48 rounded bg-black border border-white/10 overflow-hidden relative">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 text-[10px] font-mono font-bold text-[#EED98A] border border-white/10">
            {published ? 'PUBLISHED' : 'UNPUBLISHED DRAFT'}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-[#EED98A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-[#EED98A]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-[#EED98A]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-neutral-950 border border-white/10 rounded">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Public Visibility
              </p>
              <p className="text-[11px] text-neutral-400 font-light">
                {published ? 'Visible in public portfolio' : 'Hidden from public portfolio'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                published
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 border border-white/10'
              }`}
            >
              {published ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{published ? 'Published' : 'Draft'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center gap-3">
            <button
              type="button"
              disabled={deleting || saving}
              onClick={handleDelete}
              className="px-4 py-2.5 rounded bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider hover:bg-red-900 transition flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded bg-neutral-900 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className="px-6 py-2.5 rounded bg-[#EED98A] text-[#0D0D0E] text-xs font-bold uppercase tracking-widest hover:bg-white transition flex items-center gap-2 cursor-pointer"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
