// API functions for Tugas management
import api from './api';

// Get all tugas (assignments)
export const getTugasList = async () => {
  try {
    const response = await api.get('/tugas/');
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Get Tugas List Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch tugas list'
    };
  }
};

// Get all kumpul tugas (submitted assignments)
export const getKumpulTugasList = async (page) => {
  try {
    const url = page ? `/tugas/kumpul/all?page=${page}` : '/tugas/kumpul/all';
    const response = await api.get(url);
    return {
      success: true,
      data: response.data.data,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error('Get Kumpul Tugas List Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch kumpul tugas list'
    };
  }
};

// Get kumpul tugas by kelompok and tugas
export const getKumpulTugasByKelompok = async (kelompok, tugas, page) => {
  try {
    let url = `/tugas/kumpul?kelompok=${kelompok}&tugas=${tugas}`;
    if (page) {
      url += `&page=${page}`;
    }
    const response = await api.get(url);
    return {
      success: true,
      data: response.data.data,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error('Get Kumpul Tugas by Kelompok Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch kumpul tugas by kelompok'
    };
  }
};

// Search kumpul tugas by kelompok with name or nim filter
export const searchKumpulTugasByKelompok = async (kelompok, searchBy, searchValue, page) => {
  try {
    let url = `/tugas/kumpul/search?kelompok=${kelompok}`;
    if (searchBy === 'nama' && searchValue) {
      url += `&nama=${encodeURIComponent(searchValue)}`;
    } else if (searchBy === 'nim' && searchValue) {
      url += `&nim=${encodeURIComponent(searchValue)}`;
    }
    if (page) {
      url += `&page=${page}`;
    }
    const response = await api.get(url);
    return {
      success: true,
      data: response.data.data,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    console.error('Search Kumpul Tugas Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to search kumpul tugas'
    };
  }
};

// Add new tugas
export const addTugas = async (tugasData) => {
  try {
    // Pastikan deadline ISO string
    let deadline = tugasData.deadline;
    if (deadline && !deadline.includes('T')) {
      deadline = deadline + 'T00:00:00.000Z';
    }
    const response = await api.post('/tugas/', {
      ...tugasData,
      deadline
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Add Tugas Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add tugas'
    };
  }
};

// Edit tugas
export const editTugas = async (tugasData) => {
  try {
    const response = await api.put('/tugas/', tugasData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Edit Tugas Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to edit tugas'
    };
  }
};

// Delete tugas
export const deleteTugas = async (tugasId) => {
  try {
    const response = await api.delete(`/tugas/?id=${tugasId}`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Delete Tugas Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete tugas'
    };
  }
};

// Submit tugas (kumpul tugas)
export const submitTugas = async (tugasData) => {
  try {
    const response = await api.post('/tugas/kumpul/', tugasData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Submit Tugas Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to submit tugas'
    };
  }
};

// Edit submitted tugas (kumpul tugas)
export const editKumpulTugas = async (tugasData) => {
  try {
    const response = await api.put('/tugas/kumpul/', tugasData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Edit Kumpul Tugas Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to edit kumpul tugas'
    };
  }
};
