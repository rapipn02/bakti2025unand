import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Menu, Search, Download, Eye, X } from "lucide-react";
import logoadmin from "../../../assets/admin/admin.svg";
import Sidebar from "../../../component/SidebarAdmin";
import { getKumpulTugasByKelompok, searchKumpulTugasByKelompok, getTugasList } from "../../../utils/tugasApi";
import { getKelompokList } from "../../../utils/kelompokApi";
import { toast } from "react-hot-toast";

export const Kumpultugas = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [tugasList, setTugasList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelompok, setSelectedKelompok] = useState("");
  const [selectedTugas, setSelectedTugas] = useState("");
  const [searchBy, setSearchBy] = useState("nama"); // nama, nim, or tugas

  // Dummy data fallback
  const dummySubmissions = useMemo(() => [
    {
      id: "1",
      nama: "Nama 1",
      nim: "25000000",
      kelompok: 1,
      tugas: { title: "Title 1" },
      link_tugas: "https://example.com/link1",
      createAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      nama: "Nama 2",
      nim: "25000001",
      kelompok: 2,
      tugas: { title: "Title 2" },
      link_tugas: "https://example.com/link2",
      createAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: "3",
      nama: "Nama 3",
      nim: "25000002",
      kelompok: 1,
      tugas: { title: "Title 3" },
      link_tugas: "https://example.com/link3",
      createAt: "2024-01-03T00:00:00.000Z",
    },
  ], []);

  // Load submissions data
  const loadSubmissions = useCallback(async (page = 1) => {
    // Jangan load data jika kelompok dan tugas belum dipilih
    if (!selectedKelompok || !selectedTugas) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let result;

      if (searchTerm) {
        // Search with filters
        result = await searchKumpulTugasByKelompok(
          selectedKelompok,
          searchBy,
          searchTerm,
          page
        );
      } else {
        // Filter by kelompok and tugas
        result = await getKumpulTugasByKelompok(selectedKelompok, selectedTugas, page);
      }

      if (result.success) {
        setSubmissions(result.data || []);
        setCurrentPage(result.currentPage || 1);
        setTotalPages(result.totalPages || 1);
      } else {
        console.warn("API failed, using dummy data:", result.error);
        // Filter dummy data based on selected kelompok and tugas
        const filteredDummy = dummySubmissions.filter(item => 
          item.kelompok == selectedKelompok && 
          (item.tugas?.title === tugasList.find(t => t.id == selectedTugas)?.title)
        );
        setSubmissions(filteredDummy);
        setCurrentPage(1);
        setTotalPages(1);
        
        if (!sessionStorage.getItem('kumpul-tugas-offline-notified')) {
          toast.error('Menggunakan data offline. API tidak tersedia.');
          sessionStorage.setItem('kumpul-tugas-offline-notified', 'true');
        }
      }
    } catch (error) {
      console.error("Error loading submissions:", error);
      // Filter dummy data based on selected kelompok and tugas
      const filteredDummy = dummySubmissions.filter(item => 
        item.kelompok == selectedKelompok && 
        (item.tugas?.title === tugasList.find(t => t.id == selectedTugas)?.title)
      );
      setSubmissions(filteredDummy);
      setCurrentPage(1);
      setTotalPages(1);
      
      if (!sessionStorage.getItem('kumpul-tugas-demo-notified')) {
        toast.error('API tidak tersedia, menggunakan data demo.');
        sessionStorage.setItem('kumpul-tugas-demo-notified', 'true');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedKelompok, selectedTugas, searchTerm, searchBy, dummySubmissions, tugasList]);

  // Load kelompok and tugas lists
  const loadReferenceData = useCallback(async () => {
    try {
      // Load kelompok list
      const kelompokResult = await getKelompokList();
      if (kelompokResult.success) {
        console.log('Kelompok data loaded:', kelompokResult.data);
        setKelompokList(kelompokResult.data || []);
      } else {
        console.warn("Failed to load kelompok:", kelompokResult.error);
        // Fallback kelompok data
        setKelompokList([
          { id: 1, nomor: 1 },
          { id: 2, nomor: 2 },
          { id: 3, nomor: 3 },
        ]);
      }

      // Load tugas list
      const tugasResult = await getTugasList();
      if (tugasResult.success) {
        setTugasList(tugasResult.data || []);
      } else {
        console.warn("Failed to load tugas:", tugasResult.error);
        // Fallback tugas data
        setTugasList([
          { id: "tugas1", title: "Title 1" },
          { id: "tugas2", title: "Title 2" },
          { id: "tugas3", title: "Title 3" },
        ]);
      }
    } catch (error) {
      console.error("Error loading reference data:", error);
    }
  }, []);

  // Load data on mount and when filters change
  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // Handle filter changes
  const handleKelompokChange = useCallback((value) => {
    setSelectedKelompok(value);
    setCurrentPage(1);
  }, []);

  const handleTugasChange = useCallback((value) => {
    setSelectedTugas(value);
    setCurrentPage(1);
  }, []);

  const handleSearchByChange = useCallback((value) => {
    setSearchBy(value);
    setCurrentPage(1);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    loadSubmissions(page);
  }, [loadSubmissions]);

  // Export functionality
  const handleExport = useCallback(() => {
    if (!selectedKelompok || !selectedTugas) {
      toast.error('Pilih kelompok dan tugas terlebih dahulu');
      return;
    }

    if (submissions.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    try {
      const selectedKelompokData = kelompokList.find(k => String(k.nomor) === String(selectedKelompok));
      const selectedTugasData = tugasList.find(t => t.id == selectedTugas);
      // Create CSV content
      const headers = ["No", "Name", "NIM", "Kelompok", "Tugas", "Link Tugas", "Submitted"];
      const kelompokName = selectedKelompokData ? `Kelompok ${selectedKelompokData.nomor}` : 'N/A';
      const csvContent = [
        headers.join(","),
        ...submissions.map((item, index) => {
          const tugasTitle = item.tugas?.title || item.tugas || "N/A";
          const submittedDate = item.createAt ? new Date(item.createAt).toLocaleDateString() : "N/A";
          return [
            index + 1,
            `"${item.nama || item.name || ""}"`,
            item.nim || "",
            `"${kelompokName}"`,
            `"${tugasTitle}"`,
            `"${item.link_tugas || item.link || ""}"`,
            submittedDate
          ].join(",");
        })
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      
      // Generate filename with kelompok and tugas info
      const filename = `pengumpulan_tugas_kelompok_${selectedKelompokData?.nomor || 'unknown'}_${selectedTugasData?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'tugas'}.csv`;
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Data berhasil diekspor! (${submissions.length} pengumpulan)`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengekspor data");
    }
  }, [submissions, selectedKelompok, selectedTugas, kelompokList, tugasList]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
      return "N/A";
    }
  };

  // Get kelompok name
  const getKelompokName = (kelompokData) => {
    // Jika object dan ada nomor
    if (typeof kelompokData === 'object' && kelompokData?.nomor) {
      return `Kelompok ${kelompokData.nomor}`;
    }
    // Jika object dan ada id, cari di kelompokList
    if (typeof kelompokData === 'object' && kelompokData?.id && kelompokList.length > 0) {
      const found = kelompokList.find(k => String(k.nomor) === String(kelompokData.id));
      if (found && found.nomor) {
        return `Kelompok ${found.nomor}`;
      }
      return 'N/A';
    }
    // Jika number/string, cari di kelompokList
    if ((typeof kelompokData === 'number' || typeof kelompokData === 'string') && kelompokList.length > 0) {
      const found = kelompokList.find(k => String(k.nomor) === String(kelompokData));
      if (found && found.nomor) {
        return `Kelompok ${found.nomor}`;
      }
      return 'N/A';
    }
    return 'N/A';
  };

  // Get tugas title
  const getTugasTitle = (tugasData) => {
    if (typeof tugasData === 'object' && tugasData?.title) {
      return tugasData.title;
    }
    if (typeof tugasData === 'string') {
      return tugasData;
    }
    return "N/A";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
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
            <button 
              onClick={handleExport}
              disabled={!selectedKelompok || !selectedTugas || submissions.length === 0}
              className="bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 cursor-pointer w-full md:w-auto flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Download className="w-4 h-4" />
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
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={!selectedKelompok || !selectedTugas}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select 
                value={searchBy}
                onChange={(e) => handleSearchByChange(e.target.value)}
                disabled={!selectedKelompok || !selectedTugas}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="nama">By Name</option>
                <option value="nim">By NIM</option>
                <option value="tugas">By Tugas</option>
              </select>
              <select 
                value={selectedKelompok}
                onChange={(e) => handleKelompokChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="">Pilih Kelompok *</option>
                {kelompokList.map((kelompok) => (
                  <option key={kelompok.id} value={kelompok.nomor}>
                    Kelompok {kelompok.nomor}
                  </option>
                ))}
              </select>
              <select 
                value={selectedTugas}
                onChange={(e) => handleTugasChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="">Pilih Tugas *</option>
                {tugasList.map((tugas) => (
                  <option key={tugas.id} value={tugas.id}>
                    {tugas.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info Message */}
          {(!selectedKelompok || !selectedTugas) && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Petunjuk:</strong> Silakan pilih kelompok dan tugas terlebih dahulu untuk melihat daftar pengumpulan tugas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          {!selectedKelompok || !selectedTugas ? (
            <div className="bg-white rounded-lg shadow border p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Pilih Kelompok dan Tugas
              </h3>
              <p className="text-gray-500 mb-4">
                Untuk melihat daftar pengumpulan tugas, silakan pilih kelompok dan tugas terlebih dahulu.
              </p>
              <div className="text-sm text-gray-400">
                <p>• Pilih kelompok dari dropdown "Pilih Kelompok"</p>
                <p>• Pilih tugas dari dropdown "Pilih Tugas"</p>
              </div>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-lg shadow border p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data pengumpulan tugas...</p>
              <p className="text-sm text-gray-500 mt-2">
                Kelompok: {kelompokList.find(k => k.nomor == selectedKelompok)?.nomor} | 
                Tugas: {tugasList.find(t => t.id == selectedTugas)?.title}
              </p>
            </div>
          ) : (
            <>
              {/* Header Info */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700">
                      <strong>Menampilkan pengumpulan tugas untuk:</strong>
                    </p>
                    <p className="text-emerald-800 font-medium">
                      Kelompok: {kelompokList.find(k => k.nomor == selectedKelompok)?.nomor} | 
                      Tugas: {tugasList.find(t => t.id == selectedTugas)?.title}
                    </p>
                  </div>
                  <div className="text-sm text-emerald-600">
                    Total: {submissions.length} pengumpulan
                  </div>
                </div>
              </div>

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
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <Eye className="w-12 h-12 text-gray-300 mb-2" />
                            <p>Tidak ada pengumpulan tugas untuk kelompok dan tugas yang dipilih</p>
                            <p className="text-sm mt-1">
                              Mungkin belum ada mahasiswa yang mengumpulkan tugas ini
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      submissions.map((item, index) => (
                        <tr key={item.id} className="hover:bg-green-50">
                          <td className="py-4 px-6 text-gray-700">
                            {(currentPage - 1) * 10 + index + 1}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {item.nama || item.name}
                          </td>
                          <td className="py-4 px-6 text-gray-700">{item.nim}</td>
                          <td className="py-4 px-6 text-gray-700">
                            {/* Selalu tampilkan kelompok sesuai filter */}
                            {`Kelompok ${kelompokList.find(k => String(k.nomor) === String(selectedKelompok))?.nomor || 'N/A'}`}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {getTugasTitle(item.tugas)}
                          </td>
                          <td className="py-4 px-6">
                            {/* Cek apakah submission lewat deadline */}
                            {(() => {
                              // Cari deadline tugas dari tugasList
                              const tugasData = tugasList.find(t => String(t.id) === String(selectedTugas));
                              const deadline = tugasData?.deadline ? new Date(tugasData.deadline) : null;
                              const submittedDate = item.createAt ? new Date(item.createAt) : null;
                              if (deadline && submittedDate && submittedDate > deadline) {
                                // Sudah lewat deadline
                                return (
                                  <span className="text-red-500 font-semibold">Terlambat</span>
                                );
                              } else if (item.link_tugas || item.link) {
                                // Belum lewat deadline, tampilkan tombol lihat
                                return (
                                  <a
                                    href={item.link_tugas || item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:underline cursor-pointer flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Link
                                  </a>
                                );
                              } else {
                                return <span className="text-gray-400">No link</span>;
                              }
                            })()}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {formatDate(item.createAt || item.submitted)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Kumpultugas;
