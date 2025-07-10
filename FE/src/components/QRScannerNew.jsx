import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, CheckCircle } from 'lucide-react';

const QRScanner = ({ 
  onScanSuccess, 
  onScanError, 
  onClose, 
  isOpen = false,
  title = "Scan QR Code",
  description = "Arahkan kamera ke QR code untuk memindai"
}) => {
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [lastScanResult, setLastScanResult] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  
  const scannerElementId = useRef(`qr-scanner-${Date.now()}`);
  const isMountedRef = useRef(false);

  // Set mounted flag
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Cleanup scanner on unmount or when modal closes
  useEffect(() => {
    if (!isOpen && scanner) {
      stopScanner();
    }
    
    return () => {
      if (scanner) {
        stopScanner();
      }
    };
  }, [isOpen]); // Remove scanner dependency to avoid infinite re-renders

  // Initialize scanner when modal opens
  useEffect(() => {
    if (isOpen && !scanner && !isInitializing) {
      initializeScanner();
    }
  }, [isOpen]); // Remove dependencies to avoid infinite re-renders

  const stopScanner = async () => {
    if (scanner && isMountedRef.current) {
      try {
        if (scanner.getState() === 2) { // SCANNING state
          await scanner.stop();
        }
        scanner.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      } finally {
        setScanner(null);
        setIsScanning(false);
        setIsInitializing(false);
        setError(null);
      }
    }
  };

  const initializeScanner = async () => {
    if (!isMountedRef.current || scanner || isInitializing) return;

    try {
      setIsInitializing(true);
      setError(null);

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());

      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!isMountedRef.current) return;

      // Create new scanner instance
      const qrCodeScanner = new Html5Qrcode(scannerElementId.current);
      
      if (!isMountedRef.current) {
        qrCodeScanner.clear();
        return;
      }

      // Start scanning
      await qrCodeScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (isMountedRef.current && decodedText !== lastScanResult) {
            setLastScanResult(decodedText);
            setScanCount(prev => prev + 1);
            console.log('QR Code scanned:', decodedText);
            
            if (onScanSuccess) {
              onScanSuccess(decodedText);
            }
          }
        },
        (errorMessage) => {
          // Silently handle scan errors (normal when no QR in view)
        }
      );

      if (isMountedRef.current) {
        setScanner(qrCodeScanner);
        setIsScanning(true);
      }

    } catch (err) {
      console.error('Scanner initialization error:', err);
      
      if (isMountedRef.current) {
        let errorMsg = 'Gagal mengakses kamera';
        
        if (err.name === 'NotAllowedError') {
          errorMsg = 'Akses kamera ditolak. Silakan izinkan akses kamera dan coba lagi.';
        } else if (err.name === 'NotFoundError') {
          errorMsg = 'Kamera tidak ditemukan pada perangkat ini.';
        } else if (err.name === 'NotReadableError') {
          errorMsg = 'Kamera sedang digunakan oleh aplikasi lain.';
        }
        
        setError(errorMsg);
        
        if (onScanError) {
          onScanError(err);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsInitializing(false);
      }
    }
  };

  const handleClose = () => {
    stopScanner();
    setLastScanResult(null);
    setScanCount(0);
    if (onClose) {
      onClose();
    }
  };

  const handleRetry = () => {
    setError(null);
    setLastScanResult(null);
    if (scanner) {
      stopScanner();
    }
    setTimeout(() => {
      if (isMountedRef.current) {
        initializeScanner();
      }
    }, 500);
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      handleRetry();
    } catch (err) {
      setError('Permission ditolak. Silakan izinkan akses kamera di browser settings.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            {scanCount > 0 && (
              <p className="text-xs text-green-600 mt-1">
                ✅ {scanCount} QR code berhasil dipindai
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6">
          {error ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-center text-red-800 mb-2">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Error</span>
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={requestCameraPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Izinkan Akses Kamera
                </button>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ml-2"
                >
                  Coba Lagi
                </button>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Jika masalah berlanjut:</p>
                <p>1. Pastikan browser mendukung kamera</p>
                <p>2. Periksa pengaturan privasi browser</p>
                <p>3. Tutup aplikasi lain yang menggunakan kamera</p>
              </div>
            </div>
          ) : isInitializing ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center text-blue-800 mb-2">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  <span className="font-semibold">Memulai Kamera...</span>
                </div>
                <p className="text-sm text-blue-700">
                  Mohon tunggu sebentar, kamera sedang diinisialisasi
                </p>
              </div>
            </div>
          ) : isScanning ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center text-emerald-800">
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Scanner Aktif</span>
                </div>
                <ul className="text-sm text-emerald-700 mt-2 space-y-1">
                  <li>• Arahkan kamera ke QR code</li>
                  <li>• Pastikan QR code terlihat jelas</li>
                  <li>• Scanner akan otomatis membaca QR code</li>
                </ul>
              </div>
              
              <div 
                id={scannerElementId.current}
                className="border-2 border-dashed border-gray-300 rounded-lg min-h-[300px] bg-gray-50"
              />
              
              <div className="text-center">
                <div className="inline-flex items-center text-emerald-600">
                  <div className="animate-pulse w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Menunggu QR code...</span>
                </div>
              </div>

              {lastScanResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800 mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Scan Terakhir Berhasil!</span>
                  </div>
                  <p className="text-sm text-green-700 font-mono break-all">
                    {lastScanResult}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Scanner siap untuk scan berikutnya
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Klik tombol di bawah untuk memulai scanner</p>
              </div>
              
              <button
                onClick={initializeScanner}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Mulai Scanner
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Status: {
                error ? 'Error' :
                isInitializing ? 'Initializing...' :
                isScanning ? 'Ready to Scan' : 'Stopped'
              }
            </div>
            <div className="space-x-2">
              {isScanning && (
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              )}
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
