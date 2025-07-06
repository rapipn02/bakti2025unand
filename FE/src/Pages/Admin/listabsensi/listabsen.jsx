import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Menu, AlertTriangle } from "lucide-react";

// 1. Impor dari react-hot-toast
import { Toaster, toast } from "react-hot-toast";

export const ListAbsen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("absenData")) || [];
    const formattedData = storedData.map((item) => {
      if (item.tanggal && item.tanggal.includes("-")) {
        const [year, month, day] = item.tanggal.split("-");
        return { ...item, tanggal: `${day}/${month}/${year}` };
      }
      return item;
    });
    setData(formattedData);
  }, []);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    const updatedData = data.filter((item) => item.id !== itemToDelete);
    setData(updatedData);

    const rawDataToStore = JSON.parse(
      localStorage.getItem("absenData") || "[]"
    ).filter((d) => d.id !== itemToDelete);
    localStorage.setItem("absenData", JSON.stringify(rawDataToStore));

    setIsConfirmModalOpen(false);
    setItemToDelete(null);

    // Panggilan notifikasi ini tetap sama
    toast.success("Data berhasil dihapus!");
  };

  const handleEdit = (item) => {
    const [day, month, year] = item.tanggal.split("/");
    setCurrentItem({ ...item, tanggal: `${year}-${month}-${day}` });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedData = data.map((item) =>
      item.id === currentItem.id ? currentItem : item
    );
    localStorage.setItem("absenData", JSON.stringify(updatedData));
    const formattedData = updatedData.map((item) => {
      if (item.tanggal && item.tanggal.includes("-")) {
        const [year, month, day] = item.tanggal.split("-");
        return { ...item, tanggal: `${day}/${month}/${year}` };
      }
      return item;
    });
    setData(formattedData);

    setIsEditModalOpen(false);
    setCurrentItem(null);
  };

  return (
    <div className="flex h-screen bg-[#f5f6fa] font-sans relative">
      {/* 2. Ganti komponen menjadi <Toaster /> */}
      <Toaster position="top-center" />

      {/* ... sisa kode Anda (tidak ada yang berubah) ... */}
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
          <h1 className="text-2xl font-bold mb-4 font-['League_Spartan']">
            List Absen
          </h1>

          <a
            href="/addabsen"
            className="inline-block text-center bg-emerald-500 text-white text-lg px-4 py-2 rounded-md mb-4 hover:bg-emerald-700 shadow cursor-pointer w-full sm:w-auto font-['League_Spartan'] duration-300 hover:scale-105 trasnsition-all"
          >
            + Add List Absen
          </a>

          <div className="bg-white rounded-lg overflow-x-auto shadow border">
            <table className="min-w-[600px] w-full text-sm text-center table-auto border-collapse">
              <thead className="border-b">
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">No</th>
                  <th className="px-3 py-2">Nama Kegiatan</th>
                  <th className="px-3 py-2">Tanggal</th>
                  <th className="px-3 py-2">Hadir</th>
                  <th className="px-3 py-2">Alfa</th>
                  <th className="px-3 py-2">Sakit</th>
                  <th className="px-3 py-2">Izin</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-gray-500">
                      Belum ada data. Silakan tambahkan list absen baru.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id} className="border-t hover:bg-green-50">
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">{item.kegiatan}</td>
                      <td className="py-2">{item.tanggal}</td>
                      <td className="py-2">0</td>
                      <td className="py-2">0</td>
                      <td className="py-2">0</td>
                      <td className="py-2">0</td>
                      <td className="py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-green-200 text-green-800 px-3 py-1 rounded-md text-xs hover:bg-green-300 duration-300 hover:scale-105 transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs hover:bg-red-200 duration-300 hover:scale-105 transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isEditModalOpen && currentItem && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Data Absen</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kegiatan
                </label>
                <input
                  type="text"
                  value={currentItem.kegiatan}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, kegiatan: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={currentItem.tanggal}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, tanggal: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 m-4 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Hapus Data
            </h3>
            <p className="text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 rounded-lg bg-slate-500 text-white hover:bg-red-700 font-medium transition-all cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAbsen;
