import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import { ArrowLeft, Menu, Users, UserPlus, Search, Download, QrCode, Edit3, Trash2, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoadmin from "../../../assets/admin/admin.svg";
import { toast } from "react-hot-toast";
import { getKelompokList, getAnggotaKelompokById, editAnggotaKelompok, deleteAnggotaKelompok } from "../../../utils/kelompokApi";
import QRGenerator from "../../../components/QRGenerator";

// Modal untuk menampilkan QR Code
const QRModal = ({ isOpen, onClose, anggota }) => {
  if (!isOpen || !anggota) return null;

  const handleDownload = () => {
    const canvas = document.querySelector('.qr-generator canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR_${String(anggota?.nama || 'anggota').replace(/\s+/g, '_')}_${String(anggota?.nim || '')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <QrCode className="text-purple-500" size={32} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">QR Code</h2>
        <p className="text-gray-600 mb-6">{String(anggota?.nama || '')} - {String(anggota?.nim || '')}</p>
        
        <div className="mb-6 qr-generator">
          <QRGenerator 
            data={String(anggota?.id || '')}
            size={200}
            className="mx-auto"
          />
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-700 transition-all cursor-pointer"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal untuk Edit Anggota
const EditModal = ({ isOpen, onClose, anggota, onSave }) => {
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
  });

  useEffect(() => {
    if (anggota) {
      setFormData({
        nama: anggota.nama || '',
        nim: anggota.nim || '',
      });
    }
  }, [anggota]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nim) {
      toast.error('Nama dan NIM harus diisi');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Anggota</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIM
            </label>
            <input
              type="text"
              value={formData.nim}
              onChange={(e) => setFormData({...formData, nim: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Masukkan NIM"
              required
            />
          </div>

        

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-700 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AnggotaKelompok = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedKelompok, setSelectedKelompok] = useState('');
  const [kelompokList, setKelompokList] = useState([]);
  const [anggotaData, setAnggotaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingKelompok, setLoadingKelompok] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('By Nama');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Ubah dari 5 ke 20
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState(null);
  
  const location = useLocation();

  // Load kelompok list saat komponen dimount
  useEffect(() => {
    loadKelompokList();
  }, []);

  // Load anggota saat kelompok dipilih
  useEffect(() => {
    if (selectedKelompok && kelompokList.length > 0) {
      loadAnggotaData();
    } else {
      setAnggotaData([]);
      setFilteredData([]);
    }
  }, [selectedKelompok, kelompokList.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter data berdasarkan search
  useEffect(() => {
    try {
      let filtered = [...anggotaData];
      
      if (searchTerm && searchTerm.trim()) {
        filtered = filtered.filter(anggota => {
          if (!anggota) return false;
          
          if (filterBy === 'By Nama') {
            return anggota.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
          } else if (filterBy === 'By NIM') {
            return anggota.nim?.includes(searchTerm) || false;
          }
          return true;
        });
      }
      
      setFilteredData(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering data:', error);
      setFilteredData([]);
    }
  }, [anggotaData, searchTerm, filterBy]);

  // Ambil kelompok dari URL query jika ada
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const kelompokId = urlParams.get('kelompok');
    if (kelompokId && kelompokList.length > 0) {
      setSelectedKelompok(kelompokId);
    }
  }, [location.search, kelompokList]);

  const loadKelompokList = async () => {
    setLoadingKelompok(true);
    try {
      const result = await getKelompokList();
      if (result.success && result.data) {
        setKelompokList(result.data);
      } else {
        // Fallback ke localStorage
        const storedData = localStorage.getItem('kelompokData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setKelompokList(data);
        } else {
          setKelompokList([]);
          toast.error('Gagal memuat daftar kelompok');
        }
      }
    } catch (error) {
      console.error('Error loading kelompok list:', error);
      // Fallback ke localStorage
      try {
        const storedData = localStorage.getItem('kelompokData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setKelompokList(data);
        } else {
          setKelompokList([]);
        }
      } catch {
        setKelompokList([]);
        toast.error('Gagal memuat daftar kelompok');
      }
    } finally {
      setLoadingKelompok(false);
    }
  };

  const loadAnggotaData = async () => {
    if (!selectedKelompok) {
      console.log('No kelompok selected, skipping load');
      return;
    }

    console.log('Loading anggota data for kelompok:', selectedKelompok);
    setLoading(true);
    
    // Helper function to generate dummy data
    const generateDummyData = () => {
      try {
        if (!selectedKelompok) return [];
        
        const selectedKelompokData = kelompokList.find(k => k.id === selectedKelompok);
        const kelompokDisplay = selectedKelompokData?.nomor ? 
          `${selectedKelompokData.nomor}` : 
          (selectedKelompokData?.nama ? String(selectedKelompokData.nama) : 'Unknown');
        
        // Different dummy data for each kelompok
        const allDummyData = {
          '1': [ // Kelompok 1
            { id: '1', nama: 'Ahmad Rizki', nim: '221151001', kelompok: kelompokDisplay },
            { id: '2', nama: 'Siti Nurhaliza', nim: '221151002', kelompok: kelompokDisplay },
            { id: '3', nama: 'Budi Santoso', nim: '221151003', kelompok: kelompokDisplay },
          ],
          '2': [ // Kelompok 2
            { id: '4', nama: 'fadhlilah aisyah putri', nim: '221151004', kelompok: kelompokDisplay },
            { id: '5', nama: 'Dewi Sartika', nim: '221151005', kelompok: kelompokDisplay },
            { id: '6', nama: 'Rahman Hakim', nim: '221151006', kelompok: kelompokDisplay },
          ],
          '3': [ // Kelompok 3
            { id: '7', nama: 'abdill', nim: '231112002', kelompok: kelompokDisplay },
            { id: '8', nama: 'dapa naidi', nim: '231512007', kelompok: kelompokDisplay },
            { id: '9', nama: 'Lestari Wulan', nim: '231512009', kelompok: kelompokDisplay },
          ],
          '4': [ // Kelompok 4
            { id: '10', nama: 'NOPAL', nim: '231512025', kelompok: kelompokDisplay },
            { id: '11', nama: 'rapip', nim: '231512028', kelompok: kelompokDisplay },
            { id: '12', nama: 'Indira Sari', nim: '231512030', kelompok: kelompokDisplay },
          ]
        };
        
        // Get dummy data for specific kelompok based on nomor
        const kelompokNomor = selectedKelompokData?.nomor;
        if (kelompokNomor && allDummyData[kelompokNomor.toString()]) {
          return allDummyData[kelompokNomor.toString()];
        }
        
        // Default fallback for unknown kelompok
        return [
          { id: '999', nama: 'Dummy User', nim: '999999999', kelompok: kelompokDisplay }
        ];
      } catch (error) {
        console.error('Error generating dummy data:', error);
        return [];
      }
    };
    
    try {
      const result = await getAnggotaKelompokById(selectedKelompok);
      console.log('API result:', result);
      
      if (result.success && result.data) {
        // Sanitize data to ensure all fields are strings
        const selectedKelompokData = kelompokList.find(k => k.id === selectedKelompok);
        const kelompokDisplay = selectedKelompokData?.nomor ? 
          String(selectedKelompokData.nomor) : 'Unknown';
          
        const sanitizedData = result.data.map(anggota => ({
          id: String(anggota.id || ''),
          nama: String(anggota.nama || ''),
          nim: String(anggota.nim || ''),
          kelompok: kelompokDisplay
        }));
        setAnggotaData(sanitizedData);
        console.log('Successfully loaded data from API');
      } else {
        // Fallback: cek localStorage dulu, baru dummy data
        console.warn('API failed, checking localStorage:', result.error);
        const storedAnggota = localStorage.getItem(`anggotaKelompok_${selectedKelompok}`);
        if (storedAnggota) {
          try {
            const data = JSON.parse(storedAnggota);
            const selectedKelompokData = kelompokList.find(k => k.id === selectedKelompok);
            const kelompokDisplay = selectedKelompokData?.nomor ? 
              String(selectedKelompokData.nomor) : 'Unknown';
              
            // Sanitize localStorage data
            const sanitizedData = data.map(anggota => ({
              id: String(anggota.id || ''),
              nama: String(anggota.nama || ''),
              nim: String(anggota.nim || ''),
              kelompok: kelompokDisplay
            }));
            setAnggotaData(sanitizedData);
            console.log('Loaded data from localStorage');
            // Only show toast once per session
            if (!sessionStorage.getItem('anggota-offline-notified')) {
              toast.error('Menggunakan data offline. API tidak tersedia.');
              sessionStorage.setItem('anggota-offline-notified', 'true');
            }
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
            const dummyData = generateDummyData();
            setAnggotaData(dummyData);
            toast.error('Data offline rusak, menggunakan data demo.');
          }
        } else {
          const dummyData = generateDummyData();
          setAnggotaData(dummyData);
          console.log('No localStorage data, using dummy data');
          // Only show toast once per session
          if (!sessionStorage.getItem('anggota-demo-notified')) {
            toast.error('Menggunakan data demo. API tidak tersedia.');
            sessionStorage.setItem('anggota-demo-notified', 'true');
          }
        }
      }
    } catch (error) {
      console.error('Error loading anggota data:', error);
      
      // Fallback: cek localStorage dulu, baru dummy data
      const storedAnggota = localStorage.getItem(`anggotaKelompok_${selectedKelompok}`);
      if (storedAnggota) {
        try {
          const data = JSON.parse(storedAnggota);
          const selectedKelompokData = kelompokList.find(k => k.id === selectedKelompok);
          const kelompokDisplay = selectedKelompokData?.nomor ? 
            String(selectedKelompokData.nomor) : 'Unknown';
            
          // Sanitize fallback data
          const sanitizedData = data.map(anggota => ({
            id: String(anggota.id || ''),
            nama: String(anggota.nama || ''),
            nim: String(anggota.nim || ''),
            kelompok: kelompokDisplay
          }));
          setAnggotaData(sanitizedData);
          console.log('Fallback: loaded data from localStorage');
          // Only show toast once per session
          if (!sessionStorage.getItem('anggota-offline-notified')) {
            toast.error('API tidak tersedia, menggunakan data offline.');
            sessionStorage.setItem('anggota-offline-notified', 'true');
          }
        } catch (parseError) {
          console.error('Fallback: Error parsing localStorage data:', parseError);
          const dummyData = generateDummyData();
          setAnggotaData(dummyData);
          toast.error('API dan data offline tidak tersedia, menggunakan data demo.');
        }
      } else {
        const dummyData = generateDummyData();
        setAnggotaData(dummyData);
        console.log('Fallback: no localStorage data, using dummy data');
        // Only show toast once per session
        if (!sessionStorage.getItem('anggota-demo-notified')) {
          toast.error('API tidak tersedia, menggunakan data demo.');
          sessionStorage.setItem('anggota-demo-notified', 'true');
        }
      }
    } finally {
      setLoading(false);
      console.log('Finished loading anggota data');
    }
  };

  const handleKelompokChange = (e) => {
    try {
      const newKelompokId = e.target.value;
      console.log('Kelompok changed to:', newKelompokId);
      
      // Reset semua state yang terkait
      setSelectedKelompok(newKelompokId);
      setSearchTerm('');
      setCurrentPage(1);
      setAnggotaData([]);
      setFilteredData([]);
      setLoading(false);
    } catch (error) {
      console.error('Error changing kelompok:', error);
      toast.error('Terjadi kesalahan saat memilih kelompok');
    }
  };

  const handleViewQR = (anggota) => {
    setSelectedAnggota(anggota);
    setQrModalOpen(true);
  };

  const handleEditAnggota = (anggota) => {
    setEditingAnggota(anggota);
    setEditModalOpen(true);
  };

  const handleDeleteAnggota = async (anggota) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${anggota.nama}?`)) {
      return;
    }

    try {
      const result = await deleteAnggotaKelompok(anggota.id);
      if (result.success) {
        toast.success(result.message);
        // Reload data
        loadAnggotaData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error deleting anggota:', error);
      toast.error('Terjadi kesalahan saat menghapus anggota');
    }
  };

  const handleSaveEdit = async (editedData) => {
    try {
      const result = await editAnggotaKelompok({
        id: editingAnggota.id,
        nama: editedData.nama,
        nim: editedData.nim,
        id_kelompok: selectedKelompok
      });

      if (result.success) {
        toast.success(result.message);
        setEditModalOpen(false);
        setEditingAnggota(null);
        // Reload data
        loadAnggotaData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error editing anggota:', error);
      toast.error('Terjadi kesalahan saat mengedit anggota');
    }
  };

  const handleExport = () => {
    if (!selectedKelompok || filteredData.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    
    const selectedKelompokData = kelompokList.find(k => k.id === selectedKelompok);
    const csvData = filteredData.map((anggota, index) => 
      `${index + 1},${anggota.nama},${anggota.nim},${anggota.kelompok},${anggota.status_kehadiran || ''},${anggota.tanggal || ''},${anggota.metode || ''},${anggota.waktu_kehadiran || ''},${anggota.kegiatan || ''}`
    );
    const csvContent = `No,Nama,NIM,Kelompok,Status Kehadiran,Tanggal,Waktu Kehadiran,Metode,Kegiatan\n${csvData.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `anggota_kelompok_${selectedKelompokData?.nomor || 'unknown'}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Data berhasil diekspor!');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredData) ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Array.isArray(filteredData) ? Math.ceil(filteredData.length / itemsPerPage) : 0;

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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                
                <h1 className="text-2xl font-bold text-gray-800 font-['League_Spartan']">
                  Pengelolaan Anggota Kelompok
                </h1>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 cursor-pointer shadow"
                disabled={!selectedKelompok || filteredData.length === 0}
              >
                <Download size={16} />
                Export
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Kelompok Selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Kelompok
                </label>
                <div className="relative">
                  <select
                    value={selectedKelompok}
                    onChange={handleKelompokChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                    disabled={loadingKelompok}
                  >
                    <option value="">Pilih Kelompok</option>
                    {kelompokList.map((kelompok) => (
                      <option key={kelompok.id} value={kelompok.id}>
                        Kelompok {kelompok.nomor}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Anggota
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search Items"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={!selectedKelompok}
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter
                </label>
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                    disabled={!selectedKelompok}
                  >
                    <option value="By Nama">By Nama</option>
                    <option value="By NIM">By NIM</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Add Button */}
              <div className="flex items-end">
                <Link
                  to={selectedKelompok ? `/addanggotakelompok?kelompok=${selectedKelompok}` : '#'}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 cursor-pointer shadow ${
                    selectedKelompok 
                      ? 'bg-purple-500 text-white hover:bg-purple-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!selectedKelompok) {
                      e.preventDefault();
                      toast.error('Pilih kelompok terlebih dahulu');
                    }
                  }}
                >
                  <UserPlus size={16} />
                  Add Anggota Kelompok
                </Link>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow border p-4 md:p-6">
              {!selectedKelompok ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Pilih Kelompok
                  </h3>
                  <p className="text-gray-500">
                    Pilih kelompok terlebih dahulu untuk melihat daftar anggota
                  </p>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Memuat data anggota...</p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead className="border-b-2 border-gray-200">
                        <tr>
                          <th className="py-3 px-4 font-semibold text-gray-600">No</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">Nama</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">Nim</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">Kelompok</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">QR Code</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length > 0 ? (
                          currentItems.map((anggota, index) => (
                            <tr key={anggota?.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4 text-gray-700">
                                {indexOfFirstItem + index + 1}
                              </td>
                              <td className="py-4 px-4 text-gray-700 font-medium">
                                {String(anggota?.nama || '')}
                              </td>
                              <td className="py-4 px-4 text-gray-700">
                                {String(anggota?.nim || '')}
                              </td>
                              <td className="py-4 px-4 text-gray-700">
                                {String(anggota?.kelompok || '')}
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => handleViewQR(anggota)}
                                  className="bg-purple-100 text-sm text-purple-600 font-semibold px-3 py-1 rounded-md hover:bg-purple-200 cursor-pointer duration-300 hover:scale-105"
                                >
                                  View QR
                                </button>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleEditAnggota(anggota)}
                                    className="bg-blue-100 text-sm text-blue-600 font-semibold px-3 py-1 rounded-md hover:bg-blue-200 cursor-pointer duration-300 hover:scale-105 flex items-center gap-1"
                                  >
                                    <Edit3 size={12} />
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAnggota(anggota)}
                                    className="bg-red-100 text-sm text-red-600 font-semibold px-3 py-1 rounded-md hover:bg-red-200 cursor-pointer duration-300 hover:scale-105 flex items-center gap-1"
                                  >
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-10 text-gray-500">
                              <div className="flex flex-col items-center">
                                <UserPlus className="w-12 h-12 text-gray-300 mb-2" />
                                <p>Tidak ada anggota ditemukan.</p>
                                <p className="text-sm">
                                  {searchTerm ? 'Coba ubah kriteria pencarian.' : 'Tambahkan anggota baru.'}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <p className="text-gray-600">
                        Total Page: {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Prev
                        </button>
                        <span className="px-3 py-1 bg-emerald-500 text-white rounded">
                          {currentPage}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* QR Modal */}
      <QRModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        anggota={selectedAnggota} 
      />

      {/* Edit Modal */}
      <EditModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        anggota={editingAnggota} 
        onSave={handleSaveEdit} 
      />
    </div>
  );
};

export default AnggotaKelompok;
