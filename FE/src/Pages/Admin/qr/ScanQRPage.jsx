import React, { useState } from 'react';
import Sidebar from '../../../component/SidebarAdmin';
import { Menu, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { showToast, showErrorToast, showSuccessToast } from '../../../utils/toastUtils';
import QRScanner from '../../../components/QRScanner';
import { toast } from 'react-hot-toast';

const ScanQRPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  let html5QrcodeScanner = null;

  const handleScanSuccess = (decodedText) => {
    console.log('QR Code scanned:', decodedText);
    setScanResult(decodedText);
    setShowScanner(false);
    showSuccessToast(`QR Code berhasil dipindai: ${decodedText}`);
  };

  const handleScanError = (error) => {
    console.error('QR scan error:', error);
    showErrorToast('Gagal mengakses kamera atau memindai QR code');
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

  const initializeScanner = async () => {
    try {
      // ...kode inisialisasi scanner...
      setScanner(html5QrcodeScanner);
      toast.success('Scanner siap! Arahkan kamera ke QR code.');
    } catch (error) {
      console.error('Scanner initialization error:', error);
      toast.error('Gagal memulai scanner. ' + error.message);
      setIsScanning(false);
    }
  };

  const testCamera = async () => {
    try {
      toast.loading('Testing camera access...');
      
      // Check if camera permission is granted
      const permission = await navigator.permissions.query({ name: 'camera' });
      console.log('Camera permission status:', permission.state);
      
      if (permission.state === 'denied') {
        toast.error('Akses kamera ditolak. Silakan izinkan akses kamera di browser settings.');
        return;
      }
      
      // Test camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer back camera
        } 
      });
      
      toast.dismiss();
      toast.success('Kamera dapat diakses! Permission sudah diberikan.');
      
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      toast.dismiss();
      console.error('Camera test error:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Akses kamera ditolak. Klik ikon kamera di address bar untuk memberikan permission.');
      } else if (error.name === 'NotFoundError') {
        toast.error('Tidak ada kamera yang ditemukan pada perangkat ini.');
      } else if (error.name === 'NotReadableError') {
        toast.error('Kamera sedang digunakan oleh aplikasi lain.');
      } else {
        toast.error(`Error akses kamera: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-80 shadow-lg transition-transform duration-300 bg-white md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="w-80 md:w-64" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto w-full">
        {/* Header */}
        <div className="flex justify-end items-center p-4 h-16 bg-white md:bg-transparent border-b md:border-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="text-sm text-green-700 font-medium">Admin</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-2xl font-bold text-gray-800 font-['League_Spartan'] mb-6">
              Scan QR Code
            </h1>

            <div className="bg-white rounded-2xl shadow-sm p-8 border">
              {!scanResult ? (
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Scan QR Code untuk Absensi
                  </h2>

                  {!isScanning ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                        <p className="text-gray-600 mb-4">
                          Klik tombol di bawah untuk memulai scanning QR Code
                        </p>
                        <div className="space-y-3">
                          <button
                            onClick={async () => {
                              try {
                                await navigator.mediaDevices.getUserMedia({ video: true });
                                toast.success('Permission diberikan! Silakan mulai scan.');
                              } catch (error) {
                                toast.error('Permission ditolak atau kamera tidak tersedia.');
                              }
                            }}
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all font-medium w-full"
                          >
                            Request Camera Permission
                          </button>
                          <button
                            onClick={startScanning}
                            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all font-medium w-full"
                          >
                            Mulai Scan QR
                          </button>
                          <button
                            onClick={testCamera}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all font-medium w-full text-sm"
                          >
                            Test Camera Permission
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-blue-800 mb-2">Petunjuk Scan QR:</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Pastikan QR code terlihat jelas dalam frame</li>
                          <li>• Jaga jarak sekitar 15-20 cm dari layar</li>
                          <li>• Pastikan pencahayaan cukup terang</li>
                          <li>• Tunggu hingga QR code terbaca secara otomatis</li>
                        </ul>
                      </div>
                      
                      <div 
                        id="qr-reader" 
                        className="mx-auto border-2 border-dashed border-gray-300 rounded-lg p-4"
                        style={{ 
                          minHeight: '400px',
                          maxWidth: '500px',
                          width: '100%'
                        }}
                      ></div>
                      
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={stopScanning}
                          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all font-medium"
                        >
                          Berhenti Scan
                        </button>
                        <button
                          onClick={testCamera}
                          className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all font-medium"
                        >
                          Test Kamera
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800">
                    QR Code Berhasil Dipindai!
                  </h2>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Hasil Scan:</p>
                    <p className="text-lg font-mono bg-white p-3 rounded border">
                      {scanResult}
                    </p>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={resetScan}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all font-medium"
                    >
                      Scan Lagi
                    </button>
                    <button
                      onClick={() => {
                        // Handle attendance marking here
                        toast.success('Absensi berhasil dicatat!');
                        resetScan();
                      }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all font-medium"
                    >
                      Catat Absensi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScanQRPage;
