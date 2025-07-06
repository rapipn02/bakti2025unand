import React, { useState } from "react";
import { Menu, Search } from "lucide-react"; // Import Search dan X icon
import logoadmin from "../../../assets/admin/admin.svg";
import Sidebar from "../../../component/SidebarAdmin";

// Dummy data untuk tabel
const submissions = [
  // ... (data Anda tetap sama)
  {
    no: 1,
    name: "Nama 1",
    nim: "25000000",
    kelompok: "Kelompok 1",
    tugas: "Title 1",
    link: "Link 1",
    submitted: "DD/MM/YYYY",
  },
  {
    no: 2,
    name: "Nama 2",
    nim: "25000000",
    kelompok: "Kelompok 2",
    tugas: "Title 2",
    link: "Link 2",
    submitted: "DD/MM/YYYY",
  },
  {
    no: 3,
    name: "Nama 3",
    nim: "25000000",
    kelompok: "Kelompok 3",
    tugas: "Title 3",
    link: "Link 3",
    submitted: "DD/MM/YYYY",
  },
  {
    no: 4,
    name: "Nama 4",
    nim: "25000000",
    kelompok: "Kelompok 4",
    tugas: "Title 4",
    link: "Link 4",
    submitted: "DD/MM/YYYY",
  },
  {
    no: 5,
    name: "Nama 5",
    nim: "25000000",
    kelompok: "Kelompok 5",
    tugas: "Title 5",
    link: "Link 5",
    submitted: "DD/MM/YYYY",
  },
];

export const Kumpultugas = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Tombol hamburger */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* --- SIDEBAR AREA --- */}

      {/* Sidebar Mobile (Off-canvas) */}
      <div
        className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="relative w-72 h-full bg-white shadow-xl">
          {/* --- INI BAGIAN YANG DIUBAH --- */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-800"
            aria-label="Close sidebar"
          ></button>
          <Sidebar className="w-80 md:w-64" />
        </div>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <Sidebar className="w-80 md:w-64" />
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex justify-between items-center  p-3 md:p-4 h-16 flex-shrink-0 ">
          <div className="flex-grow"></div>
          <div className="flex justify-end items-center p-0 h-16   ">
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
        </header>

       

        {/* Main Content Area */}
        <main className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold font-['League_Spartan'] text-gray-800">
              Pengumpulan Tugas
            </h1>
            <button className="bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 cursor-pointer w-full md:w-auto">
              Export
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                <option>By Name</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                <option>Pilih Kelompok</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                <option>By Title</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg overflow-x-auto shadow border">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-gray-100 border-b-2 border-gray-600">
                <tr>
                  <th className="py-3 px-6 font-semibold text-gray-600">No</th>
                  <th className="py-3 px-6 font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="py-3 px-6 font-semibold text-gray-600">NIM</th>
                  <th className="py-3 px-6 font-semibold text-gray-600">
                    Kelompok
                  </th>
                  <th className="py-3 px-6 font-semibold text-gray-600">
                    Tugas
                  </th>
                  <th className="py-3 px-6 font-semibold text-gray-600">
                    Link Tugas
                  </th>
                  <th className="py-3 px-6 font-semibold text-gray-600">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {submissions.map((item) => (
                  <tr key={item.no} className="hover:bg-green-50">
                    <td className="py-4 px-6 text-gray-700">{item.no}</td>
                    <td className="py-4 px-6 text-gray-700">{item.name}</td>
                    <td className="py-4 px-6 text-gray-700">{item.nim}</td>
                    <td className="py-4 px-6 text-gray-700">{item.kelompok}</td>
                    <td className="py-4 px-6 text-gray-700">{item.tugas}</td>
                    <td className="py-4 px-6 text-green-600 hover:underline cursor-pointer">
                      {item.link}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {item.submitted}
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

export default Kumpultugas;
