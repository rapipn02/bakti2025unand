import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Camera, X, AlertCircle } from 'lucide-react';

const QRScanner = ({ 
  onScanSuccess, 
  onScanError, 
  onClose, 
  isOpen = false,
  title = "Scan QR Code",
  description = "Arahkan kamera ke QR code untuk memindai"
}) => {
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState({
    camera: 'prompt'
  });
  const mountedRef = useRef(false);

  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'camera' });
        setPermissions({ camera: result.state });
        
        result.addEventListener('change', () => {
          setPermissions({ camera: result.state });
        });
      } catch (error) {
        console.log('Permission API not supported:', error);
      }
    };

    checkPermissions();
  }, []);

  // Initialize scanner when component mounts and is open
  useEffect(() => {
    mountedRef.current = true;
    
    const init = async () => {
      if (isOpen && !html5QrCode) {
        await initializeScanner();
      }
    };

    if (isOpen) {
      init();
    }

    return () => {
      mountedRef.current = false;
      if (html5QrCode) {
        stopScanner();
      }
    };
  }, [isOpen]);

  const initializeScanner = async () => {
    if (!mountedRef.current || html5QrCode || isScanning) return;

    try {
      setError(null);
      setIsScanning(true);

      // Request camera permission explicitly
      await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera by default
        } 
      });

      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        // Prefer back camera, fallback to first available
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        const selectedCamera = backCamera || devices[0];

        // Initialize Html5Qrcode
        const qrCodeScanner = new Html5Qrcode("qr-reader-scanner");
        setHtml5QrCode(qrCodeScanner);

        // Start scanning
        await qrCodeScanner.start(
          selectedCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            disableFlip: false,
            videoConstraints: {
              facingMode: 'environment'
            }
          },
          (decodedText, decodedResult) => {
            if (mountedRef.current) {
              console.log('QR Code scanned:', decodedText);
              onScanSuccess?.(decodedText, decodedResult);
            }
          },
          (errorMessage) => {
            // Handle scan errors silently for common scanning failures
            console.log('Scan error:', errorMessage);
          }
        );

        setIsScanning(true);
      } else {
        throw new Error('No cameras found');
      }
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError(err.message || 'Failed to initialize camera');
      setIsScanning(false);
      onScanError?.(err);
    }
  };

  const stopScanner = async () => {
    if (html5QrCode) {
      try {
        const state = html5QrCode.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await html5QrCode.stop();
        }
        html5QrCode.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      } finally {
        setHtml5QrCode(null);
        setIsScanning(false);
        setError(null);
      }
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose?.();
  };

  const requestCameraPermission = async () => {
    try {
      setError(null);
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissions({ camera: 'granted' });
      
      // Try to initialize scanner after permission granted
      if (!html5QrCode) {
        initializeScanner();
      }
    } catch (error) {
      setError('Camera permission denied. Please allow camera access and try again.');
      setPermissions({ camera: 'denied' });
      console.error('Camera permission error:', error);
    }
  };

  const retryScanner = () => {
    stopScanner();
    setTimeout(() => {
      if (mountedRef.current) {
        initializeScanner();
      }
    }, 100);
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
              
              {permissions.camera === 'denied' ? (
                <div className="space-y-2">
                  <button
                    onClick={requestCameraPermission}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Camera Permission
                  </button>
                  <div className="text-xs text-gray-500">
                    <p>If permission is still denied:</p>
                    <p>1. Click the camera icon in the address bar</p>
                    <p>2. Select "Allow" for camera access</p>
                    <p>3. Refresh the page and try again</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={retryScanner}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : permissions.camera === 'prompt' || permissions.camera === 'denied' ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center text-blue-800 mb-2">
                  <Camera className="w-6 h-6 mr-2" />
                  <span className="font-semibold">Camera Permission Required</span>
                </div>
                <p className="text-sm text-blue-700">
                  We need access to your camera to scan QR codes.
                </p>
              </div>
              
              <button
                onClick={requestCameraPermission}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Enable Camera
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center text-emerald-800">
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Scanner Ready</span>
                </div>
                <ul className="text-sm text-emerald-700 mt-2 space-y-1">
                  <li>• Arahkan kamera ke QR code</li>
                  <li>• Pastikan QR code terlihat jelas dalam frame</li>
                  <li>• Scanner akan otomatis membaca QR code</li>
                </ul>
              </div>
              
              <div 
                id="qr-reader-scanner" 
                className="border-2 border-dashed border-gray-300 rounded-lg min-h-[300px] flex items-center justify-center bg-gray-50"
              >
                {!isScanning && (
                  <div className="text-center text-gray-500">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <p>Initializing camera...</p>
                  </div>
                )}
              </div>
              
              {isScanning && (
                <div className="text-center">
                  <div className="inline-flex items-center text-emerald-600">
                    <div className="animate-pulse w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Scanning for QR codes...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Status: {
                error ? 'Error' :
                permissions.camera === 'denied' ? 'Permission Denied' :
                permissions.camera === 'prompt' ? 'Permission Required' :
                isScanning ? 'Scanning...' : 'Initializing...'
              }
            </div>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
