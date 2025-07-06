# API Documentation - BAKTI UNAND Backend

## Base URL
```
http://localhost:3000 (development)
```

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Kelompok Management](#kelompok-management)
4. [Absensi Management](#absensi-management)
5. [Tugas Management](#tugas-management)
6. [React Usage Examples](#react-usage-examples)

---

## Authentication

### Headers Required
For authenticated endpoints, include this header:
```javascript
headers: {
  'Authorization': `bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## User Management

### 1. Register User
**POST** `/auth/`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "account": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "",
    "password": "-"
  },
  "token": "jwt_token_here"
}
```

### 3. Google Login
**POST** `/auth/google-login`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "google_provided_password",
  "image": "google_profile_image_url"
}
```

### 4. Get User Info
**GET** `/auth/`
**Headers:** Authorization required

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "profile_image_url"
    }
  ]
}
```

### 5. Generate Verification Code
**POST** `/auth/generate-code`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### 6. Forgot Password
**POST** `/auth/forgotpassword`

**Request Body:**
```json
{
  "email": "john@example.com",
  "code": "verification_code"
}
```

---

## Kelompok Management

### 1. Get All Kelompok
**GET** `/kelompok/`
**Headers:** Authorization required

**Response:**
```json
{
  "status": 200,
  "message": "Berhasil mengambil data kelompok",
  "data": [
    {
      "id": "uuid",
      "nama_kelompok": "Kelompok 1",
      "anggota_kelompok": [
        {
          "id": "uuid",
          "nama": "Member Name",
          "nim": "123456789",
          "jenis_kelamin": "Laki-laki"
        }
      ]
    }
  ]
}
```

### 2. Add Kelompok
**POST** `/kelompok/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "nama_kelompok": "Kelompok Baru"
}
```

### 3. Delete Kelompok
**DELETE** `/kelompok/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "kelompok_uuid"
}
```

### 4. Get Anggota Kelompok by ID
**GET** `/kelompok/anggota?id_kelompok=uuid`
**Headers:** Authorization required

**Response:**
```json
{
  "status": 200,
  "message": "Berhasil mengambil data anggota kelompok",
  "data": [
    {
      "id": "uuid",
      "nama": "John Doe",
      "nim": "123456789",
      "jenis_kelamin": "Laki-laki",
      "id_kelompok": "kelompok_uuid"
    }
  ]
}
```

### 5. Search Anggota Kelompok
**GET** `/kelompok/anggota/search?id_kelompok=uuid&search=query`
**Headers:** Authorization required

### 6. Get All Anggota Kelompok
**GET** `/kelompok/anggota/all`
**Headers:** Authorization required

### 7. Add Anggota Kelompok
**POST** `/kelompok/anggota`
**Headers:** Authorization required

**Request Body:**
```json
{
  "nama": "John Doe",
  "nim": "123456789",
  "jenis_kelamin": "Laki-laki",
  "id_kelompok": "kelompok_uuid"
}
```

### 8. Edit Anggota Kelompok
**PUT** `/kelompok/anggota`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "anggota_uuid",
  "nama": "Updated Name",
  "nim": "987654321",
  "jenis_kelamin": "Perempuan",
  "id_kelompok": "kelompok_uuid"
}
```

