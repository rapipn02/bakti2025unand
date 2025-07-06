import React, { useState } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Link } from "react-router-dom";
// Import disesuaikan, hanya Menu dan X yang digunakan
import { Menu } from "lucide-react";

// Contoh data tugas
const tasks = [
  { id: 1, title: "Membuat Laporan Pendahuluan", deadline: "30 Juni 2025" },
  { id: 2, title: "Presentasi Kelompok", deadline: "05 Juli 2025" },
  { id: 3, title: "Pengumpulan Video Dokumentasi", deadline: "10 Juli 2025" },
  { id: 4, title: "Review Jurnal Ilmiah", deadline: "15 Juli 2025" },
];

export const Tugas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              className="inline-block text-center bg-emerald-500 text-white text-lg px-4 py-2 rounded-md mb-4 hover:bg-emerald-700 shadow cursor-pointer w-full sm:w-auto font-['League_Spartan'] duration-300 hover:scale-105 trasnsition-all"
            >
              + Add Tugas
            </Link>
          </div>

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
                {tasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-green-50">
                    <td className="py-4 px-6 text-gray-700">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-900 font-medium">
                      {task.title}
                    </td>
                    <td className="py-4 px-6 text-gray-700">{task.deadline}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        {/* ===== TOMBOL AKSI DIUBAH MENJADI TEKS ===== */}
                        <button className="bg-emerald-200 text-green-600 text-xs font-semibold px-3 py-1 rounded-md hover:bg-green-300  cursor-pointer duration-300 hover:scale-105">
                          Edit
                        </button>
                        <button className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-200 cursor-pointer duration-300 hover:scale-105">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tugas;
