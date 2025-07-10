import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRGenerator from '../../../components/QRGenerator';
import { getKelompokList, generateStudentQR } from '../../../utils/absenApi';
import { showToast } from '../../../utils/errorHandler';

const GenerateQRPage = () => {
  const navigate = useNavigate();
  const [kelompokList, setKelompokList] = useState([]);
  const [selectedKelompok, setSelectedKelompok] = useState('');
  const [nim, setNim] = useState('');
  const [qrData, setQrData] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKelompokList();
  }, []);

  const fetchKelompokList = async () => {
    try {
      const result = await getKelompokList();
      if (result.success) {
        setKelompokList(result.data);
      } else {
        showToast('Gagal memuat data kelompok', 'error');
      }
    } catch {
      showToast('Gagal memuat data kelompok', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!nim.trim()) {
      showToast('NIM harus diisi', 'error');
      return;
    }

    if (!selectedKelompok) {
      showToast('Kelompok harus dipilih', 'error');
      return;
    }

    try {
      const qr = await generateStudentQR(nim.trim(), selectedKelompok);
      setQrData(qr);
      showToast('QR Code berhasil dibuat!', 'success');
    } catch (error) {
      console.error('Error generating QR:', error);
      showToast('Gagal membuat QR Code', 'error');
    }
  };

  const handleReset = () => {
    setNim('');
    setSelectedKelompok('');
    setQrData('');
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-${nim}-kelompok-${selectedKelompok}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Generate QR Code Mahasiswa</h1>
              <p className="text-gray-600 mt-1">Buat QR code untuk absensi mahasiswa</p>
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
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Data Mahasiswa</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIM Mahasiswa
                </label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Masukkan NIM mahasiswa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelompok
                </label>
                <select
                  value={selectedKelompok}
                  onChange={(e) => setSelectedKelompok(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Kelompok</option>
                  {kelompokList.map((kelompok) => (
                    <option key={kelompok.id} value={kelompok.nomor}>
                      Kelompok {kelompok.nomor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleGenerateQR}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate QR Code
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Petunjuk Penggunaan:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Masukkan NIM mahasiswa dengan benar</li>
                <li>• Pilih kelompok yang sesuai</li>
                <li>• Klik "Generate QR Code" untuk membuat QR</li>
                <li>• QR code dapat diunduh untuk dicetak</li>
                <li>• Mahasiswa akan scan QR ini saat absensi</li>
              </ul>
            </div>
          </div>

          {/* QR Display Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">QR Code</h2>
            
            <div className="flex flex-col items-center">
              {qrData ? (
                <div className="text-center">
                  <QRGenerator 
                    data={qrData} 
                    size={250} 
                    className="mb-4"
                  />
                  
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Data QR:</p>
                    <p className="font-mono text-sm break-all">{qrData}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>NIM: {nim}</p>
                      <p>Kelompok: {selectedKelompok}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadQR}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download QR Code
                  </button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-gray-500">QR Code akan tampil di sini</p>
                  <p className="text-sm text-gray-400 mt-1">Isi form di sebelah kiri untuk generate QR</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Generate Section */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Massal (Coming Soon)</h2>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Fitur untuk generate QR code secara massal untuk seluruh anggota kelompok akan segera tersedia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQRPage;
