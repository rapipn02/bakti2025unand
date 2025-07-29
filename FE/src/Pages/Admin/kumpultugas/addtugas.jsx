import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Menu, ArrowLeft } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { addTugas } from "../../../utils/tugasApi";

const MAX_DESCRIPTION_LENGTH = 1000;
const WARNING_THRESHOLD = 0.9;


export const AddTugas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '', // date
    deadlineHour: '', // jam 0-23
    deadlineMinute: '' // menit 0-59
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  // Validasi khusus untuk description
  if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
    toast.error(`Deskripsi tidak boleh lebih dari ${MAX_DESCRIPTION_LENGTH} karakter`);
    return;
  }
  
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleDateChange = (e) => {
  const { name, value } = e.target;
  
  // Validasi tanggal tidak di masa lalu
  if (name === 'deadline' && value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(value);
    
    if (selectedDate < today) {
      toast.error('Tanggal deadline tidak boleh di masa lalu');
      return;
    }
  }
  
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  

   if (!formData.title?.trim()) {
    toast.error('Judul tidak boleh kosong');
    return;
  }
  // Validasi panjang deskripsi
if (formData.description && formData.description.length > MAX_DESCRIPTION_LENGTH) {
  toast.error(`Deskripsi tidak boleh lebih dari ${MAX_DESCRIPTION_LENGTH} karakter`);
  return;
}
  
  if (!formData.deadline) {
    toast.error('Tanggal deadline harus diisi');
    return;
  }
  
  // Validasi tanggal tidak di masa lalu
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(formData.deadline);
  if (selectedDate < today) {
    toast.error('Tanggal deadline tidak boleh di masa lalu');
    return;
  }
  
  try {
    setLoading(true);
    
    // Format deadline yang konsisten
    // Format deadline yang konsisten
const hour = formData.deadlineHour !== '' ? String(formData.deadlineHour).padStart(2, '0') : '00';
const minute = formData.deadlineMinute !== '' ? String(formData.deadlineMinute).padStart(2, '0') : '00';

// Buat Date object dan convert ke ISO string (otomatis dengan timezone)
const localDate = new Date(`${formData.deadline}T${hour}:${minute}:00`);
const deadlineString = localDate.toISOString(); // Hasil: 2025-07-31T07:00:00.000Z (UTC)

console.log('Original input:', `${formData.deadline}T${hour}:${minute}:00`);
console.log('ISO format:', deadlineString);
    
    const tugasPayload = {
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      deadline: deadlineString
    };
    
    console.log('Submitting tugas:', tugasPayload); // Debug log
    
    const result = await addTugas(tugasPayload);
    console.log('Debug - Data yang akan dikirim:', {
    title: tugasPayload.title,
    description: tugasPayload.description,
    deadline: tugasPayload.deadline,
    titleLength: tugasPayload.title?.length,
    descLength: tugasPayload.description?.length
});
    if (result.success) {
      toast.success(result.message || 'Tugas berhasil ditambahkan');
      // Reset form
      setFormData({
        title: '',
        description: '',
        deadline: '',
        deadlineHour: '',
        deadlineMinute: ''
      });
      setTimeout(() => {
        navigate('/tugas');
      }, 1500);
    } else {
      toast.error(result.error || 'Gagal menambahkan tugas');
    }
  } catch (error) {
    console.error('Submit Error:', error);
    toast.error('Terjadi kesalahan saat menambahkan tugas');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen bg-[#f5f6fa] font-sans relative">
      <Toaster position="top-center" />
      
      {/* Tombol hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Mobile */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-80 shadow-lg transition-transform duration-300 bg-white md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="w-80 md:w-64" />
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:block w-72 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-auto w-full">
        {/* Topbar */}
        <div className="flex justify-end items-center p-4 h-16 bg-white md:bg-transparent border-b md:border-none">
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

        {/* Konten Halaman */}
        <main className="p-4 md:p-6 flex-grow">
          <div className="flex flex-col">
            {/* Judul halaman ini mengacu pada halaman asal, yaitu "Daftar Tugas" */}
            <h1 className="text-2xl font-bold mb-4 font-['League_Spartan']">
              Daftar Tugas
            </h1>

            <div className="mb-6">
              <Link
                to="/tugas"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all hover:scale-105 cursor-pointer shadow"
              >
                <ArrowLeft size={20} />
                Back
              </Link>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 pb-4 mb-4 border-b">
                Add Tugas
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Input Title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

               <div className="mb-6">
  <label
    htmlFor="description"
    className="block text-gray-700 text-sm font-medium mb-2"
  >
    Description
  </label>
  <textarea
    id="description"
    name="description"
    value={formData.description}
    onChange={handleInputChange}
    placeholder="Input Description (Maksimal 1000 karakter)"
    rows="4"
    maxLength={MAX_DESCRIPTION_LENGTH}
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
      formData.description.length > MAX_DESCRIPTION_LENGTH * WARNING_THRESHOLD 
        ? 'border-amber-400' 
        : 'border-gray-300'
    }`}
  />
  
  {/* Counter dan Status */}
  <div className="flex justify-between items-center mt-2">
    <div className="flex items-center gap-2">
      <span className={`text-xs ${
        formData.description.length > MAX_DESCRIPTION_LENGTH * WARNING_THRESHOLD
          ? 'text-amber-600 font-medium'
          : 'text-gray-500'
      }`}>
        {formData.description.length}/{MAX_DESCRIPTION_LENGTH} karakter
      </span>
      
      {/* Warning indicator */}
      {formData.description.length > MAX_DESCRIPTION_LENGTH * WARNING_THRESHOLD && (
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
          Mendekati batas maksimum
        </span>
      )}
    </div>
    
    {/* Progress bar */}
    <div className="w-20 bg-gray-200 rounded-full h-1.5">
      <div 
        className={`h-1.5 rounded-full transition-all ${
          formData.description.length > MAX_DESCRIPTION_LENGTH * WARNING_THRESHOLD
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
        style={{ 
          width: `${Math.min((formData.description.length / MAX_DESCRIPTION_LENGTH) * 100, 100)}%` 
        }}
      ></div>
    </div>
  </div>
</div>

                <div className="mb-6">
                  <label
                    htmlFor="deadline"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Deadline (Tanggal)
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="deadlineHour"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Deadline (Jam, 0-23)
                  </label>
                  <select
                    id="deadlineHour"
                    name="deadlineHour"
                    value={formData.deadlineHour}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Pilih Jam</option>
                    {[...Array(24).keys()].map(h => (
                      <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="deadlineMinute"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Deadline (Menit, 0-59)
                  </label>
                  <select
                    id="deadlineMinute"
                    name="deadlineMinute"
                    value={formData.deadlineMinute}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Pilih Menit</option>
                    {[...Array(60).keys()].map(m => (
                      <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
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

export default AddTugas;
