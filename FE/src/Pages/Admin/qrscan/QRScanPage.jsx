import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import QRScanner from '../../../components/QRScanner';
import { scanQRForAbsensi, getAbsenList, validateQRData } from '../../../utils/absenApi';
import { showToast } from '../../../utils/errorHandler';

const QRScanPage = () => {
  const { absenId } = useParams();
  const [searchParams] = useSearchParams();
  const kelompokId = searchParams.get('kelompok');
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [absenData, setAbsenData] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    const fetchAbsenData = async () => {
      try {
        const result = await getAbsenList();
        if (result.success) {
          const absen = result.data.find(item => item.id === absenId);
          if (absen) {
            setAbsenData(absen);
          } else {
            showToast('Sesi absen tidak ditemukan', 'error');
            navigate('/admin/absensi');
          }
        }
      } catch {
        showToast('Gagal memuat data absen', 'error');
      }
    };
    
    fetchAbsenData();
  }, [absenId, navigate]);

  const handleQRScan = async (qrData) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setIsScanning(false);

    // Validate QR data format
    const validation = validateQRData(qrData);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      setIsProcessing(false);
      setIsScanning(true);
      return;
    }

    try {
      const result = await scanQRForAbsensi(qrData, absenId, kelompokId);
      
      if (result.success) {
        setScanResult({
          success: true,
          nim: validation.nim,
          kelompok: validation.kelompok,
          message: result.message || 'Absensi berhasil dicatat',
          timestamp: new Date().toLocaleTimeString()
        });
        
        // Add to scan history
        setScanHistory(prev => [...prev, {
          id: Date.now(),
          nim: validation.nim,
          kelompok: validation.kelompok,
          status: 'success',
          timestamp: new Date().toLocaleTimeString()
        }]);
        
        showToast('Absensi berhasil dicatat!', 'success');
        
        // Redirect back to absensi page with kelompok and kegiatan parameters after successful scan
        setTimeout(() => {
          if (kelompokId && absenId) {
            navigate(`/admin/absensi?kelompok=${kelompokId}&kegiatan=${absenId}`);
          } else {
            navigate('/admin/absensi');
          }
        }, 1500);
      } else {
        setScanResult({
          success: false,
          error: result.error,
          timestamp: new Date().toLocaleTimeString()
        });
        showToast(result.error, 'error');
        
        // Resume scanning after 2 seconds for failed scans
        setTimeout(() => {
          setScanResult(null);
          setIsScanning(true);
        }, 2000);
      }
    } catch {
      setScanResult({
        success: false,
        error: 'Terjadi kesalahan saat memproses scan',
        timestamp: new Date().toLocaleTimeString()
      });
      showToast('Terjadi kesalahan saat memproses scan', 'error');
      
      // Resume scanning after 2 seconds for errors
      setTimeout(() => {
        setScanResult(null);
        setIsScanning(true);
      }, 2000);
    }

    setIsProcessing(false);
  };

  const handleScanError = (error) => {
    showToast(error, 'error');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scan QR Absensi</h1>
              {absenData && (
                <div className="mt-2">
                  <p className="text-lg text-gray-700">{absenData.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(absenData.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/admin/absensi')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Scanner QR Code</h2>
            
            {isScanning ? (
              <QRScanner
                onScan={handleQRScan}
                onError={handleScanError}
                isActive={isScanning}
              />
            ) : (
              <div className="w-full max-w-md mx-auto">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Memproses scan...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scan Result */}
            {scanResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                scanResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {scanResult.success ? (
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <div>
                    {scanResult.success ? (
                      <div>
                        <p className="font-semibold text-green-800">Scan Berhasil!</p>
                        <p className="text-sm text-green-600">
                          NIM: {scanResult.nim} | Kelompok: {scanResult.kelompok || 'N/A'}
                        </p>
                        <p className="text-xs text-green-500">{scanResult.timestamp}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-red-800">Scan Gagal</p>
                        <p className="text-sm text-red-600">{scanResult.error}</p>
                        <p className="text-xs text-red-500">{scanResult.timestamp}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Petunjuk Scan:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Pastikan QR code mahasiswa terlihat jelas di layar</li>
                <li>• Pastikan pencahayaan cukup</li>
                <li>• QR code harus berformat: NIM-Kelompok</li>
                <li>• Scanner akan otomatis mendeteksi QR code</li>
              </ul>
            </div>
          </div>

          {/* Scan History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Riwayat Scan</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scanHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Belum ada scan yang berhasil</p>
                </div>
              ) : (
                scanHistory.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        scan.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">NIM: {scan.nim}</p>
                        <p className="text-sm text-gray-600">Kelompok: {scan.kelompok || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {scan.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Statistics */}
            {scanHistory.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Statistik Scan Hari Ini</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{scanHistory.length}</div>
                    <div className="text-gray-600">Total Scan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Set(scanHistory.map(s => s.nim)).size}
                    </div>
                    <div className="text-gray-600">Mahasiswa Unik</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanPage;
