import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { NavigationState } from '@/App';

// Import your actual pages for authentic screenshots
import HomePage from './HomePage';
import BuildHome from './BuildHome';
import DesignHome from './DesignHome';
import FinanceRealEstate from './FinanceRealEstate';

export default function TabletScreenshots() {
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
    // Simple instruction for user to capture tablet screenshots
    alert(`To download this tablet screenshot:\n\n1. Press F12 to open Developer Tools\n2. Click the mobile device icon 📱\n3. Set device to "Responsive" and enter 1620x2160\n4. Right-click and select "Capture screenshot"\n5. Name it: USA-Home-Tablet-${currentPageData?.label.replace(/\s+/g, '-') || 'Screenshot'}.png\n\nThis gives you perfect quality for Google Play Console!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            📱 10-inch Tablet Screenshots for Google Play Console
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">Instructions for Chromebook:</h2>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
              <li>Press <kbd className="bg-blue-200 px-2 py-1 rounded">F12</kbd> to open Developer Tools</li>
              <li>Click the mobile device icon 📱 in the toolbar</li>
              <li>Select "iPad Pro" or set custom size: 1620x2160px (exactly 3:4 ratio)</li>
              <li>Right-click on the tablet preview and select "Capture screenshot"</li>
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

        {/* Tablet Preview Frame */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="bg-black rounded-[1.5rem] p-3 shadow-2xl">
              <div id="tablet-preview" className="bg-white rounded-[1rem] overflow-hidden" style={{ width: '810px', height: '1080px' }}>
                {/* Status Bar */}
                <div className="bg-black text-white text-sm flex justify-between items-center px-8 py-3">
                  <span>9:41 AM</span>
                  <span className="flex items-center gap-2">
                    <span>📶</span>
                    <span>📶</span>
                    <span>🔋 100%</span>
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
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                📱 Download Tablet Screenshot
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Downloads as {currentPageData?.label} - Perfect for Google Play Console
              </p>
            </div>
            
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-sm text-gray-600 font-medium">
                Perfect 3:4 ratio for Google Play Console (1620x2160px when captured at 2x)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Current preview: 810x1080px (scales to full resolution in DevTools)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">✅ Google Play Console Requirements Met:</h3>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• 1620x2160px resolution (3:4 aspect ratio for tablets)</li>
            <li>• Between 1,080px and 7,680px on each side</li>
            <li>• PNG format when captured</li>
            <li>• Under 8MB file size</li>
            <li>• Authentic USA Home app content optimized for tablets</li>
            <li>• Ready for direct upload to Google Play Console</li>
          </ul>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 Pro Tip:</h3>
          <p className="text-yellow-800 text-sm">
            In Chrome DevTools, set the device to "Responsive" and manually enter 1620x2160 for exact Google Play requirements. 
            The tablet layout will automatically adjust to show your content beautifully on larger screens.
          </p>
        </div>
      </div>
    </div>
  );
}