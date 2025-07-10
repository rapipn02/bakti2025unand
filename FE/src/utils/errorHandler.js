// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || error.response.data?.error || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};

import toast from 'react-hot-toast';

// Toast notification helper
export const showToast = (message, type = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#white',
        },
      });
      break;
    case 'error':
      toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#white',
        },
      });
      break;
    case 'loading':
      return toast.loading(message, {
        position: 'top-right',
      });
    default:
      toast(message, {
        duration: 3000,
        position: 'top-right',
      });
  }
};
