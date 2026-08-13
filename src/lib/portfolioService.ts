import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // High-res / main image
  thumbnailUrl?: string; // Optimized small thumbnail for grid
  mediaUrl?: string; // Explicit mediaUrl for video/full-res
  storagePath?: string;
  type: 'image' | 'video';
  categoryId: string;
  categoryName?: string;
  published: boolean;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

// In-Memory Cache for fast repeat navigation
let cachedPublishedPortfolio: PortfolioItem[] | null = null;
let cachedCategories: Category[] | null = null;

export const clearPortfolioCache = () => {
  cachedPublishedPortfolio = null;
  cachedCategories = null;
};

/**
 * Client-side canvas image compression to WebP/JPEG format
 */
export const compressImageFile = (
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<Blob> => {
  return new Promise((resolve) => {
    // If it's not an image or is SVG/GIF, return original
    if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
};

// Helper to convert file or blob to data URL fallback
const fileToDataUrl = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
  * Upload a photo or video file to Firebase Storage with optimized compression.
  */
export const uploadPortfolioMedia = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; thumbnailUrl?: string; path: string; type: 'image' | 'video' }> => {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi)$/i.test(file.name);
  const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';
  const folder = isVideo ? 'portfolio/videos' : 'portfolio/images';
  const storagePath = `${folder}/${timestamp}_${safeName}`;

  try {
    let uploadPayload: Blob | File = file;
    let thumbnailPayload: Blob | null = null;

    if (!isVideo) {
      // Compress main image
      uploadPayload = await compressImageFile(file, 1920, 1920, 0.85);
      // Generate small grid thumbnail
      thumbnailPayload = await compressImageFile(file, 500, 500, 0.75);
    }

    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, uploadPayload);

    const mainResult = await new Promise<{ url: string; path: string }>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress && snapshot.totalBytes > 0) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(pct);
          }
        },
        async (error) => {
          console.warn('Storage upload error, falling back to Data URL:', error);
          try {
            const dataUrl = await fileToDataUrl(uploadPayload);
            resolve({ url: dataUrl, path: '' });
          } catch (e) {
            reject(e);
          }
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url: downloadUrl, path: storagePath });
        }
      );
    });

    let thumbnailUrl = mainResult.url;
    if (!isVideo && thumbnailPayload) {
      try {
        const thumbPath = `${folder}/thumbs/${timestamp}_thumb_${safeName}`;
        const thumbRef = ref(storage, thumbPath);
        const thumbTask = uploadBytesResumable(thumbRef, thumbnailPayload);
        thumbnailUrl = await new Promise((res) => {
          thumbTask.on('state_changed', null, () => res(mainResult.url), async () => {
            const url = await getDownloadURL(thumbTask.snapshot.ref);
            res(url);
          });
        });
      } catch {
        thumbnailUrl = mainResult.url;
      }
    }

    return { url: mainResult.url, thumbnailUrl, path: mainResult.path, type: mediaType };
  } catch (err) {
    console.warn('Direct upload exception, using Data URL fallback:', err);
    const dataUrl = await fileToDataUrl(file);
    return { url: dataUrl, thumbnailUrl: dataUrl, path: '', type: mediaType };
  }
};

export const uploadPortfolioImage = uploadPortfolioMedia;

// CATEGORIES MANAGEMENT
export const getCategories = async (forceRefresh = false): Promise<Category[]> => {
  if (!forceRefresh && cachedCategories) {
    return cachedCategories;
  }
  try {
    const colRef = collection(db, 'categories');
    const snapshot = await getDocs(colRef);
    const categories: Category[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      categories.push({
        id: docSnap.id,
        name: data.name || '',
        slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || '',
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
        updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now())
      });
    });
    // Sort alphabetically by name
    const sorted = categories.sort((a, b) => a.name.localeCompare(b.name));
    cachedCategories = sorted;
    return sorted;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

