import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRGenerator = ({ data, size = 200, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
        }
      });
    }
  }, [data, size]);

  if (!data) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <p className="text-gray-500 text-sm">No data</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas 
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
      />
      <p className="text-xs text-gray-600 mt-2 text-center break-all max-w-[200px]">
        {data}
      </p>
    </div>
  );
};

export default QRGenerator;
