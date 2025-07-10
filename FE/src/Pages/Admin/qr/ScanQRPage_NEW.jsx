import React, { useState } from 'react';
import Sidebar from '../../../component/SidebarAdmin';
import { Menu, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QRScanner from '../../../components/QRScanner';

const ScanQRPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = (decodedText) => {
    console.log('QR Code scanned:', decodedText);
    setScanResult(decodedText);
    setShowScanner(false);
    toast.success(`QR Code berhasil dipindai: ${decodedText}`);
  };

  const handleScanError = (error) => {
    console.error('QR scan error:', error);
    toast.error('Gagal mengakses kamera atau memindai QR code');
  };

  const startScanning = () => {
    setScanResult(null);
    setShowScanner(true);
  };

  const stopScanning = () => {
    setShowScanner(false);
  };

  const resetScan = () => {
    setScanResult(null);
  };

  return (
    <div className="flex h-screen font-sans bg-[#f5f6fa] relative">
      {/* Mobile Hamburger */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h1 className="text-2xl font-bold text-gray-800">QR Code Scanner</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            {/* Scanner Controls */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
              <div className="text-center mb-6">
                <QrCode className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  QR Code Scanner
                </h2>
                <p className="text-gray-600">
                  Scan QR codes untuk mendapatkan informasi atau melakukan absensi
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!showScanner ? (
                  <button
                    onClick={startScanning}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-5 h-5" />
                    Mulai Scan QR
                  </button>
                ) : (
                  <button
                    onClick={stopScanning}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Stop Scanner
                  </button>
                )}

                {scanResult && (
                  <button
                    onClick={resetScan}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Hasil Scan
                  </h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">QR Code Data:</p>
                  <p className="font-mono text-sm break-all bg-white p-3 rounded border">
                    {scanResult}
                  </p>
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ QR Code berhasil dipindai! Data telah disimpan dan dapat diproses lebih lanjut.
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Petunjuk Penggunaan
                </h3>
              </div>
              
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Klik tombol "Mulai Scan QR" untuk membuka scanner</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Izinkan akses kamera saat diminta oleh browser</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>Arahkan kamera ke QR code yang ingin dipindai</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">4.</span>
                  <span>Pastikan QR code terlihat jelas dalam frame scanner</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">5.</span>
                  <span>Scanner akan otomatis membaca QR code dan menampilkan hasilnya</span>
                </li>
              </ul>

              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tips:</strong> Pastikan pencahayaan cukup dan QR code tidak blur atau terpotong untuk hasil scan yang optimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
        onClose={stopScanning}
        title="Scan QR Code"
        description="Arahkan kamera ke QR code untuk memindai"
      />
    </div>
  );
};

export default ScanQRPage;