export const addCategory = async (name: string): Promise<Category> => {
  clearPortfolioCache();
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const colRef = collection(db, 'categories');
  const docRef = await addDoc(colRef, {
    name: name.trim(),
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return {
    id: docRef.id,
    name: name.trim(),
    slug
  };
};

export const updateCategory = async (id: string, name: string): Promise<void> => {
  clearPortfolioCache();
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, {
    name: name.trim(),
    slug,
    updatedAt: serverTimestamp()
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  clearPortfolioCache();
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
};

export const seedDefaultCategories = async (): Promise<Category[]> => {
  clearPortfolioCache();
  const defaults = ['Portraits', 'Events', 'Wedding', 'Commercial', 'Drone & Aerial'];
  const created: Category[] = [];
  for (const name of defaults) {
    const cat = await addCategory(name);
    created.push(cat);
  }
  return created;
};

// PORTFOLIO MANAGEMENT
export const getPublishedPortfolio = async (forceRefresh = false): Promise<PortfolioItem[]> => {
  if (!forceRefresh && cachedPublishedPortfolio) {
    return cachedPublishedPortfolio;
  }
  try {
    const colRef = collection(db, 'portfolio');
    const q = query(colRef, where('published', '==', true));
    const snapshot = await getDocs(q);
    const items: PortfolioItem[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const mediaUrl = data.mediaUrl || data.imageUrl || '';
      const thumbnailUrl = data.thumbnailUrl || data.imageUrl || mediaUrl;
      const mediaType: 'image' | 'video' = data.type === 'video' ? 'video' : 'image';
      items.push({
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        imageUrl: data.imageUrl || mediaUrl,
        thumbnailUrl: thumbnailUrl,
        mediaUrl: mediaUrl,
        type: mediaType,
        storagePath: data.storagePath || '',
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        published: true,
        order: typeof data.order === 'number' ? data.order : 0,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
        updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now())
      });
    });

    // Sort by order asc, then createdAt desc
    const sorted = items.sort((a, b) => (a.order - b.order) || (b.createdAt || 0) - (a.createdAt || 0));
    cachedPublishedPortfolio = sorted;
    return sorted;
  } catch (error) {
    console.error('Error getting published portfolio:', error);
    return [];
  }
};

export const getAllPortfolioAdmin = async (): Promise<PortfolioItem[]> => {
  try {
    const colRef = collection(db, 'portfolio');
    const snapshot = await getDocs(colRef);
    const items: PortfolioItem[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const mediaUrl = data.mediaUrl || data.imageUrl || '';
      const thumbnailUrl = data.thumbnailUrl || data.imageUrl || mediaUrl;
      const mediaType: 'image' | 'video' = data.type === 'video' ? 'video' : 'image';
      items.push({
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        imageUrl: data.imageUrl || mediaUrl,
        thumbnailUrl: thumbnailUrl,
        mediaUrl: mediaUrl,
        type: mediaType,
        storagePath: data.storagePath || '',
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        published: Boolean(data.published),
        order: typeof data.order === 'number' ? data.order : 0,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
        updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now())
      });
    });

    return items.sort((a, b) => (a.order - b.order) || (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error getting all portfolio for admin:', error);
    return [];
  }
};

export const addPortfolioItem = async (
  itemData: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PortfolioItem> => {
  clearPortfolioCache();
  const colRef = collection(db, 'portfolio');
  const mediaUrl = itemData.mediaUrl || itemData.imageUrl || '';
  const thumbnailUrl = itemData.thumbnailUrl || itemData.imageUrl || mediaUrl;
  const payload = {
    ...itemData,
    imageUrl: itemData.imageUrl || mediaUrl,
    thumbnailUrl: thumbnailUrl,
    mediaUrl: mediaUrl,
    type: itemData.type || 'image',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(colRef, payload);

  return {
    ...itemData,
    imageUrl: itemData.imageUrl || mediaUrl,
    thumbnailUrl: thumbnailUrl,
    mediaUrl: mediaUrl,
    id: docRef.id
  };
};

export const updatePortfolioItem = async (
  id: string,
  updates: Partial<Omit<PortfolioItem, 'id'>>
): Promise<void> => {
  clearPortfolioCache();
  const docRef = doc(db, 'portfolio', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deletePortfolioItem = async (id: string, storagePath?: string): Promise<void> => {
  clearPortfolioCache();
  // Delete doc from firestore
  const docRef = doc(db, 'portfolio', id);
  await deleteDoc(docRef);

  // If storage path exists, attempt to delete file
  if (storagePath) {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (e) {
      console.warn('Failed to delete image from storage:', e);
    }
  }
};

export const togglePublishStatus = async (id: string, currentStatus: boolean): Promise<boolean> => {
  clearPortfolioCache();
  const newStatus = !currentStatus;
  await updatePortfolioItem(id, { published: newStatus });
  return newStatus;
};
