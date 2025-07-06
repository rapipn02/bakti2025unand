import React, { useState, useEffect } from "react"; // 1. Impor useEffect
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Menu, Search } from "lucide-react";

export const Absensi = () => {
  const [selectedKelompok, setSelectedKelompok] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 2. Ganti data statis dengan state
  const [absenData, setAbsenData] = useState([]);

  // 3. Tambahkan useEffect untuk mengambil data dari localStorage
  useEffect(() => {
    // Ambil data yang disimpan oleh ListAbsen.jsx
    const storedData = JSON.parse(localStorage.getItem("absenData")) || [];

    // Format tanggal dari YYYY-MM-DD menjadi DD/MM/YYYY agar konsisten
    const formattedData = storedData.map((item) => {
      if (item.tanggal && item.tanggal.includes("-")) {
        const [year, month, day] = item.tanggal.split("-");
        return { ...item, tanggal: `${day}/${month}/${year}` };
      }
      return item;
    });

    setAbsenData(formattedData);
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat komponen dimuat

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
          <h2 className="text-2xl font-bold mb-4  font-['League_Spartan']">
            Anggota Kelompok
          </h2>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search Items"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedKelompok}
              onChange={(e) => setSelectedKelompok(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm w-full md:w-1/3 cursor-pointer"
            >
              <option value="">Pilih Kelompok</option>
              <option value="1">Kelompok 1</option>
              <option value="2">Kelompok 2</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl px-4 py-4 overflow-x-auto shadow border">
            <h3 className="font-medium mb-4">
              Kelompok {selectedKelompok || "1"}
            </h3>
            <table className="w-full text-sm text-center border-collapse min-w-[600px] ">
              <thead>
                <tr className="bg-gray-100 text-gray-800 border-b">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama Kegiatan</th>
                  <th className="px-4 py-2">Tanggal</th>
                  <th className="px-4 py-2">Hadir</th>
                  <th className="px-4 py-2">Alfa</th>
                  <th className="px-4 py-2">Sakit</th>
                  <th className="px-4 py-2">Izin</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* 4. Ganti 'data.map' menjadi 'absenData.map' */}
                {absenData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-gray-500">
                      Belum ada data absen. Silakan tambahkan melalui halaman
                      List Absen.
                    </td>
                  </tr>
                ) : (
                  absenData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-green-50 border-b transition"
                    >
                      <td className="py-2">{index + 1}</td>
                      <td>{item.kegiatan}</td>
                      <td>{item.tanggal}</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>
                        <button className="bg-emerald-100 text-emerald-700 font-semibold px-4 py-1 rounded-md text-sm hover:bg-emerald-200 duration-300 transition-all hover:scale-105 cursor-pointer">
                          Scan
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Absensi;
