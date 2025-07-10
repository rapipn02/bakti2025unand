// API functions for Absen management
import api from './api';

// Get all absen data
export const getAbsenList = async () => {
  try {
    const response = await api.get('/absen/');
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Get Absen List Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch absen list'
    };
  }
};

// Add new absen
export const addAbsen = async (absenData) => {
  try {
    const response = await api.post('/absen/', absenData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Add Absen Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add absen'
    };
  }
};

// Edit absen
export const editAbsen = async (absenData) => {
  try {
    const response = await api.put('/absen/', absenData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Edit Absen Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to edit absen'
    };
  }
};

// Delete absen
export const deleteAbsen = async (absenId) => {
  try {
    const response = await api.delete(`/absen/?id=${absenId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Delete Absen Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete absen'
    };
  }
};

// Add absensi (attendance record)
export const addAbsensi = async (absensiData) => {
  try {
    const response = await api.post('/absen/absensi', absensiData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Add Absensi Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add absensi'
    };
  }
};

// Admin scan QR participant
export const adminScanQR = async (scanData) => {
  try {
    const response = await api.post('/absen/admin/scan', scanData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Admin Scan QR Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to scan QR'
    };
  }
};

// QR Scan functions
export const scanQRForAbsensi = async (qrData, absenId, kelompokId) => {
  try {
    // Validate QR data first
    const validation = validateQRData(qrData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }
    
    // Use UUID if available, otherwise use NIM
    const participantIdentifier = validation.uuid || validation.nim;
    
    const response = await api.post('/absen/admin/scan', {
      participantIdentifier: participantIdentifier,
      absenId: absenId,
      id_kelompok: kelompokId
    });
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('QR Scan Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to process QR scan'
    };
  }
};

// Get kelompok list for QR generation
export const getKelompokList = async () => {
  try {
    const response = await api.get('/kelompok/');
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Get Kelompok List Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch kelompok list'
    };
  }
};

// Generate QR data for student - using UUID for better security and accuracy
export const generateStudentQR = async (nim, kelompok) => {
  try {
    // First, get the anggota ID (UUID) from the database
    const response = await api.get(`/kelompok/anggota/by-nim/${nim}`);
    if (response.data.success && response.data.data) {
      // Use the UUID from database
      return response.data.data.id;
    } else {
      // Fallback to old format if UUID not found
      return `${nim}-${kelompok}`;
    }
  } catch (error) {
    console.warn('Could not get UUID for NIM, using fallback format:', error);
    // Fallback to old format
    return `${nim}-${kelompok}`;
  }
};

// Validate QR data format
export const validateQRData = (qrData) => {
  if (!qrData || typeof qrData !== 'string') {
    return { valid: false, error: 'Invalid QR data format' };
  }
  
  // Support UUID format (36 characters with dashes)
  if (qrData.length === 36 && qrData.split('-').length === 5) {
    return { 
      valid: true, 
      uuid: qrData,
      nim: null,
      kelompok: null 
    };
  }
  
  // Support nim-kelompok or nim format
  const parts = qrData.split('-');
  if (parts.length < 1 || parts.length > 2) {
    return { valid: false, error: 'QR data must be in format: uuid, nim-kelompok or nim' };
  }
  
  const nim = parts[0];
  const kelompok = parts[1];
  
  if (!nim || nim.length < 5) {
    return { valid: false, error: 'Invalid NIM format' };
  }
  
  if (kelompok && isNaN(parseInt(kelompok))) {
    return { valid: false, error: 'Invalid kelompok format' };
  }
  
  return { 
    valid: true, 
    uuid: null,
    nim, 
    kelompok: kelompok ? parseInt(kelompok) : null 
  };
};

// Update status kehadiran anggota
export const updateStatusKehadiran = async (updateData) => {
  try {
    const response = await api.put('/absen/status', updateData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Update Status Kehadiran Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update status kehadiran'
    };
  }
};
