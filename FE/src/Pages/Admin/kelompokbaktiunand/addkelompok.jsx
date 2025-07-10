import React, { useState } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import { ArrowLeft, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logoadmin from "../../../assets/admin/admin.svg";
import { toast } from "react-hot-toast";
import { addKelompok } from "../../../utils/kelompokApi";

export const AddKelompok = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nomorKelompok, setNomorKelompok] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nomorKelompok) {
      toast.error("Nomor kelompok wajib diisi!");
      return;
    }

    // Validasi nomor kelompok harus berupa angka
    const nomor = parseInt(nomorKelompok);
    if (isNaN(nomor) || nomor <= 0) {
      toast.error("Nomor kelompok harus berupa angka positif!");
      return;
    }

    setLoading(true);
    try {
      // Coba tambah via API terlebih dahulu
      const result = await addKelompok({ nomor });
      
      if (result.success) {
        toast.success(result.message || "Kelompok berhasil ditambahkan!");
        
        // Pindah ke halaman kelompok setelah berhasil
        setTimeout(() => {
          navigate("/kelompok");
        }, 1500);
      } else {
        // Jika API gagal, gunakan localStorage sebagai fallback
        console.warn('API add failed, using localStorage:', result.error);
        
        // Periksa data yang sudah ada di localStorage
        const existingData = JSON.parse(localStorage.getItem('kelompokData') || '[]');
        
        // Cek apakah nomor kelompok sudah ada
        const isDuplicate = existingData.some(group => group.nomor === nomor);
        if (isDuplicate) {
          toast.error(`Kelompok ${nomor} sudah ada!`);
          setLoading(false);
          return;
        }

        // Buat data kelompok baru
        const newKelompok = {
          id: Date.now().toString(), // ID sederhana untuk localStorage
          nomor: nomor,
          anggota: 0, // Default 0 anggota
          createdAt: new Date().toISOString()
        };

        // Tambahkan ke array yang sudah ada
        const updatedData = [...existingData, newKelompok];
        
        // Simpan ke localStorage
        localStorage.setItem('kelompokData', JSON.stringify(updatedData));
        
        toast.success("Kelompok berhasil ditambahkan (offline)!");
        
        // Pindah ke halaman kelompok setelah berhasil
        setTimeout(() => {
          navigate("/kelompok");
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding kelompok:', error);
      
      // Fallback ke localStorage jika ada error
      try {
        // Periksa data yang sudah ada di localStorage
        const existingData = JSON.parse(localStorage.getItem('kelompokData') || '[]');
        
        // Cek apakah nomor kelompok sudah ada
        const isDuplicate = existingData.some(group => group.nomor === nomor);
        if (isDuplicate) {
          toast.error(`Kelompok ${nomor} sudah ada!`);
          setLoading(false);
          return;
        }

        // Buat data kelompok baru
        const newKelompok = {
          id: Date.now().toString(),
          nomor: nomor,
          anggota: 0,
          createdAt: new Date().toISOString()
        };

        // Tambahkan ke array yang sudah ada
        const updatedData = [...existingData, newKelompok];
        
        // Simpan ke localStorage
        localStorage.setItem('kelompokData', JSON.stringify(updatedData));
        
        toast.success("Kelompok berhasil ditambahkan (offline)!");
        
        // Pindah ke halaman kelompok setelah berhasil
        setTimeout(() => {
          navigate("/kelompok");
        }, 1500);
      } catch (storageError) {
        console.error('Storage error:', storageError);
        toast.error("Terjadi kesalahan saat menambahkan kelompok");
      }
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
      <div className="hidden md:block flex-shrink-0">
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
              Kelompok
            </h1>
            <div className="mb-6">
              <Link
                to="/kelompok"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all hover:scale-105 cursor-pointer shadow"
              >
                <ArrowLeft size={20} />
                Back
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-8 border">
              <h2 className="text-xl font-bold text-gray-800 pb-4 mb-4 border-b">
                Add Kelompok
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="kelompok"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Nomor Kelompok
                    </label>
                    <input
                      type="number"
                      id="kelompok"
                      value={nomorKelompok}
                      onChange={(e) => setNomorKelompok(e.target.value)}
                      placeholder="Input nomor kelompok (contoh: 1, 2, 3)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A96E]"
                      required
                      min="1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Masukkan nomor unik untuk kelompok ini
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-8 py-2 font-bold text-white rounded-full transition-all cursor-pointer hover:scale-105 ${
                        loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-emerald-500 hover:bg-emerald-700'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menyimpan...
                        </div>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddKelompok;
