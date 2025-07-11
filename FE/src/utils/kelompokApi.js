// API functions for Kelompok management
import api from './api';

// Get all kelompok data
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

// Get kelompok with anggota
export const getKelompokWithAnggota = async () => {
  try {
    const response = await api.get('/kelompok/?anggota=true');
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Get Kelompok with Anggota Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch kelompok with anggota'
    };
  }
};

// Add new kelompok
export const addKelompok = async (kelompokData) => {
  try {
    const response = await api.post('/kelompok/', kelompokData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Add Kelompok Error:', error);
    // Tangani error validasi (400) dengan pesan khusus
    if (error.response && error.response.status === 400) {
      return {
        success: false,
        error: error.response.data.message || 'Kelompok sudah ada'
      };
    }
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add kelompok'
    };
  }
};

// Delete kelompok
export const deleteKelompok = async (kelompokId) => {
  try {
    const response = await api.delete(`/kelompok/?id=${kelompokId}`);
    return {
      success: true,
      data: response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Delete Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete kelompok'
    };
  }
};

// Get anggota kelompok by kelompok ID
export const getAnggotaKelompokById = async (kelompokId) => {
  try {
    const response = await api.get(`/kelompok/anggota?kelompok=${kelompokId}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Get Anggota Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch anggota kelompok'
    };
  }
};

// Get all anggota kelompok
export const getAllAnggotaKelompok = async () => {
  try {
    const response = await api.get('/kelompok/anggota/all');
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Get All Anggota Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch all anggota kelompok'
    };
  }
};

// Add anggota kelompok
export const addAnggotaKelompok = async (anggotaData) => {
  try {
    const response = await api.post('/kelompok/anggota', anggotaData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Add Anggota Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add anggota kelompok'
    };
  }
};

// Edit anggota kelompok
export const editAnggotaKelompok = async (anggotaData) => {
  try {
    const response = await api.put('/kelompok/anggota', anggotaData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Anggota berhasil diupdate'
    };
  } catch (error) {
    console.error('Edit Anggota Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to edit anggota kelompok'
    };
  }
};

// Delete anggota kelompok
export const deleteAnggotaKelompok = async (anggotaId) => {
  try {
    const response = await api.delete('/kelompok/anggota', {
      params: { id: anggotaId }
    });
    return {
      success: true,
      message: response.data.message || 'Anggota berhasil dihapus'
    };
  } catch (error) {
    console.error('Delete Anggota Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete anggota kelompok'
    };
  }
};

// Generate QR for anggota
export const generateAnggotaQR = async (anggotaId) => {
  try {
    const response = await api.get(`/kelompok/anggota/${anggotaId}/qr`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Generate Anggota QR Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to generate QR code'
    };
  }
};

// Search anggota kelompok
export const searchAnggotaKelompok = async (searchParams) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await api.get(`/kelompok/anggota/search?${queryString}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Search Anggota Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to search anggota kelompok'
    };
  }
};
