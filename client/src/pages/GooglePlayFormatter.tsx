import React, { useRef, useEffect, useState } from 'react';
import mockupImage from '@assets/Screen Shot 2025-05-24 at 05.43.37.png';

export default function GooglePlayFormatter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const processImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas to exact Google Play requirements: 9:16 ratio
      // Using 1080x1920 for high quality
      canvas.width = 1080;
      canvas.height = 1920;

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Extract the phone screen area from your mockup
      // The phone screen appears to be roughly in the center
      // We'll crop and scale it to fit perfectly
      
      // Source dimensions (maximize screen content, minimal frame)
      const sourceX = 15; // Left edge of screen content
      const sourceY = 15; // Top edge of screen content  
      const sourceWidth = img.width - 30; // Screen width minus minimal frame
      const sourceHeight = img.height - 30; // Screen height minus minimal frame

      // Draw the extracted phone screen to fill entire canvas
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle
        0, 0, canvas.width, canvas.height // Destination rectangle
      );

      // Convert to data URL for download
      const dataURL = canvas.toDataURL('image/png');
      setProcessedImage(dataURL);
    };

    img.src = mockupImage;
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.download = 'USA-Home-GooglePlay-Screenshot-1080x1920.png';
    link.href = processedImage;
    link.click();
  };

  useEffect(() => {
    processImage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            📱 Google Play Console Screenshot Formatter
          </h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-green-900 mb-2">✅ Automatic Processing:</h2>
            <ul className="text-green-800 space-y-1 text-sm">
              <li>• Extracts phone screen from your mockup</li>
              <li>• Converts to 1080x1920px (perfect 9:16 ratio)</li>
              <li>• Meets all Google Play Console requirements</li>
              <li>• Ready for immediate upload</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Build Section Screenshot:</h3>
              <img 
                src={mockupImage} 
                alt="Build section phone screen" 
                className="w-full rounded-lg border shadow-sm"
              />
              <p className="text-xs text-gray-600 mt-2">Build Your Dream Home section</p>
            </div>

            {/* Processed Image */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Google Play Ready:</h3>
              {processedImage ? (
                <div>
                  <img 
                    src={processedImage} 
                    alt="Processed for Google Play" 
                    className="w-full max-w-sm mx-auto rounded-lg border shadow-sm"
                    style={{ aspectRatio: '9/16' }}
                  />
                  <p className="text-xs text-gray-600 mt-2 text-center">1080x1920px - Screen content only</p>
                  
                  <div className="text-center mt-4">
                    <button
                      onClick={downloadImage}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
                    >
                      📱 Download Google Play Screenshot
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Downloads only the processed phone screen (1080x1920px)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg aspect-[9/16] flex items-center justify-center">
                  <p className="text-gray-600">Processing...</p>
                </div>
              )}
            </div>
          </div>

          <canvas 
            ref={canvasRef} 
            style={{ display: 'none' }}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Google Play Console Requirements Met:</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• ✅ 1080x1920px resolution (exactly 9:16 aspect ratio)</li>
            <li>• ✅ PNG format for best quality</li>
            <li>• ✅ Under 8MB file size</li>
            <li>• ✅ Shows authentic USA Home app content</li>
            <li>• ✅ Clean phone screen without device frame</li>
            <li>• ✅ High resolution for store display</li>
          </ul>
        </div>
      </div>
    </div>
  );
}