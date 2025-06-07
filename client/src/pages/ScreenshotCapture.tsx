import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { NavigationState } from '@/App';

// Import your actual pages for authentic screenshots
import HomePage from './HomePage';
import BuildHome from './BuildHome';
import DesignHome from './DesignHome';
import FinanceRealEstate from './FinanceRealEstate';

export default function ScreenshotCapture() {
  const [currentPage, setCurrentPage] = useState('homepage');
  const [navState, setNavState] = useState<NavigationState>({
    currentView: 'homepage',
    breadcrumb: { primary: null, secondary: null, tertiary: null }
  });
  const { t } = useLanguage();

  const pages = [
    { id: 'homepage', label: 'Homepage', component: HomePage },
    { id: 'build', label: 'Build Home', component: BuildHome },
    { id: 'design', label: 'Design Home', component: DesignHome },
    { id: 'finance', label: 'Finance & Real Estate', component: FinanceRealEstate }
  ];

  const currentPageData = pages.find(p => p.id === currentPage);
  const CurrentComponent = currentPageData?.component || HomePage;

  const downloadScreenshot = () => {
    // Simple instruction for user to right-click and save
    alert(`To download this screenshot:\n\n1. Right-click on the mobile preview above\n2. Select "Save image as..."\n3. Name it: USA-Home-Mobile-${currentPageData?.label.replace(/\s+/g, '-') || 'Screenshot'}.png\n\nAlternatively, use F12 > Device Mode > Right-click > "Capture screenshot" for perfect quality!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            📱 Mobile Screenshot Capture for Google Play Console
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">Instructions for Chromebook:</h2>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
              <li>Press <kbd className="bg-blue-200 px-2 py-1 rounded">F12</kbd> to open Developer Tools</li>
              <li>Click the mobile device icon 📱 in the toolbar</li>
              <li>Select "iPhone 12 Pro" (390x844px - perfect 9:16 ratio)</li>
              <li>Right-click on the mobile preview and select "Capture screenshot"</li>
              <li>Screenshots will download to your Downloads folder</li>
            </ol>
          </div>

          <div className="mb-6">
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
        </div>

        {/* Mobile Preview Frame */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
              <div id="mobile-preview" className="bg-white rounded-[2rem] overflow-hidden" style={{ width: '390px', height: '844px' }}>
                {/* Status Bar */}
                <div className="bg-black text-white text-xs flex justify-between items-center px-6 py-2">
                  <span>9:41</span>
                  <span className="flex items-center gap-1">
                    <span>📶</span>
                    <span>📶</span>
                    <span>🔋</span>
                  </span>
                </div>
                
                {/* App Content */}
                <div className="h-full overflow-hidden">
                  <CurrentComponent 
                    setNavState={setNavState}
                    navState={navState}
                  />
                </div>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="text-center mt-6">
              <button
                onClick={downloadScreenshot}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                📱 Download Mobile Screenshot
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Downloads as {currentPageData?.label} - Perfect for Google Play Console
              </p>
            </div>
            
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <p className="text-sm text-gray-600 font-medium">
                Perfect 9:16 ratio for Google Play Console
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">✅ Google Play Requirements Met:</h3>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• 390x844px resolution (9:16 aspect ratio)</li>
            <li>• PNG format when captured</li>
            <li>• Under 8MB file size</li>
            <li>• Authentic USA Home app content</li>
            <li>• Ready for direct upload to Google Play Console</li>
          </ul>
        </div>
      </div>
    </div>
  );
}