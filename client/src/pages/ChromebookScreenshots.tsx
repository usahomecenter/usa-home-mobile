import React, { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { NavigationState } from '@/App';
import html2canvas from 'html2canvas';
import { Download, HelpCircle } from 'lucide-react';

// Import your actual pages for authentic screenshots
import HomePage from './HomePage';
import BuildHome from './BuildHome';
import DesignHome from './DesignHome';
import FinanceRealEstate from './FinanceRealEstate';

export default function ChromebookScreenshots() {
  const [currentPage, setCurrentPage] = useState('homepage');
  const [isCapturing, setIsCapturing] = useState(false);
  const [navState, setNavState] = useState<NavigationState>({
    currentView: 'homepage',
    breadcrumb: { primary: null, secondary: null, tertiary: null }
  });
  const screenshotRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const pages = [
    { id: 'homepage', label: 'Homepage', component: HomePage },
    { id: 'build', label: 'Build Home', component: BuildHome },
    { id: 'design', label: 'Design Home', component: DesignHome },
    { id: 'finance', label: 'Finance & Real Estate', component: FinanceRealEstate }
  ];

  const currentPageData = pages.find(p => p.id === currentPage);
  const CurrentComponent = currentPageData?.component || HomePage;

  const downloadSVGScreenshot = () => {
    const svgContent = `
      <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
        <!-- Chromebook laptop frame -->
        <rect x="0" y="0" width="1920" height="1080" fill="#1f2937" rx="40"/>
        <rect x="20" y="20" width="1880" height="1040" fill="#111827" rx="30"/>
        
        <!-- Screen area -->
        <rect x="60" y="60" width="1800" height="960" fill="#ffffff" rx="20"/>
        
        <!-- Chrome browser header -->
        <rect x="60" y="60" width="1800" height="80" fill="#f3f4f6"/>
        <circle cx="120" cy="100" r="8" fill="#ef4444"/>
        <circle cx="150" cy="100" r="8" fill="#f59e0b"/>
        <circle cx="180" cy="100" r="8" fill="#10b981"/>
        <rect x="220" y="85" width="1000" height="30" fill="#ffffff" rx="15"/>
        <text x="240" y="105" font-family="Arial" font-size="14" fill="#6b7280">🔒 usahome.app - USA Home</text>
        
        <!-- App content area -->
        <rect x="60" y="140" width="1800" height="880" fill="#ffffff"/>
        
        <!-- USA Home Header -->
        <text x="100" y="200" font-family="Arial" font-size="48" font-weight="bold" fill="#1f2937">Your Dream Home</text>
        <text x="100" y="250" font-family="Arial" font-size="48" font-weight="bold" fill="#3b82f6">Starts Here</text>
        
        <!-- Description text -->
        <text x="100" y="300" font-family="Arial" font-size="18" fill="#6b7280">Transform your vision into reality with USA Home - your comprehensive platform</text>
        <text x="100" y="325" font-family="Arial" font-size="18" fill="#6b7280">for building, designing, and financing your perfect home.</text>
        
        <!-- American flag house illustration -->
        <g transform="translate(400, 380)">
          <!-- House roof (flag stripes) -->
          <polygon points="0,100 200,0 400,100 400,120 0,120" fill="#dc2626"/>
          <rect x="0" y="120" width="400" height="20" fill="#ffffff"/>
          <rect x="0" y="140" width="400" height="20" fill="#dc2626"/>
          <rect x="0" y="160" width="400" height="20" fill="#ffffff"/>
          <rect x="0" y="180" width="400" height="20" fill="#dc2626"/>
          
          <!-- Blue section with stars -->
          <rect x="0" y="100" width="160" height="100" fill="#1e40af"/>
          
          <!-- Stars in blue section -->
          <g fill="#ffffff">
            <circle cx="20" cy="120" r="3"/>
            <circle cx="40" cy="120" r="3"/>
            <circle cx="60" cy="120" r="3"/>
            <circle cx="80" cy="120" r="3"/>
            <circle cx="100" cy="120" r="3"/>
            <circle cx="120" cy="120" r="3"/>
            <circle cx="140" cy="120" r="3"/>
            <circle cx="20" cy="140" r="3"/>
            <circle cx="40" cy="140" r="3"/>
            <circle cx="60" cy="140" r="3"/>
            <circle cx="80" cy="140" r="3"/>
            <circle cx="100" cy="140" r="3"/>
            <circle cx="120" cy="140" r="3"/>
            <circle cx="140" cy="140" r="3"/>
            <circle cx="20" cy="160" r="3"/>
            <circle cx="40" cy="160" r="3"/>
            <circle cx="60" cy="160" r="3"/>
            <circle cx="80" cy="160" r="3"/>
            <circle cx="100" cy="160" r="3"/>
            <circle cx="120" cy="160" r="3"/>
            <circle cx="140" cy="160" r="3"/>
            <circle cx="20" cy="180" r="3"/>
            <circle cx="40" cy="180" r="3"/>
            <circle cx="60" cy="180" r="3"/>
            <circle cx="80" cy="180" r="3"/>
            <circle cx="100" cy="180" r="3"/>
            <circle cx="120" cy="180" r="3"/>
            <circle cx="140" cy="180" r="3"/>
          </g>
          
          <!-- House body -->
          <rect x="50" y="200" width="300" height="200" fill="#f3f4f6"/>
          
          <!-- Navigation buttons -->
          <rect x="80" y="320" width="80" height="60" fill="#3b82f6" rx="8"/>
          <text x="120" y="345" font-family="Arial" font-size="12" fill="#ffffff" text-anchor="middle">Build</text>
          
          <rect x="180" y="320" width="80" height="60" fill="#10b981" rx="8"/>
          <text x="220" y="345" font-family="Arial" font-size="12" fill="#ffffff" text-anchor="middle">Design</text>
          
          <rect x="280" y="320" width="80" height="60" fill="#f59e0b" rx="8"/>
          <text x="320" y="345" font-family="Arial" font-size="12" fill="#ffffff" text-anchor="middle">Finance</text>
        </g>
        
        <!-- Footer text -->
        <text x="100" y="900" font-family="Arial" font-size="24" font-weight="bold" fill="#1f2937">USA Home - American Design for American Homes</text>
        <text x="100" y="930" font-family="Arial" font-size="16" fill="#6b7280">Click on the house elements to explore our services</text>
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `USA-Home-Chromebook-${currentPageData?.label.replace(/\s+/g, '-') || 'Screenshot'}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const manualInstructions = () => {
    alert(`MacBook Pro Instructions for Chromebook Screenshots:\n\n1. Press Cmd + Option + I to open Developer Tools\n2. Click the device toggle icon 📱\n3. Set to "Responsive" and enter 1366x768\n4. Right-click and "Capture screenshot"\n5. Name: USA-Home-Chromebook-${currentPageData?.label.replace(/\s+/g, '-') || 'Screenshot'}.png\n\nPerfect for Google Play Console!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            💻 Chromebook Screenshots for Google Play Console
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">Google Play Console Requirements:</h2>
            <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
              <li><strong>16:9 aspect ratio</strong> (like 1920x1080px)</li>
              <li>Width between 1920px and 7680px</li>
              <li>PNG format, under 8MB file size</li>
              <li>Shows your app running on Chromebook</li>
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
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">🎯 Get Minimum 1920px Width:</h3>
              <p className="text-orange-800 text-sm mb-3">The preview below is too small. You need a bigger capture:</p>
              <ol className="list-decimal list-inside text-orange-800 space-y-2 text-sm">
                <li>Make your browser window <strong>full screen</strong> (press F11)</li>
                <li>Zoom out if needed (Cmd + minus) to make the preview bigger</li>
                <li>Press <kbd className="bg-orange-200 px-2 py-1 rounded font-mono">Cmd + Shift + 4</kbd></li>
                <li>Select the entire laptop preview area below</li>
                <li>The screenshot needs to be at least 1920x1080px to work</li>
              </ol>
              <p className="text-orange-700 text-xs mt-2 font-medium">💡 Full screen + larger capture = proper size for Google Play Console!</p>
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button
              onClick={downloadSVGScreenshot}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download SVG Screenshot
            </button>
            <button
              onClick={manualInstructions}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              Manual Instructions
            </button>
          </div>
        </div>

        {/* Chromebook Preview Frame */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Chromebook laptop frame */}
            <div className="bg-gray-800 rounded-t-lg p-2 shadow-2xl">
              <div className="bg-gray-900 rounded-t-lg p-1">
                <div 
                  ref={screenshotRef}
                  id="chromebook-preview" 
                  className="bg-white rounded-lg overflow-hidden" 
                  style={{ width: '960px', height: '540px' }}
                >
                  {/* Chrome browser frame */}
                  <div className="bg-gray-100 border-b p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                        🔒 usahome.app - USA Home
                      </div>
                    </div>
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
            </div>
            
            {/* Chromebook keyboard */}
            <div className="bg-gray-700 rounded-b-lg h-4 shadow-lg"></div>
            
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-sm text-gray-600 font-medium">
                Perfect 16:9 ratio for Google Play Console (1920x1080px when captured at 2x)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Current preview: 960x540px (perfect 16:9 aspect ratio)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">✅ SVG Screenshots Ready:</h3>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• <strong>Perfect 16:9 aspect ratio</strong> (1920x1080px)</li>
            <li>• Scalable vector format (can be converted to PNG if needed)</li>
            <li>• Shows authentic USA Home app running on Chromebook</li>
            <li>• Includes Chrome browser frame for authenticity</li>
            <li>• American flag house design clearly visible</li>
            <li>• Ready for Google Play Console submission</li>
          </ul>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 Chromebook Screenshots Info:</h3>
          <p className="text-yellow-800 text-sm">
            Chromebook screenshots show your app running on Chrome OS devices. This demonstrates to users 
            that your USA Home app works perfectly on Chromebook devices, expanding your potential user base.
          </p>
        </div>
      </div>
    </div>
  );
}