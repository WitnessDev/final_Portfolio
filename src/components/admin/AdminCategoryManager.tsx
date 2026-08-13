import React, { useState, useEffect } from 'react';
import { Category, getCategories, addCategory, updateCategory, deleteCategory, seedDefaultCategories } from '../../lib/portfolioService';
import { FolderPlus, Edit2, Trash2, Check, X, Sparkles, Folder } from 'lucide-react';

export const AdminCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await addCategory(newCatName.trim());
      setNewCatName('');
      setMessage('Category created successfully!');
      setTimeout(() => setMessage(null), 3000);
      loadCategories();
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await updateCategory(id, editingName.trim());
      setEditingId(null);
      loadCategories();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Existing photographs in this category will remain, but will need to be re-assigned.`)) {
      return;
    }
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    await seedDefaultCategories();
    await loadCategories();
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[#EED98A] uppercase font-bold">
            CATEGORY ARCHITECTURE
          </p>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            Portfolio Categories
          </h3>
        </div>

        {categories.length === 0 && (
          <button
            onClick={handleSeedDefaults}
            className="bg-[#EED98A] text-[#0D0D0E] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Generate Standard Categories</span>
          </button>
        )}
      </div>

      {message && (
        <div className="p-3 bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs rounded flex items-center gap-2">
          <Check size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Add Category Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="New Category Name (e.g. Fashion, Wildlife, Corporate)"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#EED98A]"
        />
        <button
          type="submit"
          className="bg-[#EED98A] text-[#0D0D0E] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-white transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <FolderPlus size={16} />
          <span>Add Category</span>
        </button>
      </form>

      {/* Category List Table */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">
          Active Categories ({categories.length})
        </p>

        {loading ? (
          <div className="py-8 text-center text-xs text-neutral-400 font-mono animate-pulse">
            Loading database categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center bg-neutral-950 border border-white/10 rounded space-y-2">
            <Folder size={32} className="mx-auto text-neutral-600" />
            <p className="text-xs text-neutral-400">No categories created yet.</p>
            <p className="text-[11px] text-neutral-500 font-light">
              Create a category above or click "Generate Standard Categories".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 bg-neutral-950 border border-white/10 rounded group hover:border-white/20 transition"
              >
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="bg-neutral-900 border border-white/30 text-xs text-white rounded px-3 py-1 flex-1 focus:outline-none focus:border-[#EED98A]"
                    />
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500 transition"
                      title="Save"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-white transition"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Folder size={16} className="text-[#EED98A]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        ({cat.slug})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 rounded bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                        title="Edit name"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded bg-neutral-900 border border-white/10 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
