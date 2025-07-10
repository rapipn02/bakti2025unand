import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const html5QrCodeRef = useRef(null);
  const scannerContainerRef = useRef(null);
  const [scannerId] = useState(`qr-scanner-${Date.now()}`);
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState({ camera: 'prompt' });
  const mountedRef = useRef(false);
  const initializingRef = useRef(false);

  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'camera' });
        setPermissions({ camera: result.state });
        
        result.addEventListener('change', () => {
          setPermissions({ camera: result.state });
        });
      } catch (err) {
        console.log('Permission API not supported');
      }
    };

    checkPermissions();
  }, []);

  // Cleanup function
  const cleanup = useCallback(async () => {
    console.log('Cleanup called');
    initializingRef.current = false;
    
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
      html5QrCodeRef.current = null;
    }
    
    // Clean up scanner div
    const scannerDiv = document.getElementById(scannerId);
    if (scannerDiv && scannerDiv.parentNode) {
      scannerDiv.parentNode.removeChild(scannerDiv);
    }
    
    setIsScanning(false);
    setIsInitializing(false);
    setError(null);
  }, [scannerId]);

  // Initialize scanner
  const initializeScanner = useCallback(async () => {
    if (!mountedRef.current || 
        html5QrCodeRef.current || 
        initializingRef.current ||
        !scannerContainerRef.current) {
      return;
    }

    try {
      console.log('Initializing scanner...');
      initializingRef.current = true;
      setError(null);
      setIsInitializing(true);

      // Check if scanner div already exists
      let scannerDiv = document.getElementById(scannerId);
      if (scannerDiv) {
        scannerDiv.remove();
      }

      // Request camera permission first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());

      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      console.log('Available cameras:', devices);
      
      if (!devices || devices.length === 0) {
        throw new Error('No cameras found');
      }

      // Select back camera if available
      const backCamera = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      const selectedCamera = backCamera || devices[0];
      console.log('Selected camera:', selectedCamera);

      // Create scanner div
      scannerDiv = document.createElement('div');
      scannerDiv.id = scannerId;
      scannerDiv.style.width = '100%';
      scannerDiv.style.height = '100%';
      scannerDiv.style.minHeight = '300px';
      
      // Wait for container to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!scannerContainerRef.current || !mountedRef.current) {
        throw new Error('Scanner container not ready');
      }

      scannerContainerRef.current.appendChild(scannerDiv);

      // Initialize Html5Qrcode
      html5QrCodeRef.current = new Html5Qrcode(scannerId);

      const config = {
        fps: 20, // Lebih tinggi untuk deteksi lebih cepat
        qrbox: { width: 300, height: 300 }, // Area scan lebih besar
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: 'environment'
        }
      };

      console.log('Starting scanner with config:', config);

      // Kurangi delay inisialisasi
      await html5QrCodeRef.current.start(
        selectedCamera.id,
        config,
        (decodedText, decodedResult) => {
          console.log('QR Code detected:', decodedText);
          if (mountedRef.current) {
            onScanSuccess?.(decodedText, decodedResult);
            setError(null);
          }
        },
        (errorMessage) => {
          // This is called for scan failures (no QR code detected)
          // We don't need to show this as an error
          console.log('Scan attempt failed:', errorMessage);
        }
      );

      if (mountedRef.current) {
        setIsScanning(true);
        setIsInitializing(false);
        initializingRef.current = false;
        console.log('Scanner initialized successfully');
      } else {
        // Component unmounted during initialization
        if (html5QrCodeRef.current) {
          html5QrCodeRef.current.stop().catch(() => {});
          html5QrCodeRef.current = null;
        }
      }
    } catch (err) {
      console.error('Scanner initialization error:', err);
      initializingRef.current = false;
      
      if (mountedRef.current) {
        setError(err.message || 'Failed to initialize camera');
        setIsInitializing(false);
        onScanError?.(err);
      }
    }
  }, [scannerId, onScanSuccess, onScanError]);

  // Handle modal open/close
  useEffect(() => {
    mountedRef.current = true;
    
    if (isOpen && !html5QrCodeRef.current && !initializingRef.current) {
      // Add small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (mountedRef.current && isOpen) {
          initializeScanner();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [isOpen, initializeScanner, cleanup]);

  const handleClose = () => {
    cleanup();
    onClose?.();
  };

  const requestCameraPermission = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions({ camera: 'granted' });
      
      // Small delay before initializing
      setTimeout(() => {
        if (mountedRef.current && !html5QrCodeRef.current && !initializingRef.current) {
          initializeScanner();
        }
      }, 500);
    } catch (err) {
      console.error('Camera permission error:', err);
      setError('Camera permission denied. Please allow camera access and try again.');
      setPermissions({ camera: 'denied' });
    }
  };

  const retryScanner = async () => {
    await cleanup();
    setTimeout(() => {
      if (mountedRef.current) {
        initializeScanner();
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-80 p-4">
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
                    <p>3. Try again</p>
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
                  <span className="font-semibold">Scanner Active</span>
                </div>
                <ul className="text-sm text-emerald-700 mt-2 space-y-1">
                  <li>• Arahkan kamera ke QR code</li>
                  <li>• Pastikan QR code terlihat jelas dalam frame</li>
                  <li>• Scanner akan otomatis membaca QR code</li>
                </ul>
              </div>
              
              <div 
                ref={scannerContainerRef}
                className="border-2 border-dashed border-gray-300 rounded-lg min-h-[300px] flex items-center justify-center bg-gray-50 relative overflow-hidden"
              >
                {isInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="text-center text-gray-500">
                      <Camera className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                      <p>Initializing camera...</p>
                    </div>
                  </div>
                )}
                
                {!isScanning && !isInitializing && (
                  <div className="text-center text-gray-500">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <p>Camera not active</p>
                    <button
                      onClick={initializeScanner}
                      className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Start Scanner
                    </button>
                  </div>
                )}
              </div>
              
              {isScanning && (
                <div className="text-center">
                  <div className="inline-flex items-center text-emerald-600">
                    <div className="animate-pulse w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Ready to scan QR codes...</span>
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
                isInitializing ? 'Initializing...' :
                isScanning ? 'Ready to Scan' : 'Stopped'
              }
            </div>
            <div className="space-x-2">
              {isScanning && (
                <button
                  onClick={retryScanner}
                  className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm"
                >
                  Restart
                </button>
              )}
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
    </div>
  );
};

export default QRScanner;