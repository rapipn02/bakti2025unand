import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Menu, AlertTriangle, Users, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getKelompokWithAnggota, deleteKelompok } from "../../../utils/kelompokApi";

// --- BAGIAN 1: Komponen Modal didefinisikan di sini ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black/30 flex justify-center items-center z-50">
      {/* Modal Card */}
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>
        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all cursor-pointer "
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-slate-500 text-white font-medium hover:bg-red-700 transition-all cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// --- BAGIAN 2: Komponen Utama Kelompok ---
export const Kelompok = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKelompokData();
  }, []);

  const loadKelompokData = async () => {
    setLoading(true);
    let notificationShown = false;
    
    try {
      // Coba ambil data dari API terlebih dahulu
      const result = await getKelompokWithAnggota();
      if (result.success && result.data) {
        setGroupData(result.data);
        // Simpan ke localStorage sebagai backup
        localStorage.setItem('kelompokData', JSON.stringify(result.data));
      } else {
        // Jika API gagal, gunakan data dari localStorage
        console.warn('API failed, using localStorage data:', result.error);
        const storedData = localStorage.getItem('kelompokData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setGroupData(data);
          toast.error('Menggunakan data offline. Periksa koneksi API.');
          notificationShown = true;
        } else {
          setGroupData([]);
          if (!notificationShown) {
            toast.error('Gagal memuat data kelompok');
          }
        }
      }
    } catch (error) {
      console.error('Error loading kelompok data:', error);
      // Fallback ke localStorage jika ada error
      try {
        const storedData = localStorage.getItem('kelompokData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setGroupData(data);
          if (!notificationShown) {
            toast.error('API tidak tersedia, menggunakan data offline.');
          }
        } else {
          setGroupData([]);
          if (!notificationShown) {
            toast.error('Tidak ada data kelompok tersedia');
          }
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
        setGroupData([]);
        if (!notificationShown) {
          toast.error('Gagal memuat data kelompok');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (kelompok) => {
    setItemToDelete(kelompok);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setItemToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        // Coba hapus dari API terlebih dahulu
        const result = await deleteKelompok(itemToDelete.id);
        if (result.success) {
          toast.success(result.message || 'Kelompok berhasil dihapus!');
          // Refresh data dari API
          await loadKelompokData();
        } else {
          // Jika API gagal, hapus dari localStorage
          console.warn('API delete failed, using localStorage:', result.error);
          const updatedData = groupData.filter(group => group.id !== itemToDelete.id);
          setGroupData(updatedData);
          localStorage.setItem('kelompokData', JSON.stringify(updatedData));
          toast.success('Kelompok berhasil dihapus (mode offline)');
        }
      } catch (error) {
        console.error('Error deleting kelompok:', error);
        // Fallback ke localStorage delete
        try {
          const updatedData = groupData.filter(group => group.id !== itemToDelete.id);
          setGroupData(updatedData);
          localStorage.setItem('kelompokData', JSON.stringify(updatedData));
          toast.success('Kelompok berhasil dihapus (mode offline)');
        } catch (storageError) {
          console.error('Storage delete error:', storageError);
          toast.error('Gagal menghapus kelompok');
        }
      } finally {
        handleCloseModal();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">

      {/* Sidebar dan Header */}
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
        <header className="flex justify-between items-center p-3 md:p-4 h-16 flex-shrink-0">
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

        {/* Konten Utama */}
        <main className="p-4 md:p-8 flex-grow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 font-['League_Spartan']">
            Kelompok
          </h1>
          <div className="mb-6">
            <Link
              to="/addkelompok"
              className="inline-block text-center bg-emerald-500 text-white text-lg px-4 py-2 rounded-md mb-4 hover:bg-emerald-700 shadow cursor-pointer w-full sm:w-auto font-['League_Spartan'] duration-300 hover:scale-105 transition-all"
            >
              + Add Kelompok
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow border p-4 md:p-6 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b-2 border-gray-400">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-600">No</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">
                    ID Kelompok
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600">
                    Kelompok
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600">
                    Anggota
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                        <span className="ml-2 text-gray-500">Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : groupData.length > 0 ? (
                  groupData.map((group, index) => (
                    <tr
                      key={group.id}
                      className="border-b border-gray-400 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                      <td className="py-4 px-4 text-gray-800">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {group.id ? (typeof group.id === 'string' && group.id.length > 10 ? `${group.id.substring(0, 8)}...` : group.id) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">Kelompok {group.nomor}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-blue-600" />
                          <span>{group.Anggota_Kelompok?.length || group.anggota || 0} orang</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/anggotakelompok?kelompok=${group.id}`}
                            className="bg-blue-100 text-sm text-blue-600 font-semibold px-3 py-1 rounded-md hover:bg-blue-200 cursor-pointer duration-300 hover:scale-105"
                          >
                            Detail
                          </Link>
                          <button
                            onClick={() => handleOpenDeleteModal(group)}
                            className="bg-red-100 text-sm text-red-600 font-semibold px-3 py-1 rounded-md hover:bg-red-200 cursor-pointer duration-300 hover:scale-105"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-300 mb-2" />
                        <p>Belum ada data kelompok.</p>
                        <p className="text-sm">Silakan tambahkan kelompok baru.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Panggil komponen modal di sini */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={confirmDelete}
        title="Hapus Kelompok"
        message={`Apakah Anda yakin ingin menghapus Kelompok ${itemToDelete?.nomor}? Semua anggota dalam kelompok ini juga akan terhapus. Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
};

export default Kelompok;
