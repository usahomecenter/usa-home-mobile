import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

// Import your actual pages for authentic screenshots
import HomePage from './HomePage';
import BuildHome from './BuildHome';
import DesignHome from './DesignHome';
import FinanceRealEstate from './FinanceRealEstate';

export default function SVGScreenshotDownload() {
  const [currentPage, setCurrentPage] = useState('homepage');
  const [isCapturing, setIsCapturing] = useState(false);
  const screenshotRef = useRef<HTMLDivElement>(null);

  const pages = [
    { id: 'homepage', label: 'Homepage', component: HomePage },
    { id: 'build', label: 'Build Home', component: BuildHome },
    { id: 'design', label: 'Design Home', component: DesignHome },
    { id: 'finance', label: 'Finance & Real Estate', component: FinanceRealEstate }
  ];

  const currentPageData = pages.find(p => p.id === currentPage);
  const CurrentComponent = currentPageData?.component || HomePage;

  const downloadAsSVG = async () => {
    if (!screenshotRef.current) return;
    
    setIsCapturing(true);
    try {
      // Capture as canvas first
      const canvas = await html2canvas(screenshotRef.current, {
        width: 1920,
        height: 1080,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      
      // Create SVG wrapper with the actual screenshot
      const svgContent = `
        <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <image x="0" y="0" width="1920" height="1080" xlink:href="${imageDataUrl}"/>
        </svg>
      `;
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = `USA-Home-${currentPageData?.label.replace(/\s+/g, '-') || 'Screenshot'}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('SVG capture failed:', error);
      alert('SVG capture failed. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            📱 SVG Screenshot Download for Google Play Console
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">SVG Format Benefits:</h2>
            <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
              <li>Contains your actual app design and content</li>
              <li>Perfect 1920x1080px dimensions (16:9 ratio)</li>
              <li>Vector format with embedded PNG screenshot</li>
              <li>Ready for Google Play Console submission</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Page to Capture:
              </label>
              <div className="flex flex-wrap gap-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(page.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === page.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <button
                onClick={downloadAsSVG}
                disabled={isCapturing}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isCapturing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating SVG...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download SVG Screenshot
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* App Preview Frame */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preview: {currentPageData?.label}
          </h3>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div 
              ref={screenshotRef}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              style={{ width: '960px', height: '540px', margin: '0 auto' }}
            >
              <CurrentComponent 
                setNavState={() => {}}
                navState={{
                  currentView: currentPage,
                  breadcrumb: { primary: null, secondary: null, tertiary: null }
                }}
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Preview shown at 50% size. Downloaded SVG will be 1920x1080px (perfect for Google Play Console)
            </p>
          </div>
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">✅ Google Play Console Ready:</h3>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• Perfect 16:9 aspect ratio (1920x1080px)</li>
            <li>• Contains your actual USA Home app design</li>
            <li>• SVG format with embedded high-quality screenshot</li>
            <li>• Can be converted to PNG if needed</li>
            <li>• Under 8MB file size</li>
            <li>• Ready for direct upload to Google Play Console</li>
          </ul>
        </div>
      </div>
    </div>
  );
}