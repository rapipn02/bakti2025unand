import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/SidebarAdmin";
import logoadmin from "../../../assets/admin/admin.svg";
import { Link } from "react-router-dom";
// 1. Impor ikon X untuk tombol tutup modal
import { Menu, Search, ScanLine, X } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
// 2. Impor library untuk membuat komponen QR Code

// DATA CONTOH: Saya tambahkan data dari gambar agar bisa dites
const memberData = [
  { id: 1, nama: "Budi Santoso", nim: "123456789", kelompok: "Kelompok A" },
  { id: 2, nama: "Citra Lestari", nim: "987654321", kelompok: "Kelompok B" },
  { id: 3, nama: "fadhilah aisyah putri", nim: "2211513004", kelompok: "1" },
];

export const AnggotaKelompok = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScannerOpen, setScannerOpen] = useState(false);

  // Hapus state `scannedData` yang tidak lagi digunakan
  // const [scannedData, setScannedData] = useState(null);

  // 3. State baru untuk menyimpan data lengkap anggota yang berhasil dipindai
  const [scannedMember, setScannedMember] = useState(null);

  useEffect(() => {
    if (isScannerOpen) {
      // 4. Logika `onScanSuccess` diubah untuk mencari data anggota
      const onScanSuccess = (decodedText, decodedResult) => {
        // Cari anggota berdasarkan NIM dari hasil pindaian
        const member = memberData.find((m) => m.nim === decodedText);

        if (member) {
          setScannedMember(member); // Simpan data anggota yang ditemukan
          setScannerOpen(false); // Tutup pemindai
        } else {
          // Beri tahu pengguna jika data tidak ditemukan
          alert(`Anggota dengan NIM "${decodedText}" tidak ditemukan.`);
        }
      };

      const onScanError = (errorMessage) => {
        // Abaikan error "QR code not found" yang muncul terus-menerus
      };

      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      // Panggil `render` dengan `onScanError` untuk pengalaman pengguna yang lebih baik
      html5QrcodeScanner.render(onScanSuccess, onScanError);

      return () => {
        // Cek status scanner sebelum membersihkannya untuk mencegah error
        if (html5QrcodeScanner && html5QrcodeScanner.getState() === 2) {
          html5QrcodeScanner.clear().catch((error) => {
            console.error("Gagal membersihkan scanner.", error);
          });
        }
      };
    }
  }, [isScannerOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setScannerOpen(false);
    }
  };

  // 5. Fungsi untuk tombol Download dan Print di modal baru
  const handleDownload = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_Code_${scannedMember.nama}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handlePrint = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas && scannedMember) {
      const dataUrl = canvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head><title>Print QR Code - ${scannedMember.nama}</title></head>
          <body style="text-align:center; font-family:sans-serif; padding-top: 20px;">
            <h2>QR Code Absensi</h2>
            <h3>${scannedMember.nama}</h3>
            <img src="${dataUrl}" style="width:250px; height:250px;" />
            <p>NIM: ${scannedMember.nim} | Kelompok: ${scannedMember.kelompok}</p>
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    // STRUKTUR UTAMA TIDAK DIUBAH SAMA SEKALI
    <div className="flex h-screen bg-gray-50 font-sans">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <Sidebar />
        </div>
      </div>

      <div
        className={`fixed z-40 top-0 left-0 h-full w-80 shadow-lg transition-transform duration-300 bg-white md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="w-80 md:w-64" />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex justify-between items-center  p-3 md:p-4 h-16 flex-shrink-0 ">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-grow"></div>
          <div className="flex justify-end items-center p-0 h-16">
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

        <main className="p-4 md:p-8 flex-grow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 font-['League_Spartan']">
            Anggota Kelompok
          </h1>

          <div className="mb-6">
            <Link
              to="/addanggotakelompok"
              className="inline-block text-center bg-emerald-500 text-white text-lg px-4 py-2 rounded-md mb-4 hover:bg-emerald-700 shadow cursor-pointer w-full sm:w-auto font-['League_Spartan'] duration-300 hover:scale-105 trasnsition-all"
            >
              + Add Anggota Kelompok
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search Items"
                className="w-full pl-10 pr-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
              <option>Pilih Nama</option>
            </select>
            <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
              <option>Pilih Kelompok</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow border overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b-2 border-gray-200 bg-gray-50">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-600">No</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">
                    Nama
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600">NIM</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">
                    Kelompok
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-center">
                    QR
                  </th>
                </tr>
              </thead>
              <tbody>
                {memberData.map((member, index) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{member.nama}</td>
                    <td className="py-3 px-4">{member.nim}</td>
                    <td className="py-3 px-4">{member.kelompok}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setScannerOpen(true)}
                        className="flex items-center gap-2 mx-auto bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-700 duration-200 cursor-pointer hover:scale-105"
                      >
                        <ScanLine className="w-4 h-4" />
                        Tampilkan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-6">
            {/* Paginasi tetap sama */}
          </div>
        </main>
      </div>

      {/* MODAL SCANNER BAWAAN ANDA, TIDAK DIUBAH */}
      {isScannerOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-md bg-[#fefaf1]/30"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-center">Scan QR Code</h2>
            <div id="qr-reader" className="w-full"></div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setScannerOpen(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-emerald-700 cursor-pointer hover:scale-105 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL BARU UNTUK MENAMPILKAN DETAIL ANGGOTA SETELAH SCAN */}
      {scannedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-sans">
          {/* Ganti rounded-lg menjadi rounded-2xl untuk sudut yang lebih bulat */}
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm relative">
            {/* Header */}
            <div className="flex justify-center items-center mb-4 relative">
              <h2 className="text-lg font-semibold text-gray-800 text-center flex-grow capitalize">
                QR Code - {scannedMember.nama}
              </h2>
              <button
                onClick={() => setScannedMember(null)}
                className="absolute right-0 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Kotak Detail Informasi dengan Latar Belakang Biru */}
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 sm:p-4 mb-4 text-gray-700 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Nama:</span> {scannedMember.nama}
              </p>
              <p className="text-sm">
                <span className="font-medium">NIM:</span> {scannedMember.nim}
              </p>
              <p className="text-sm">
                <span className="font-medium">Kelompok:</span>{" "}
                {scannedMember.kelompok}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white border rounded-lg mb-4 shadow-sm">
              <QRCode
                id="qr-code-canvas"
                value={scannedMember.nim}
                size={200}
              />
            </div>

            {/* Subtitle */}
            <p className="text-center text-sm text-gray-600 mb-5">
              QR Code untuk absensi {scannedMember.nama}
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow"
                >
                  Print QR
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow"
                >
                  Download
                </button>
              </div>
              <button
                onClick={() => setScannedMember(null)}
                className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnggotaKelompok;