### 9. Delete Anggota Kelompok
**DELETE** `/kelompok/anggota`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "anggota_uuid"
}
```

### 10. Generate QR Code for Anggota
**GET** `/kelompok/anggota/:anggotaId/qr`
**Headers:** Authorization required

**Response:**
```json
{
  "status": 200,
  "message": "QR Code generated successfully",
  "data": {
    "qrCodeData": "anggota_uuid",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

## Absensi Management

### 1. Get All Absen
**GET** `/absen/`
**Headers:** Authorization required

**Response:**
```json
{
  "status": 200,
  "message": "Berhasil mengambil List Absen",
  "data": [
    {
      "id": "uuid",
      "nama_absen": "Absen 1",
      "tanggal": "2025-01-01T00:00:00.000Z",
      "sakit": 0,
      "alfa": 1,
      "hadir": 5,
      "izin": 0,
      "absensi": [
        {
          "id": "uuid",
          "keterangan": "Hadir",
          "id_anggota_kelompok": "anggota_uuid",
          "id_absen": "absen_uuid"
        }
      ]
    }
  ]
}
```

### 2. Add Absen
**POST** `/absen/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "nama_absen": "Absen Hari Ini",
  "tanggal": "2025-01-01"
}
```

### 3. Edit Absen
**PUT** `/absen/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "absen_uuid",
  "nama_absen": "Updated Absen Name",
  "tanggal": "2025-01-02"
}
```

### 4. Delete Absen
**DELETE** `/absen/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "absen_uuid"
}
```

### 5. Add Absensi (User)
**POST** `/absen/absensi`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id_anggota_kelompok": "anggota_uuid",
  "id_absen": "absen_uuid",
  "keterangan": "Hadir"
}
```

**Keterangan Options:** `"Hadir"`, `"Sakit"`, `"Alfa"`, `"Izin"`

### 6. Edit Absensi to Null
**PUT** `/absen/absensi`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "absensi_uuid"
}
```

### 7. Admin Scan QR Code (NEW)
**POST** `/absen/admin/scan`
**Headers:** Authorization required

**Request Body:**
```json
{
  "participantIdentifier": "anggota_uuid_or_nim",
  "absenId": "absen_uuid",
  "id_kelompok": "kelompok_uuid"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Absensi berhasil disimpan untuk John Doe",
  "data": {
    "absensi": {
      "id": "uuid",
      "keterangan": "Hadir",
      "id_anggota_kelompok": "anggota_uuid",
      "id_absen": "absen_uuid"
    },
    "anggota": {
      "nama": "John Doe",
      "nim": "123456789"
    }
  }
}
```

---

## Tugas Management

### 1. Get All Tugas
**GET** `/tugas/`
**Headers:** Authorization required

**Response:**
```json
{
  "status": 200,
  "message": "Berhasil mengambil data tugas",
  "data": [
    {
      "id": "uuid",
      "judul": "Tugas 1",
      "deskripsi": "Deskripsi tugas",
      "deadline": "2025-01-31T23:59:59.000Z"
    }
  ]
}
```

### 2. Add Tugas
**POST** `/tugas/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "judul": "Tugas Baru",
  "deskripsi": "Deskripsi tugas baru",
  "deadline": "2025-01-31T23:59:59.000Z"
}
```

### 3. Edit Tugas
**PUT** `/tugas/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "tugas_uuid",
  "judul": "Updated Tugas",
  "deskripsi": "Updated deskripsi",
  "deadline": "2025-02-28T23:59:59.000Z"
}
```

### 4. Delete Tugas
**DELETE** `/tugas/`
**Headers:** Authorization required

**Request Body:**
```json
{
  "id": "tugas_uuid"
}
```

### 5. Get All Kumpul Tugas (Admin)
**GET** `/tugas/kumpul/all`
**Headers:** Authorization required

### 6. Get Kumpul Tugas by Kelompok
**GET** `/tugas/kumpul?id_kelompok=uuid`
**Headers:** Authorization required

### 7. Search Kumpul Tugas by Kelompok
**GET** `/tugas/kumpul/search?id_kelompok=uuid&search=query`
**Headers:** Authorization required

### 8. Kumpul Tugas (Submit)
**POST** `/tugas/kumpul`
**Headers:** Authorization required
**Content-Type:** `multipart/form-data`

**Form Data:**
```javascript
const formData = new FormData();
formData.append('id_tugas', 'tugas_uuid');
formData.append('nim', '123456789');
formData.append('file', fileObject);
```

### 9. Edit Kumpul Tugas
**PUT** `/tugas/kumpul`
**Headers:** Authorization required
**Content-Type:** `multipart/form-data`

---

## React Usage Examples

### 1. Setup API Client
```javascript
// utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### 2. Authentication Hook
```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { data, token: newToken } = response.data;
      
      setUser(data);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return { user, token, login, logout, loading };
};
```

### 3. QR Scanner Integration
```javascript
// hooks/useQRScanner.js
import { useState } from 'react';
import api from '../utils/api';

