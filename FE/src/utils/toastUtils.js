import toast from 'react-hot-toast';

// Cache untuk mencegah duplicate toasts
const toastCache = new Map();
const TOAST_CACHE_DURATION = 2000; // 2 detik

// Fungsi untuk show toast dengan duplicate prevention
export const showToast = (message, type = 'default', options = {}) => {
  const cacheKey = `${type}:${message}`;
  const now = Date.now();
  
  // Cek apakah toast yang sama sudah ditampilkan dalam 2 detik terakhir
  if (toastCache.has(cacheKey)) {
    const lastShown = toastCache.get(cacheKey);
    if (now - lastShown < TOAST_CACHE_DURATION) {
      return; // Skip jika duplicate
    }
  }
  
  // Simpan timestamp
  toastCache.set(cacheKey, now);
  
  // Cleanup cache secara berkala
  setTimeout(() => {
    toastCache.delete(cacheKey);
  }, TOAST_CACHE_DURATION);
  
  // Show toast berdasarkan type
  switch (type) {
    case 'success':
      return toast.success(message, {
        id: cacheKey, // Gunakan cache key sebagai ID unik
        ...options
      });
    case 'error':
      return toast.error(message, {
        id: cacheKey,
        ...options
      });
    case 'loading':
      return toast.loading(message, {
        id: cacheKey,
        ...options
      });
    default:
      return toast(message, {
        id: cacheKey,
        ...options
      });
  }
};

// Fungsi untuk dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Fungsi untuk dismiss semua toast
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Fungsi khusus untuk error handling
export const showErrorToast = (error, fallbackMessage = 'Terjadi kesalahan') => {
  let message = fallbackMessage;
  
  if (typeof error === 'string') {
    message = error;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }
  
  showToast(message, 'error');
};

// Fungsi untuk success message
export const showSuccessToast = (message) => {
  showToast(message, 'success');
};

// Fungsi untuk loading toast
export const showLoadingToast = (message = 'Loading...') => {
  return showToast(message, 'loading');
};

export default showToast;
