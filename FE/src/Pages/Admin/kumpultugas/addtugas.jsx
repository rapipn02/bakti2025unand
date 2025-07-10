import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Menu, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { addTugas } from "../../../utils/tugasApi";

export const AddTugas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.deadline) {
      toast.error('Judul dan deadline harus diisi');
      return;
    }

    try {
      setLoading(true);
      const result = await addTugas({
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline
      });

      if (result.success) {
        toast.success(result.message || 'Tugas berhasil ditambahkan');
        // Reset form
        setFormData({
          title: '',
          description: '',
          deadline: ''
        });
        // Navigate back to tugas list after short delay
        setTimeout(() => {
          navigate('/tugas');
        }, 1500);
      } else {
        toast.error(result.error || 'Gagal menambahkan tugas');
      }
    } catch (error) {
      console.error('Error adding tugas:', error);
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
                    placeholder="Input Description"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="deadline"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
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
