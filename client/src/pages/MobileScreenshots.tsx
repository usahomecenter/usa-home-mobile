import React from 'react';

export default function MobileScreenshots() {
  const downloadScreenshot = (elementId: string, filename: string) => {
    // Instructions for user to right-click and save
    alert('Right-click on the phone mockup and select "Save image as..." to download the screenshot');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">USA Home - Mobile App Screenshots</h1>
        <p className="text-center text-gray-600 mb-12">Professional mobile mockups for app store listings (9:16 aspect ratio)</p>
        
        <div className="grid gap-8">
          {/* Screenshot 1: Homepage */}
          <div className="flex flex-col items-center">
            <div 
              id="screenshot1" 
              className="relative bg-black rounded-3xl p-2 shadow-2xl"
              style={{ width: '375px', height: '812px' }}
            >
              <div className="w-full h-full bg-white rounded-3xl overflow-hidden relative">
                {/* Status Bar */}
                <div className="h-11 bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-between items-center px-5 text-white text-sm font-semibold">
                  <span>9:41</span>
                  <span>USA Home</span>
                  <span>🔋 100%</span>
                </div>
                
                {/* Authentic USA Home Homepage */}
                <div className="h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
                  {/* Header */}
                  <div className="text-center pt-4 pb-2">
                    <h1 className="text-2xl font-black text-white">USA HOME</h1>
                    <p className="text-sm text-white opacity-90">Your Dream Home Starts Here</p>
                  </div>
                  
                  {/* House with American Flag Design */}
                  <div className="flex justify-center my-4">
                    <svg width="140" height="100" viewBox="0 0 300 200" className="drop-shadow-lg">
                      {/* House body */}
                      <rect x="50" y="120" width="200" height="80" fill="#ffffff" stroke="#ddd" strokeWidth="2"/>
                      
                      {/* American flag roof - blue section with stars */}
                      <polygon points="50,120 150,60 150,120" fill="#1e40af"/>
                      <circle cx="100" cy="85" r="2" fill="#ffffff"/>
                      <circle cx="120" cy="75" r="2" fill="#ffffff"/>
                      <circle cx="100" cy="100" r="2" fill="#ffffff"/>
                      <circle cx="120" cy="90" r="2" fill="#ffffff"/>
                      <circle cx="130" cy="105" r="2" fill="#ffffff"/>
                      
                      {/* Red and white stripes section */}
                      <polygon points="150,60 250,120 150,120" fill="#DC143C"/>
                      <polygon points="150,75 235,115 150,115" fill="#ffffff"/>
                      <polygon points="150,90 220,110 150,110" fill="#DC143C"/>
                      <polygon points="150,105 205,105 150,105" fill="#ffffff"/>
                      
                      {/* Windows */}
                      <rect x="80" y="140" width="30" height="25" fill="#87CEEB" stroke="#8B4513" strokeWidth="1"/>
                      <rect x="190" y="140" width="30" height="25" fill="#87CEEB" stroke="#8B4513" strokeWidth="1"/>
                      
                      {/* Door */}
                      <rect x="135" y="160" width="30" height="40" fill="#8B4513"/>
                      <circle cx="155" cy="180" r="1" fill="#FFD700"/>
                      
                      {/* Chimney */}
                      <rect x="200" y="80" width="15" height="40" fill="#DC143C"/>
                    </svg>
                  </div>
                  
                  {/* Description */}
                  <div className="px-4 mb-4">
                    <p className="text-xs text-white text-center opacity-90 leading-relaxed">
                      Transform your vision into reality with USA Home - your comprehensive platform for building, designing, and financing your perfect home.
                    </p>
                  </div>
                  
                  {/* Interactive Sections */}
                  <div className="px-4 space-y-3">
                    <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-30">
                      <h3 className="text-white font-bold text-sm mb-1">🏗️ Build Your Dream Home</h3>
                      <p className="text-white text-xs opacity-90">Connect with trusted contractors and specialists for construction projects</p>
                    </div>
                    
                    <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-30">
                      <h3 className="text-white font-bold text-sm mb-1">🎨 Design Your Dream Home</h3>
                      <p className="text-white text-xs opacity-90">Find creative professionals and interior designers for your space</p>
                    </div>
                    
                    <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-30">
                      <h3 className="text-white font-bold text-sm mb-1">💰 Finance & Real Estate</h3>
                      <p className="text-white text-xs opacity-90">Secure financing options and connect with real estate professionals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => downloadScreenshot('screenshot1', 'USA-Home-Screenshot-1-Homepage.png')}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Download Screenshot 1 - Homepage
            </button>
          </div>

          {/* Screenshot 2: Build Section */}
          <div className="flex flex-col items-center">
            <div 
              id="screenshot2" 
              className="relative bg-black rounded-3xl p-2 shadow-2xl"
              style={{ width: '375px', height: '812px' }}
            >
              <div className="w-full h-full bg-white rounded-3xl overflow-hidden relative">
                {/* Status Bar */}
                <div className="h-11 bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-between items-center px-5 text-white text-sm font-semibold">
                  <span>9:41</span>
                  <span>Build Home</span>
                  <span>🔋 100%</span>
                </div>
                
                {/* Build Section Content */}
                <div className="h-full bg-gray-50 p-5">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-2xl text-center mb-5">
                    <h2 className="text-2xl font-bold">🏗️ Build Your Dream Home</h2>
                    <p className="mt-2 opacity-90">Connect with verified contractors</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-white rounded-xl p-5 text-center shadow-md">
                      <div className="text-3xl mb-2">🍳</div>
                      <div className="text-sm font-semibold">Kitchen Remodeling</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-md">
                      <div className="text-3xl mb-2">🛁</div>
                      <div className="text-sm font-semibold">Bathroom Renovation</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-md">
                      <div className="text-3xl mb-2">🏡</div>
                      <div className="text-sm font-semibold">Home Addition</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-md">
                      <div className="text-3xl mb-2">🔧</div>
                      <div className="text-sm font-semibold">General Contractor</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-md">
                      <div className="text-3xl mb-2">🏠</div>
                      <div className="text-sm font-semibold">New Construction</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-md">
                      <div className="text-3xl mb-2">🔌</div>
                      <div className="text-sm font-semibold">Electrical Work</div>
                    </div>
                  </div>
                  <div className="text-center text-gray-600 text-sm">
                    Tap any category to find verified professionals
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => downloadScreenshot('screenshot2', 'USA-Home-Screenshot-2-Build.png')}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Download Screenshot 2 - Build Section
            </button>
          </div>

          {/* Screenshot 3: Professional Profile */}
          <div className="flex flex-col items-center">
            <div 
              id="screenshot3" 
              className="relative bg-black rounded-3xl p-2 shadow-2xl"
              style={{ width: '375px', height: '812px' }}
            >
              <div className="w-full h-full bg-white rounded-3xl overflow-hidden relative">
                {/* Status Bar */}
                <div className="h-11 bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-between items-center px-5 text-white text-sm font-semibold">
                  <span>9:41</span>
                  <span>Professional Profile</span>
                  <span>🔋 100%</span>
                </div>
                
                {/* Profile Content */}
                <div className="h-full bg-gray-50 p-5">
                  <div className="bg-white rounded-2xl p-5 text-center mb-5 shadow-md">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                      JD
                    </div>
                    <div className="text-xl font-bold mb-1">John Davis</div>
                    <div className="text-gray-600 mb-2">Kitchen Remodeling Specialist</div>
                    <div className="flex justify-center items-center gap-1 mb-3">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-sm">4.9 (127 reviews)</span>
                    </div>
                    <div className="text-green-600 font-semibold">✓ Verified Professional</div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 mb-4 shadow-md">
                    <div className="font-semibold mb-2">About</div>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      15+ years experience in kitchen remodeling. Licensed, insured, and committed to quality craftsmanship.
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 mb-4 shadow-md">
                    <div className="font-semibold mb-2">Services</div>
                    <div className="text-gray-600 text-sm">
                      • Custom Kitchen Design<br/>
                      • Cabinet Installation<br/>
                      • Countertop Installation<br/>
                      • Plumbing & Electrical
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-semibold">
                    Contact Professional
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => downloadScreenshot('screenshot3', 'USA-Home-Screenshot-3-Profile.png')}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Download Screenshot 3 - Professional Profile
            </button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Right-click on each phone mockup and select "Save image as..." to download high-quality PNGs
          </p>
          <p className="text-sm text-gray-500">
            All screenshots are optimized for app store requirements (9:16 aspect ratio)
          </p>
        </div>
      </div>
    </div>
  );
}