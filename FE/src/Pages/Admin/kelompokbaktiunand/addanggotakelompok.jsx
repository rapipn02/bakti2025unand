import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { ArrowLeft, Menu, UserPlus, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getKelompokList, addAnggotaKelompok } from "../../../utils/kelompokApi";

export const AddAnggotaKelompok = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nim: ''
  });
  const [loading, setLoading] = useState(false);
  const [kelompokData, setKelompokData] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ambil kelompok ID dari URL
  const urlParams = new URLSearchParams(location.search);
  const kelompokId = urlParams.get('kelompok');

  useEffect(() => {
    if (kelompokId) {
      loadKelompokData();
    }
  }, [kelompokId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadKelompokData = async () => {
    try {
      const result = await getKelompokList();
      if (result.success && result.data) {
        const selectedKelompok = result.data.find(k => k.id === kelompokId);
        setKelompokData(selectedKelompok);
      } else {
        // Fallback ke localStorage
        const storedData = localStorage.getItem('kelompokData');
        if (storedData) {
          const data = JSON.parse(storedData);
          const selectedKelompok = data.find(k => k.id === kelompokId);
          setKelompokData(selectedKelompok);
        }
      }
    } catch (error) {
      console.error('Error loading kelompok data:', error);
      // Fallback ke localStorage
      try {
        const storedData = localStorage.getItem('kelompokData');
        if (storedData) {
          const data = JSON.parse(storedData);
          const selectedKelompok = data.find(k => k.id === kelompokId);
          setKelompokData(selectedKelompok);
        }
      } catch {
        toast.error('Gagal memuat data kelompok');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.nim) {
      toast.error('Nama dan NIM wajib diisi!');
      return;
    }

    if (!kelompokId) {
      toast.error('Kelompok tidak valid!');
      return;
    }

    setLoading(true);
    
    try {
      // Coba tambah via API
      const anggotaData = {
        ...formData,
        id_kelompok: kelompokId
      };
      
      const result = await addAnggotaKelompok(anggotaData);
      
      if (result.success) {
        toast.success(result.message || 'Anggota berhasil ditambahkan!');
        
        // Kembali ke halaman anggota kelompok
        setTimeout(() => {
          navigate(`/anggotakelompok?kelompok=${kelompokId}`);
        }, 1500);
      } else {
        // Fallback: simpan ke localStorage demo
        console.warn('API failed, using localStorage demo:', result.error);
        
        // Simulasi penambahan data untuk demo
        const newAnggota = {
          id: Date.now().toString(),
          nama: formData.nama,
          nim: formData.nim,
          kelompok: kelompokData?.nomor || 1,
          id_kelompok: kelompokId,
          createdAt: new Date().toISOString()
        };
        
        // Simpan ke localStorage untuk demo
        const existingAnggota = JSON.parse(localStorage.getItem(`anggotaKelompok_${kelompokId}`) || '[]');
        existingAnggota.push(newAnggota);
        localStorage.setItem(`anggotaKelompok_${kelompokId}`, JSON.stringify(existingAnggota));
        
        toast.success('Anggota berhasil ditambahkan (mode demo)!');
        
        // Kembali ke halaman anggota kelompok
        setTimeout(() => {
          navigate(`/anggotakelompok?kelompok=${kelompokId}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding anggota:', error);
      
      // Fallback: simpan ke localStorage demo
      try {
        const newAnggota = {
          id: Date.now().toString(),
          nama: formData.nama,
          nim: formData.nim,
          kelompok: kelompokData?.nomor || 1,
          id_kelompok: kelompokId,
          createdAt: new Date().toISOString()
        };
        
        const existingAnggota = JSON.parse(localStorage.getItem(`anggotaKelompok_${kelompokId}`) || '[]');
        existingAnggota.push(newAnggota);
        localStorage.setItem(`anggotaKelompok_${kelompokId}`, JSON.stringify(existingAnggota));
        
        toast.success('Anggota berhasil ditambahkan (mode demo)!');
        
        setTimeout(() => {
          navigate(`/anggotakelompok?kelompok=${kelompokId}`);
        }, 1500);
      } catch {
        toast.error('Gagal menambahkan anggota');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!kelompokId) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Kelompok Tidak Valid
            </h3>
            <p className="text-gray-600 mb-6">
              Parameter kelompok tidak ditemukan di URL.
            </p>
            <Link
              to="/kelompok"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all hover:scale-105"
            >
              <ArrowLeft size={16} />
              Kembali ke Daftar Kelompok
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">

      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <Sidebar />
        </div>
      </div>
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div
        className={`fixed z-30 top-0 left-0 h-full w-80 shadow-md transition-transform duration-300 bg-white md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="w-80 md:w-64" />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-3 md:p-4 h-16 flex-shrink-0 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-grow"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 overflow-hidden">
              <img
                src={logoadmin}
                alt="admin"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-green-700 font-medium">Admin</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-8 flex-grow">
          <div className="flex flex-col">
            {/* Header dengan Back Button */}
            <div className="flex items-center gap-4 mb-6">
              <Link
                to={`/anggotakelompok?kelompok=${kelompokId}`}
                className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all hover:scale-105 cursor-pointer shadow"
              >
                <ArrowLeft size={20} />
                Kembali
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 font-['League_Spartan']">
                Tambah Anggota Kelompok {kelompokData?.nomor || ''}
              </h1>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow border p-6 md:p-8 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Tambah Anggota Baru
                  </h2>
                  <p className="text-gray-600">
                    Kelompok {kelompokData?.nomor || ''} - ID: {kelompokId}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="nim" className="block text-sm font-medium text-gray-700 mb-2">
                    NIM *
                  </label>
                  <input
                    type="text"
                    id="nim"
                    name="nim"
                    value={formData.nim}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Informasi Kelompok:</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Nomor Kelompok:</strong> {kelompokData?.nomor || 'N/A'}</p>
                    <p><strong>ID Kelompok:</strong> {kelompokId}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 font-bold text-white rounded-lg transition-all cursor-pointer hover:scale-105 ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-purple-500 hover:bg-purple-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menyimpan...
                      </div>
                    ) : (
                      'Tambah Anggota'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddAnggotaKelompok;
