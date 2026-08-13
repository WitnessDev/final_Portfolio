import React, { useState, useEffect } from 'react';
import { Category, getCategories, uploadPortfolioMedia, addPortfolioItem, addCategory } from '../../lib/portfolioService';
import { Upload, Plus, Image as ImageIcon, Video, Check, AlertCircle, X, Sparkles, FolderPlus } from 'lucide-react';

interface AdminPhotoUploadProps {
  onSuccess: () => void;
  initialType?: 'image' | 'video';
}

export const AdminPhotoUpload: React.FC<AdminPhotoUploadProps> = ({ onSuccess, initialType = 'image' }) => {
  const [mediaTypeTab, setMediaTypeTab] = useState<'image' | 'video'>(initialType);

  useEffect(() => {
    setMediaTypeTab(initialType);
  }, [initialType]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // File state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);

  // Progress & Status
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
    if (cats.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(cats[0].id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      // Generate object URL previews
      const newPreviews = filesArray.map((file: File) => {
        const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi)$/i.test(file.name);
        return {
          url: URL.createObjectURL(file as Blob),
          type: (isVid ? 'video' : 'image') as 'image' | 'video'
        };
      });
      setPreviews(newPreviews);
      setMessage(null);
    }
  };

  const handleCreateCategoryInline = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const cat = await addCategory(newCategoryName.trim());
      setCategories((prev) => [...prev, cat]);
      setSelectedCategoryId(cat.id);
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setMessage({ type: 'error', text: `Please select at least one ${mediaTypeTab === 'video' ? 'video' : 'photo'} to upload.` });
      return;
    }
    if (!selectedCategoryId) {
      setMessage({ type: 'error', text: 'Please select or create a category.' });
      return;
    }

    setUploading(true);
    setMessage(null);
    setUploadProgress(10);

    const activeCat = categories.find((c) => c.id === selectedCategoryId);
    const categoryName = activeCat ? activeCat.name : 'General';

    try {
      let uploadedCount = 0;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Progress step
        setUploadProgress(Math.round(((i + 0.3) / selectedFiles.length) * 100));

        // Upload to Storage or fallback
        const { url, thumbnailUrl, path, type: detectedType } = await uploadPortfolioMedia(file, (pct) => {
          setUploadProgress(Math.round(((i + pct / 100) / selectedFiles.length) * 100));
        });

        const itemTitle = selectedFiles.length === 1 && title.trim()
          ? title.trim()
          : file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

        // Save metadata to Firestore
        await addPortfolioItem({
          title: itemTitle,
          description: description.trim(),
          imageUrl: url,
          thumbnailUrl: thumbnailUrl || url,
          mediaUrl: url,
          type: detectedType || mediaTypeTab,
          storagePath: path,
          categoryId: selectedCategoryId,
          categoryName,
          published,
          order: Date.now() + i
        });

        uploadedCount++;
      }

      setUploadProgress(100);
      setMessage({
        type: 'success',
        text: `Successfully uploaded ${uploadedCount} ${mediaTypeTab === 'video' ? 'video' : 'photo'}${uploadedCount > 1 ? 's' : ''}!`
      });

      // Reset form
      setSelectedFiles([]);
      setPreviews([]);
      setTitle('');
      setDescription('');
      onSuccess();
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: `Upload failed: ${error.message || 'Error saving media.'}`
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[#EED98A] uppercase font-bold">
            MEDIA MANAGEMENT
          </p>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            Upload Portfolio Media
          </h3>
        </div>

        {/* Upload Mode Selector */}
        <div className="flex bg-neutral-950 p-1 rounded border border-white/10 gap-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setMediaTypeTab('image');
              setSelectedFiles([]);
              setPreviews([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition ${
              mediaTypeTab === 'image'
                ? 'bg-[#EED98A] text-[#0D0D0E]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon size={14} />
            <span>Upload Photo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaTypeTab('video');
              setSelectedFiles([]);
              setPreviews([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition ${
              mediaTypeTab === 'video'
                ? 'bg-[#EED98A] text-[#0D0D0E]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Video size={14} />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded text-xs flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/80 border border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Select Category *
            </label>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-[11px] text-[#EED98A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FolderPlus size={13} />
              <span>{showAddCategory ? 'Cancel' : '+ New Category'}</span>
            </button>
          </div>

          {showAddCategory && (
            <div className="flex gap-2 p-3 bg-neutral-950 border border-white/10 rounded my-2">
              <input
                type="text"
                placeholder="Category Name (e.g. Commercial, Drone, Events)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-neutral-900 border border-white/15 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#EED98A]"
              />
              <button
                type="button"
                onClick={handleCreateCategoryInline}
                className="bg-[#EED98A] text-[#0D0D0E] font-bold text-xs px-4 py-1.5 rounded hover:bg-white transition"
              >
                Save Category
              </button>
            </div>
          )}

          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-[#EED98A]"
          >
            {categories.length === 0 ? (
              <option value="">No categories created yet</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Drag & Drop File Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            {mediaTypeTab === 'video' ? 'Video File(s) *' : 'Photograph File(s) *'}
          </label>
          <div className="border-2 border-dashed border-white/20 hover:border-[#EED98A] transition rounded-sm p-8 text-center bg-neutral-950/50 relative cursor-pointer group">
            <input
              type="file"
              accept={
                mediaTypeTab === 'video'
                  ? 'video/mp4,video/webm,video/quicktime,video/*'
                  : 'image/jpeg,image/jpg,image/png,image/webp,image/*'
              }
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 text-[#EED98A] flex items-center justify-center mx-auto group-hover:scale-110 transition">
                {mediaTypeTab === 'video' ? <Video size={22} /> : <Upload size={22} />}
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Click or drag {mediaTypeTab === 'video' ? 'video' : 'photo'} file(s) here
              </p>
              <p className="text-[11px] text-neutral-400 font-light">
                {mediaTypeTab === 'video'
                  ? 'Supports MP4, WEBM, MOV high resolution video files'
                  : 'Supports JPG, JPEG, PNG, WEBP high resolution imagery'}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Previews */}
        {previews.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Selected Media Previews ({previews.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previews.map((item, idx) => (
                <div key={idx} className="relative aspect-square rounded bg-black border border-white/10 overflow-hidden group">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const newF = [...selectedFiles];
                      newF.splice(idx, 1);
                      setSelectedFiles(newF);
                      const newP = [...previews];
                      newP.splice(idx, 1);
                      setPreviews(newP);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-red-600 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tanzanian Coast Commercial"
              className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#EED98A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Description / Client Details
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 4K Drone direction and ground footage"
              className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#EED98A]"
            />
          </div>
        </div>

        {/* Publishing Status Toggle */}
        <div className="flex items-center justify-between p-4 bg-neutral-950 border border-white/10 rounded">
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Publishing State
            </p>
            <p className="text-[11px] text-neutral-400 font-light">
              {published
                ? 'Visible on public portfolio gallery immediately'
                : 'Saved as draft in admin dashboard'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition ${
              published
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-800 text-neutral-400 border border-white/10'
            }`}
          >
            {published ? 'Published' : 'Draft / Unpublished'}
          </button>
        </div>

        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-neutral-300">
              <span>Uploading to portfolio storage...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-950 rounded overflow-hidden">
              <div
                className="h-full bg-[#EED98A] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || selectedFiles.length === 0}
          className="w-full bg-[#EED98A] text-[#0D0D0E] font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-white transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
        >
          <Upload size={16} />
          <span>Upload & Save {mediaTypeTab === 'video' ? 'Video(s)' : 'Photograph(s)'}</span>
        </button>
      </form>
    </div>
  );
};
