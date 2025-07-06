import React, { useState } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import { ArrowLeft, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logoadmin from "../../../assets/admin/admin.svg";

// 1. Impor Toaster dan toast dari library
import { Toaster, toast } from "react-hot-toast";

export const AddKelompok = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nomorKelompok, setNomorKelompok] = useState("");
  const [noIdKelompok, setNoIdKelompok] = useState("");
  const [jumlahAnggota, setJumlahAnggota] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nomorKelompok || !noIdKelompok || !jumlahAnggota) {
      // Anda juga bisa mengganti ini dengan toast error
      toast.error("Semua field wajib diisi!");
      return;
    }

    const newGroup = {
      id: Date.now(),
      namaKegiatan: `Kegiatan Kelompok ${nomorKelompok}`,
      kelompok: nomorKelompok,
      anggota: jumlahAnggota,
      noId: noIdKelompok,
    };

    const existingGroups = JSON.parse(localStorage.getItem("groupData")) || [];
    const updatedGroups = [...existingGroups, newGroup];
    localStorage.setItem("groupData", JSON.stringify(updatedGroups));

    // 3. Ganti alert() dengan toast.success()
    toast.success("Kelompok berhasil ditambahkan!");

    // Beri sedikit jeda agar user bisa melihat notifikasi sebelum pindah halaman
    setTimeout(() => {
      navigate("/kelompok");
    }, 1500); // Pindah halaman setelah 1.5 detik
  };

  return (
    <div className="flex h-screen bg-[#f5f6fa] font-sans relative">
      {/* 2. Tambahkan komponen <Toaster /> di mana saja dalam return.
          Biasanya diletakkan di bagian paling atas atau bawah. */}
      <Toaster position="top-center" reverseOrder={false} />

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
                      Kelompok
                    </label>
                    <input
                      type="text"
                      id="kelompok"
                      value={nomorKelompok}
                      onChange={(e) => setNomorKelompok(e.target.value)}
                      placeholder="Input nomor kelompok"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A96E]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="noId"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      No ID
                    </label>
                    <input
                      type="text"
                      id="noId"
                      value={noIdKelompok}
                      onChange={(e) => setNoIdKelompok(e.target.value)}
                      placeholder="Input no ID kelompok"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A96E]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="anggota"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Anggota
                    </label>
                    <input
                      type="number"
                      id="anggota"
                      value={jumlahAnggota}
                      onChange={(e) => setJumlahAnggota(e.target.value)}
                      placeholder="Input jumlah anggota kelompok"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A96E]"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-2 font-bold text-white bg-emerald-500 rounded-full hover:bg-emerald-700 transition-all cursor-pointer hover:scale-105"
                    >
                      Submit
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
