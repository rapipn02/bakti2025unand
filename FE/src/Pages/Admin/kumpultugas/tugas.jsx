import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Link } from "react-router-dom";
import { Menu, Edit3, Trash2, Plus, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { getTugasList, deleteTugas, editTugas } from "../../../utils/tugasApi";

// Modal untuk Edit Tugas
const EditModal = ({ isOpen, onClose, tugas, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    if (tugas) {
      setFormData({
        title: tugas.title || '',
        description: tugas.description || '',
        deadline: tugas.deadline ? tugas.deadline.split('T')[0] : ''
      });
    }
  }, [tugas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      toast.error('Judul dan deadline harus diisi');
      return;
    }
    onSave({ ...formData, id: tugas.id });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Tugas</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Tugas
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Masukkan judul tugas"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Masukkan deskripsi tugas"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

export const Tugas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTugas, setEditingTugas] = useState(null);

  // Dummy data fallback
  const dummyTasks = useMemo(() => [
    { id: 1, title: "Membuat Laporan Pendahuluan", deadline: "2025-06-30", description: "Membuat laporan pendahuluan proyek" },
    { id: 2, title: "Presentasi Kelompok", deadline: "2025-07-05", description: "Presentasi hasil kerja kelompok" },
    { id: 3, title: "Pengumpulan Video Dokumentasi", deadline: "2025-07-10", description: "Upload video dokumentasi kegiatan" },
    { id: 4, title: "Review Jurnal Ilmiah", deadline: "2025-07-15", description: "Review dan analisis jurnal ilmiah" },
  ], []);

  // Load tugas data
  const loadTugasData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getTugasList();
      
      if (result.success && result.data) {
        setTugasList(result.data);
      } else {
        console.warn('API failed, using dummy data:', result.error);
        setTugasList(dummyTasks);
        // Only show toast once per session
        if (!sessionStorage.getItem('tugas-offline-notified')) {
          toast.error('Menggunakan data offline. API tidak tersedia.');
          sessionStorage.setItem('tugas-offline-notified', 'true');
        }
      }
    } catch (error) {
      console.error('Error loading tugas data:', error);
      setTugasList(dummyTasks);
      // Only show toast once per session
      if (!sessionStorage.getItem('tugas-demo-notified')) {
        toast.error('API tidak tersedia, menggunakan data demo.');
        sessionStorage.setItem('tugas-demo-notified', 'true');
      }
    } finally {
      setLoading(false);
    }
  }, [dummyTasks]);

  // Load data on mount
  useEffect(() => {
    loadTugasData();
  }, [loadTugasData]);

  // Handle edit tugas
  const handleEditTugas = (tugas) => {
    setEditingTugas(tugas);
    setEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async (editedData) => {
    try {
      const result = await editTugas({
        id: editedData.id,
        title: editedData.title,
        description: editedData.description,
        deadline: editedData.deadline
      });

      if (result.success) {
        toast.success(result.message || 'Tugas berhasil diedit');
        setEditModalOpen(false);
        setEditingTugas(null);
        // Reload data
        loadTugasData();
      } else {
        toast.error(result.error || 'Gagal mengedit tugas');
      }
    } catch (error) {
      console.error('Error editing tugas:', error);
      toast.error('Terjadi kesalahan saat mengedit tugas');
    }
  };

  // Handle delete tugas
  const handleDeleteTugas = async (tugas) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus tugas "${tugas.title}"?`)) {
      return;
    }

    try {
      const result = await deleteTugas(tugas.id);
      if (result.success) {
        toast.success(result.message || 'Tugas berhasil dihapus');
        // Reload data
        loadTugasData();
      } else {
        toast.error(result.error || 'Gagal menghapus tugas');
      }
    } catch (error) {
      console.error('Error deleting tugas:', error);
      toast.error('Terjadi kesalahan saat menghapus tugas');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* ===== SIDEBAR DESKTOP ===== */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <Sidebar />
        </div>
      </div>

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

      {/* ===== KONTEN UTAMA HALAMAN ===== */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex justify-between items-center  p-3 md:p-4 h-16 flex-shrink-0 ">
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

        {/* Isi Spesifik Halaman Tugas */}
        <main className="p-4 md:p-8 flex-grow">
          <div className="flex flex-col items-start mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800 font-['League_Spartan']">
              Daftar Tugas
            </h1>
            <Link
              to="/addtugas"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white text-lg px-4 py-2 rounded-md mb-4 hover:bg-emerald-700 shadow cursor-pointer w-full sm:w-auto font-['League_Spartan'] duration-300 hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Tugas
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow border p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data tugas...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-x-auto shadow border">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-gray-100 border-b-2 border-gray-400">
                  <tr>
                    <th className="py-3 px-6 font-semibold text-gray-600">No</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">
                      Judul Tugas
                    </th>
                    <th className="py-3 px-6 font-semibold text-gray-600">
                      Deadline
                    </th>
                    <th className="py-3 px-6 font-semibold text-gray-600 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {tugasList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 px-6 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Calendar className="w-12 h-12 text-gray-300 mb-2" />
                          <p>Tidak ada tugas tersedia</p>
                          <p className="text-sm">Tambahkan tugas baru untuk memulai</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tugasList.map((task, index) => (
                      <tr key={task.id} className="hover:bg-green-50">
                        <td className="py-4 px-6 text-gray-700">{index + 1}</td>
                        <td className="py-4 px-6 text-gray-900 font-medium">
                          <div>
                            <div className="font-semibold">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {formatDate(task.deadline)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleEditTugas(task)}
                              className="bg-emerald-200 text-green-600 text-xs font-semibold px-3 py-1 rounded-md hover:bg-green-300 cursor-pointer duration-300 hover:scale-105 flex items-center gap-1"
                            >
                              <Edit3 size={12} />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteTugas(task)}
                              className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-md hover:bg-red-200 cursor-pointer duration-300 hover:scale-105 flex items-center gap-1"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      <EditModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        tugas={editingTugas} 
        onSave={handleSaveEdit} 
      />
    </div>
  );
};

export default Tugas;