export const useQRScanner = () => {
  const [loading, setLoading] = useState(false);

  const scanQRCode = async (participantIdentifier, absenId, id_kelompok) => {
    setLoading(true);
    try {
      const response = await api.post('/absen/admin/scan', {
        participantIdentifier,
        absenId,
        id_kelompok
      });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('QR Scan error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Scan failed'
      };
    } finally {
      setLoading(false);
    }
  };

  return { scanQRCode, loading };
};
```

### 4. Kelompok Management Hook
```javascript
// hooks/useKelompok.js
import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useKelompok = () => {
  const [kelompoks, setKelompoks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchKelompoks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/kelompok/');
      setKelompoks(response.data.data);
    } catch (error) {
      console.error('Fetch kelompoks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addKelompok = async (nama_kelompok) => {
    try {
      const response = await api.post('/kelompok/', { nama_kelompok });
      await fetchKelompoks(); // Refresh list
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add kelompok' 
      };
    }
  };

  const deleteKelompok = async (id) => {
    try {
      await api.delete('/kelompok/', { data: { id } });
      await fetchKelompoks(); // Refresh list
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete kelompok' 
      };
    }
  };

  useEffect(() => {
    fetchKelompoks();
  }, []);

  return { 
    kelompoks, 
    loading, 
    fetchKelompoks, 
    addKelompok, 
    deleteKelompok 
  };
};
```

### 5. QR Code Generation
```javascript
// utils/qrCode.js
import api from './api';

export const generateQRCode = async (anggotaId) => {
  try {
    const response = await api.get(`/kelompok/anggota/${anggotaId}/qr`);
    return {
      success: true,
      qrCodeData: response.data.data.qrCodeData,
      qrCodeImage: response.data.data.qrCodeImage
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to generate QR code'
    };
  }
};
```

### 6. Usage in Component
```javascript
// components/AbsensiPage.jsx
import React, { useState } from 'react';
import { useQRScanner } from '../hooks/useQRScanner';
import { useKelompok } from '../hooks/useKelompok';

const AbsensiPage = () => {
  const [selectedAbsen, setSelectedAbsen] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('');
  const { scanQRCode, loading } = useQRScanner();
  const { kelompoks } = useKelompok();

  const handleQRScan = async (qrData) => {
    const result = await scanQRCode(qrData, selectedAbsen, selectedKelompok);
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      <h1>Absensi Page</h1>
      
      <select 
        value={selectedKelompok} 
        onChange={(e) => setSelectedKelompok(e.target.value)}
      >
        <option value="">Pilih Kelompok</option>
        {kelompoks.map(k => (
          <option key={k.id} value={k.id}>{k.nama_kelompok}</option>
        ))}
      </select>

      {/* QR Scanner component would go here */}
      
      {loading && <p>Processing...</p>}
    </div>
  );
};

export default AbsensiPage;
```

---

## Error Handling

### Common Error Responses:
```json
{
  "status": 400,
  "message": "Bad Request - Invalid input"
}

{
  "status": 401,
  "message": "Unauthorized - Invalid token"
}

{
  "status": 404,
  "message": "Not Found - Resource not found"
}

{
  "status": 500,
  "message": "Internal Server Error"
}
```

### React Error Handling:
```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};
```

---

## Notes

1. **Authentication**: Most endpoints require JWT token in Authorization header
2. **Date Format**: Use ISO 8601 format for dates (YYYY-MM-DDTHH:mm:ss.sssZ)
3. **File Upload**: Use FormData for file uploads in tugas endpoints
4. **QR Code**: The QR code contains the anggota UUID as plain text
5. **CORS**: Backend is configured to accept requests from any origin in development

This documentation should provide everything needed to integrate the backend API with your React frontend application.
