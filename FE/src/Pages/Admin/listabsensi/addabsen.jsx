import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Menu, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { addAbsen } from "../../../utils/absenApi";

export const AddAbsen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !deadline) {
      toast.error("Judul dan tanggal tidak boleh kosong!");
      return;
    }

    setLoading(true);
    try {
      const absenData = {
        title: title,
        tanggal: deadline
      };

      const result = await addAbsen(absenData);
      
      if (result.success) {
        toast.success("Absen berhasil ditambahkan!");
        // Beri jeda sebelum navigasi agar notifikasi terlihat
        setTimeout(() => {
          navigate("/listabsen");
        }, 1500);
      } else {
        toast.error(result.error || 'Gagal menambahkan absen');
      }
    } catch (error) {
      console.error('Error adding absen:', error);
      toast.error('Terjadi kesalahan saat menambahkan absen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f6fa] font-sans relative">

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div
        className={`fixed z-40 top-0 left-0 h-full w-80 shadow-lg transition-transform duration-300 bg-white md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="w-80 md:w-64" />
      </div>
      <div className="hidden md:block w-72 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-auto w-full">
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

        <main className="p-4 md:p-6 flex-grow">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4 font-['League_Spartan']">
              List Absen
            </h1>
            <div className="mb-6">
              <Link
                to="/listabsen"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all hover:scale-105 cursor-pointer shadow"
              >
                <ArrowLeft size={20} />
                Back
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 pb-4 mb-4 border-b">
                Add List Absen
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
                    placeholder="Input nama kegiatan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    placeholder="DD/MM/YYYY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      loading 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-700 hover:scale-105 cursor-pointer'
                    }`}
                  >
                    {loading ? 'Menyimpan...' : 'Submit'}
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

export default AddAbsen;
