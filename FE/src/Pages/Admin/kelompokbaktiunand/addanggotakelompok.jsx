import React, { useState } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { ArrowLeft, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export const AddAnggotaKelompok = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [kelompok, setKelompok] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = { nama, nim, kelompok };
    console.log("Data Anggota Baru:", formData);
    alert("Anggota kelompok berhasil ditambahkan!");
  };

  return (
    <div className="flex h-screen bg-[#f5f6fa] font-sans relative">
      {/* Tombol hamburger */}
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

      {/* Sidebar untuk Desktop */}
      <div className="hidden md:block flex-shrink-0">
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

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* ================= PERUBAHAN DI SINI ================= */}
          {/* Wrapper diubah untuk menjadi rata kiri */}
          <div className="w-full max-w-6xl">
            {" "}
            {/* <-- Kelas 'mx-auto' telah dihapus */}
            <h1 className="text-3xl md:text-2xl font-bold text-gray-800 font-['League_Spartan']">
              Anggota Kelompok
            </h1>
            <div className="my-6">
              <Link
                to="/anggotakelompok"
                className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-[#00A96E] rounded-full shadow-md hover:bg-[#00935F] transition-all cursor-pointer hover:scale-105"
              >
                <ArrowLeft size={20} />
                Back
              </Link>
            </div>
            {/* Form Container (Isi tidak berubah) */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border">
              <h2 className="text-xl font-bold text-gray-800 pb-4 mb-6 border-b font-['League_Spartan']">
                Add Anggota Kelompok
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Field: Nama */}
                  <div>
                    <label
                      htmlFor="nama"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Nama
                    </label>
                    <input
                      type="text"
                      id="nama"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Input Nama"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A96E]"
                    />
                  </div>

                  {/* Field: NIM */}
                  <div>
                    <label
                      htmlFor="nim"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      NIM
                    </label>
                    <input
                      type="text"
                      id="nim"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      placeholder="Input NIM"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A96E]"
                    />
                  </div>

                  {/* Field: Kelompok */}
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
                      value={kelompok}
                      onChange={(e) => setKelompok(e.target.value)}
                      placeholder="Input Kelompok"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A96E]"
                    />
                  </div>

                  {/* Tombol Submit */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-2 font-bold text-white bg-emerald-500 rounded-full hover:bg-emerald-700  transition-all cursor-pointer hover:scale-105"
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

export default AddAnggotaKelompok;
