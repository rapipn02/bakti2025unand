import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'react-router-dom';
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Menu, QrCode, Edit2, Save, X } from "lucide-react";
import { getAbsenList, updateStatusKehadiran, scanQRForAbsensi } from '../../../utils/absenApi';
import { getKelompokList } from '../../../utils/kelompokApi';
import { showToast, showErrorToast, showSuccessToast } from '../../../utils/toastUtils';
import QRScanner from '../../../components/QRScanner';

export const Absensi = () => {
  const [searchParams] = useSearchParams();
  const [selectedKelompok, setSelectedKelompok] = useState("");
  const [selectedKegiatan, setSelectedKegiatan] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [absenData, setAbsenData] = useState([]);
  const [kelompokData, setKelompokData] = useState([]);
  const [anggotaKelompok, setAnggotaKelompok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAnggota, setLoadingAnggota] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null); // ID anggota yang sedang diedit
  
  // QR Scanner states
  const [showQRModal, setShowQRModal] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch absen list dan kelompok secara bersamaan
        const [absenResult, kelompokResult] = await Promise.all([
          getAbsenList(),
          getKelompokList()
        ]);
        
        if (absenResult.success) {
          const formatted = absenResult.data.map(item => ({
            ...item,
            tanggal: new Date(item.tanggal).toLocaleDateString('id-ID', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            })
          }));
          setAbsenData(formatted);
        } else {
          showErrorToast(absenResult.error || 'Gagal memuat data absen');
        }

        if (kelompokResult.success) {
          setKelompokData(kelompokResult.data);
        } else {
          showErrorToast(kelompokResult.error || 'Gagal memuat data kelompok');
        }
      } catch {
        showErrorToast('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Set state berdasarkan URL parameters (saat redirect dari QR scan)
  useEffect(() => {
    const kelompokParam = searchParams.get('kelompok');
    const kegiatanParam = searchParams.get('kegiatan');
    
    if (kelompokParam && kelompokParam !== selectedKelompok) {
      setSelectedKelompok(kelompokParam);
    }
    
    if (kegiatanParam && kegiatanParam !== selectedKegiatan) {
      setSelectedKegiatan(kegiatanParam);
    }
  }, [searchParams, selectedKelompok, selectedKegiatan]);

  // Fetch anggota kelompok when kelompok and kegiatan selected
  const fetchAnggotaKelompok = useCallback(async () => {
    setLoadingAnggota(true);
    try {
      // Call API to get anggota kelompok with their absensi status for selected kegiatan
      const response = await fetch(`http://localhost:4000/kelompok/anggota/with-absensi?id_kelompok=${selectedKelompok}&id_absen=${selectedKegiatan}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnggotaKelompok(result.data || []);
      } else {
        showErrorToast('Gagal memuat data anggota kelompok');
        setAnggotaKelompok([]);
      }
    } catch {
      showErrorToast('Terjadi kesalahan saat memuat anggota kelompok');
      setAnggotaKelompok([]);
    } finally {
      setLoadingAnggota(false);
    }
  }, [selectedKelompok, selectedKegiatan]);

  useEffect(() => {
    if (selectedKelompok && selectedKegiatan) {
      fetchAnggotaKelompok();
    } else {
      setAnggotaKelompok([]);
    }
  }, [selectedKelompok, selectedKegiatan, fetchAnggotaKelompok]);

  const handleScanQR = () => {
    if (!selectedKegiatan) {
      showErrorToast('Pilih kegiatan terlebih dahulu!');
      return;
    }
    if (!selectedKelompok) {
      showErrorToast('Pilih kelompok terlebih dahulu!');
      return;
    }
    setShowQRModal(true);
  };

  // Update status kehadiran
  const updateStatusKehadiranHandler = async (anggotaId, newStatus) => {
    try {
      // Call API untuk update status kehadiran
      const result = await updateStatusKehadiran({
        anggota_id: anggotaId,
        absen_id: selectedKegiatan,
        status_kehadiran: newStatus
      });

      if (result.success) {
        // Update local state jika API berhasil
        setAnggotaKelompok(prev => 
          prev.map(anggota => 
            anggota.id === anggotaId 
              ? { 
                  ...anggota, 
                  status_kehadiran: newStatus,
                  metode_absen: newStatus === 'Hadir' ? anggota.metode_absen || 'MANUAL_BY_ADMIN' : 'MANUAL_BY_ADMIN',
                  waktu_absen: anggota.waktu_absen || new Date().toISOString()
                }
              : anggota
          )
        );
        
        showSuccessToast(`Status kehadiran berhasil diubah menjadi ${newStatus}`);
      } else {
        // Fallback: update local state jika API gagal
        setAnggotaKelompok(prev => 
          prev.map(anggota => 
            anggota.id === anggotaId 
              ? { 
                  ...anggota, 
                  status_kehadiran: newStatus,
                  metode_absen: newStatus === 'Hadir' ? anggota.metode_absen || 'MANUAL_BY_ADMIN' : 'MANUAL_BY_ADMIN',
                  waktu_absen: anggota.waktu_absen || new Date().toISOString()
                }
              : anggota
          )
        );
        
        showSuccessToast(`Status kehadiran berhasil diubah menjadi ${newStatus} (offline mode)`);
        console.warn('API failed, updated locally:', result.error);
      }
      
      setEditingStatus(null);
    } catch (error) {
      console.error('Error updating status:', error);
      showErrorToast('Gagal mengubah status kehadiran');
    }
  };

  // Handle edit status
  const handleEditStatus = (anggotaId) => {
    setEditingStatus(anggotaId);
  };

  // Cancel edit status
  const cancelEditStatus = () => {
    setEditingStatus(null);
  };

  // Handle QR scan success
  const handleQRScanSuccess = async (decodedText, decodedResult) => {
    console.log(`QR Code detected: ${decodedText}`, decodedResult);
    setScanResult(decodedText);
    
    // Process QR scan untuk absensi
    try {
      const result = await scanQRForAbsensi(decodedText, selectedKegiatan, selectedKelompok);
      
      if (result.success) {
        showSuccessToast(`QR Code berhasil dipindai! ${result.message || 'Absensi berhasil'}`);
        
        // Update anggota list untuk reflect perubahan
        if (selectedKelompok && selectedKegiatan) {
          fetchAnggotaKelompok();
        }
        
        // Reset scanner for next scan instead of closing modal
        setScanResult(null);
        
        // Reset scanner if available
        if (window.resetQRScanner) {
          setTimeout(() => {
            window.resetQRScanner();
          }, 1000);
        }
        
      } else {
        showErrorToast(result.error || 'Gagal memproses QR Code');
        setScanResult(null);
      }
    } catch (error) {
      console.error('Error processing QR scan:', error);
      showErrorToast('Terjadi kesalahan saat memproses QR Code');
      setScanResult(null);
    }
  };

  // Handle QR scan error
  const handleQRScanError = (error) => {
    console.error('QR scan error:', error);
    showErrorToast('Gagal mengakses kamera atau memindai QR code');
  };

  // Close QR modal
  const closeQRModal = () => {
    setShowQRModal(false);
    setScanResult(null);
  };

  // Fungsi export absensi
  const handleExportAbsensi = () => {
    if (!anggotaKelompok || anggotaKelompok.length === 0) {
      showErrorToast('Tidak ada data absensi untuk diekspor');
      return;
    }
    const kelompokDisplay = kelompokData.find(k => k.id === selectedKelompok)?.nomor || selectedKelompok;
    const kegiatanDisplay = absenData.find(a => a.id === selectedKegiatan)?.title || '';
    const tanggalDisplay = absenData.find(a => a.id === selectedKegiatan)?.tanggal || '';
    // Tambahkan judul di bagian atas file CSV
    const csvTitle = `Kelompok: ${kelompokDisplay}\nKegiatan: ${kegiatanDisplay}\nTanggal: ${tanggalDisplay}\n`;
    const csvData = anggotaKelompok.map((anggota, idx) =>
      `${idx + 1},${anggota.nama},${anggota.nim},${kelompokDisplay},${anggota.status_kehadiran || 'Belum Absen'},${anggota.waktu_absen ? new Date(anggota.waktu_absen).toLocaleString('id-ID') : '-'},${anggota.metode_absen || '-'},${tanggalDisplay},${kegiatanDisplay}`
    );
    const csvContent = `${csvTitle}\nNo,Nama,NIM,Kelompok,Status Kehadiran,Waktu Absen,Metode,Tanggal,Kegiatan\n${csvData.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Format nama file agar lebih informatif dan aman
    const cleanKegiatan = kegiatanDisplay.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanTanggal = tanggalDisplay.replace(/[^0-9]/g, '');
    link.download = `Absensi_Kelompok_${kelompokDisplay}_${cleanKegiatan}_${cleanTanggal}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    showSuccessToast('Data absensi berhasil diekspor!');
  };

  return (
    <div className="flex h-screen font-sans bg-[#f5f6fa] relative">
      {/* Tombol hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Mobile */}
      <div
        className={`fixed z-30 top-0 left-0 h-full w-80 shadow-md transition-transform duration-300 bg-white md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="w-80 md:w-64" />
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:block w-72">
        <Sidebar />
      </div>
      {/* Konten */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Topbar */}
        <div className="flex justify-end items-center p-4  bg-white md:bg-transparent border-b md:border-none">
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
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 flex-1 overflow-auto">
          <h2 className="text-2xl font-bold mb-4 font-['League_Spartan']">
            Absensi Mahasiswa
          </h2>

          {/* Filter Selection */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow border">
            <h3 className="text-lg font-semibold mb-4">Pilih Kelompok dan Kegiatan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelompok
                </label>
                <select
                  value={selectedKelompok}
                  onChange={(e) => setSelectedKelompok(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Pilih Kelompok</option>
                  {kelompokData.map((kelompok) => (
                    <option key={kelompok.id} value={kelompok.id}>
                      Kelompok {kelompok.nomor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kegiatan
                </label>
                <select
                  value={selectedKegiatan}
                  onChange={(e) => setSelectedKegiatan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Pilih Kegiatan</option>
                  {absenData.map((absen) => (
                    <option key={absen.id} value={absen.id}>
                      {absen.title} - {absen.tanggal}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedKelompok && selectedKegiatan && (
              <div className="flex justify-center">
                <button
                  onClick={handleScanQR}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <QrCode className="w-5 h-5" />
                  Scan QR Code
                </button>
              </div>
            )}
          </div>

          {/* Anggota Kelompok List */}
          {selectedKelompok && selectedKegiatan && (
            <div className="bg-white rounded-xl px-4 py-4 overflow-x-auto shadow border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">
                  Daftar Anggota Kelompok {kelompokData.find(k => k.id === selectedKelompok)?.nomor || selectedKelompok}
                </h3>
                <div className="text-sm text-gray-500">
                  Kegiatan: {absenData.find(a => a.id === selectedKegiatan)?.title}
                </div>
              </div>

              {loadingAnggota ? (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                    <span className="ml-2 text-gray-500">Memuat data anggota...</span>
                  </div>
                </div>
              ) : anggotaKelompok.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada data anggota kelompok
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={handleExportAbsensi}
                      className="inline-flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 cursor-pointer shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                      Export Absensi
                    </button>
                  </div>

                  <table className="w-full text-sm text-center border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 border-b">
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Nama</th>
                        <th className="px-4 py-3">NIM</th>
                        <th className="px-4 py-3">Status Kehadiran</th>
                        <th className="px-4 py-3">Waktu Absen</th>
                        <th className="px-4 py-3">Metode</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anggotaKelompok.map((anggota, index) => (
                        <tr key={anggota.id} className="hover:bg-green-50 border-b transition">
                          <td className="py-3">{index + 1}</td>
                          <td className="font-medium">{anggota.nama}</td>
                          <td>{anggota.nim}</td>
                          <td>
                            {editingStatus === anggota.id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  defaultValue={anggota.status_kehadiran || 'Belum Absen'}
                                  onChange={(e) => updateStatusKehadiranHandler(anggota.id, e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                  <option value="Belum Absen">Belum Absen</option>
                                  <option value="Hadir">Hadir</option>
                                  <option value="Alfa">Alfa</option>
                                  <option value="Sakit">Sakit</option>
                                  <option value="Izin">Izin</option>
                                </select>
                                <button
                                  onClick={cancelEditStatus}
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                anggota.status_kehadiran === 'Hadir' 
                                  ? 'bg-green-100 text-green-800' 
                                  : anggota.status_kehadiran === 'Sakit'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : anggota.status_kehadiran === 'Izin'
                                  ? 'bg-blue-100 text-blue-800'
                                  : anggota.status_kehadiran === 'Alfa'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {anggota.status_kehadiran || 'Belum Absen'}
                              </span>
                            )}
                          </td>
                          <td className="text-xs text-gray-600">
                            {anggota.waktu_absen ? new Date(anggota.waktu_absen).toLocaleTimeString('id-ID') : '-'}
                          </td>
                          <td className="text-xs text-gray-600">
                            {anggota.metode_absen || '-'}
                          </td>
                          <td>
                            {editingStatus !== anggota.id && (
                              <button
                                onClick={() => handleEditStatus(anggota.id)}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit Status"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {anggotaKelompok.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Ringkasan Kehadiran</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="text-xl font-bold text-green-800">
                        {anggotaKelompok.filter(a => a.status_kehadiran === 'Hadir').length}
                      </div>
                      <div className="text-sm text-green-600">Hadir</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <div className="text-xl font-bold text-red-800">
                        {anggotaKelompok.filter(a => a.status_kehadiran === 'Alfa').length}
                      </div>
                      <div className="text-sm text-red-600">Alfa</div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <div className="text-xl font-bold text-yellow-800">
                        {anggotaKelompok.filter(a => a.status_kehadiran === 'Sakit').length}
                      </div>
                      <div className="text-sm text-yellow-600">Sakit</div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="text-xl font-bold text-blue-800">
                        {anggotaKelompok.filter(a => a.status_kehadiran === 'Izin').length}
                      </div>
                      <div className="text-sm text-blue-600">Izin</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions when no selection */}
          {(!selectedKelompok || !selectedKegiatan) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="text-blue-600 mb-2">
                <QrCode className="w-12 h-12 mx-auto mb-2" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Pilih Kelompok dan Kegiatan
              </h3>
              <p className="text-blue-700">
                Silakan pilih kelompok dan kegiatan untuk melihat daftar anggota dan melakukan absensi
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      <QRScanner
        isOpen={showQRModal}
        onScanSuccess={handleQRScanSuccess}
        onScanError={handleQRScanError}
        onClose={closeQRModal}
        title="Scan QR Code untuk Absensi"
        description={`Kegiatan: ${absenData.find(a => a.id === selectedKegiatan)?.title || ''} | Kelompok: ${kelompokData.find(k => k.id === selectedKelompok)?.nomor || ''}`}
      />
    </div>
  );
};

export default Absensi;
