import React from 'react';

const AppStoreAssetsPage = () => {
  const downloadSVG = () => {
    const svgData = 'data:image/svg+xml;charset=utf-8,<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">  <!-- Background -->  <rect width="512" height="512" rx="120" fill="#4361EE" />    <!-- House Base -->  <rect x="110" y="220" width="292" height="212" rx="8" fill="#FFFFFF" />    <!-- Windows -->  <rect x="150" y="260" width="70" height="70" rx="4" fill="#73C7FF" />  <rect x="292" y="260" width="70" height="70" rx="4" fill="#73C7FF" />    <!-- Door -->  <rect x="231" y="320" width="50" height="112" rx="4" fill="#FF9A3C" />  <circle cx="246" cy="376" r="5" fill="#333333" />    <!-- Roof -->  <path d="M100 230L256 100L412 230H100Z" fill="#FF5A5F" />    <!-- Chimney -->  <rect x="340" y="130" width="30" height="80" fill="#DB4C48" />  <rect x="335" y="120" width="40" height="10" fill="#333333" />    <!-- Dollar sign on chimney -->  <text x="355" y="180" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">$</text>    <!-- Foundation -->  <rect x="100" y="432" width="312" height="20" rx="4" fill="#BBBBBB" />    <!-- USA HOME text -->  <text x="256" y="480" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">USA HOME</text></svg>';
      
    const downloadLink = document.createElement('a');
    downloadLink.href = svgData;
    downloadLink.download = 'usa-home-app-icon.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadFeatureGraphic = () => {
    const svgData = 'data:image/svg+xml;charset=utf-8,<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">  <!-- Background gradient -->  <defs>    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">      <stop offset="0%" stop-color="#4361EE" />      <stop offset="100%" stop-color="#3A0CA3" />    </linearGradient>  </defs>  <rect width="1024" height="500" fill="url(#bgGradient)" />    <!-- Decorative elements -->  <circle cx="100" cy="100" r="200" fill="#4CC9F0" fill-opacity="0.1" />  <circle cx="900" cy="400" r="150" fill="#F72585" fill-opacity="0.1" />    <!-- House Illustration (simplified) -->  <g transform="translate(100, 150) scale(0.8)">    <!-- House Base -->    <rect x="110" y="220" width="292" height="212" rx="8" fill="#FFFFFF" />        <!-- Windows -->    <rect x="150" y="260" width="70" height="70" rx="4" fill="#73C7FF" />    <rect x="292" y="260" width="70" height="70" rx="4" fill="#73C7FF" />        <!-- Door -->    <rect x="231" y="320" width="50" height="112" rx="4" fill="#FF9A3C" />    <circle cx="246" cy="376" r="5" fill="#333333" />        <!-- Roof -->    <path d="M100 230L256 100L412 230H100Z" fill="#FF5A5F" />        <!-- Chimney -->    <rect x="340" y="130" width="30" height="80" fill="#DB4C48" />    <rect x="335" y="120" width="40" height="10" fill="#333333" />        <!-- Foundation -->    <rect x="100" y="432" width="312" height="20" rx="4" fill="#BBBBBB" />  </g>    <!-- App Title and Tagline -->  <g transform="translate(550, 200)">    <text x="0" y="0" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF">USA HOME</text>    <text x="0" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="normal" fill="#FFFFFF">Your Dream Home</text>    <text x="0" y="120" font-family="Arial, sans-serif" font-size="32" font-weight="normal" fill="#FFFFFF">Starts Here</text>        <!-- Decorative line -->    <line x1="0" y1="140" x2="400" y2="140" stroke="#F72585" stroke-width="4" />        <!-- Feature icons -->    <g transform="translate(0, 170)">      <circle cx="20" cy="20" r="15" fill="#4CC9F0" />      <text x="50" y="28" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF">Build</text>            <circle cx="150" cy="20" r="15" fill="#F72585" />      <text x="180" y="28" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF">Design</text>            <circle cx="300" cy="20" r="15" fill="#FF9A3C" />      <text x="330" y="28" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF">Finance</text>    </g>  </g></svg>';
      
    const downloadLink = document.createElement('a');
    downloadLink.href = svgData;
    downloadLink.download = 'usa-home-feature-graphic.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-4">USA Home App Store Assets</h1>
      <p className="mb-8">This page contains all the assets you need for your Google Play and App Store submissions. You can download or copy the assets below.</p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-primary-dark mb-4">App Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-2">512x512 Main Icon</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-center">
              <img 
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDwhLS0gQmFja2dyb3VuZCAtLT4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEyMCIgZmlsbD0iIzQzNjFFRSIgLz4KICAKICA8IS0tIEhvdXNlIEJhc2UgLS0+CiAgPHJlY3QgeD0iMTEwIiB5PSIyMjAiIHdpZHRoPSIyOTIiIGhlaWdodD0iMjEyIiByeD0iOCIgZmlsbD0iI0ZGRkZGRiIgLz4KICAKICA8IS0tIFdpbmRvd3MgLS0+CiAgPHJlY3QgeD0iMTUwIiB5PSIyNjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgcng9IjQiIGZpbGw9IiM3M0M3RkYiIC8+CiAgPHJlY3QgeD0iMjkyIiB5PSIyNjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgcng9IjQiIGZpbGw9IiM3M0M3RkYiIC8+CiAgCiAgPCEtLSBEb29yIC0tPgogIDxyZWN0IHg9IjIzMSIgeT0iMzIwIiB3aWR0aD0iNTAiIGhlaWdodD0iMTEyIiByeD0iNCIgZmlsbD0iI0ZGOUEzQyIgLz4KICA8Y2lyY2xlIGN4PSIyNDYiIGN5PSIzNzYiIHI9IjUiIGZpbGw9IiMzMzMzMzMiIC8+CiAgCiAgPCEtLSBSb29mIC0tPgogIDxwYXRoIGQ9Ik0xMDAgMjMwTDI1NiAxMDBMNDEyIDIzMEgxMDBaIiBmaWxsPSIjRkY1QTVGIiAvPgogIAogIDwhLS0gQ2hpbW5leSAtLT4KICA8cmVjdCB4PSIzNDAiIHk9IjEzMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREI0QzQ4IiAvPgogIDxyZWN0IHg9IjMzNSIgeT0iMTIwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIGZpbGw9IiMzMzMzMzMiIC8+CiAgCiAgPCEtLSBEb2xsYXIgc2lnbiBvbiBjaGltbmV5IC0tPgogIDx0ZXh0IHg9IjM1NSIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+JDwvdGV4dD4KICAKICA8IS0tIEZvdW5kYXRpb24gLS0+CiAgPHJlY3QgeD0iMTAwIiB5PSI0MzIiIHdpZHRoPSIzMTIiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjQkJCQkJCIiAvPgogIAogIDwhLS0gVVNBIEhPTUUgdGV4dCAtLT4KICA8dGV4dCB4PSIyNTYiIHk9IjQ4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVTQSBIT01FPC90ZXh0Pgo8L3N2Zz4=" 
                alt="App Icon" 
                className="w-64 h-64" 
              />
            </div>
            <button
              onClick={downloadSVG}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
            >
              Download SVG
            </button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-primary-dark mb-4">Feature Graphic (1024x500)</h2>
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
          <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-center">
            <img 
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMjQiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgMTAyNCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBCYWNrZ3JvdW5kIGdyYWRpZW50IC0tPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZ0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQzNjFFRSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjM0EwQ0EzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMjQiIGhlaWdodD0iNTAwIiBmaWxsPSJ1cmwoI2JnR3JhZGllbnQpIiAvPgogIAogIDwhLS0gRGVjb3JhdGl2ZSBlbGVtZW50cyAtLT4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjIwMCIgZmlsbD0iIzRDQzlGMCIgZmlsbC1vcGFjaXR5PSIwLjEiIC8+CiAgPGNpcmNsZSBjeD0iOTAwIiBjeT0iNDAwIiByPSIxNTAiIGZpbGw9IiNGNzI1ODUiIGZpbGwtb3BhY2l0eT0iMC4xIiAvPgogIAogIDwhLS0gSG91c2UgSWxsdXN0cmF0aW9uIChzaW1wbGlmaWVkKSAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDAsIDE1MCkgc2NhbGUoMC44KSI+CiAgICA8IS0tIEhvdXNlIEJhc2UgLS0+CiAgICA8cmVjdCB4PSIxMTAiIHk9IjIyMCIgd2lkdGg9IjI5MiIgaGVpZ2h0PSIyMTIiIHJ4PSI4IiBmaWxsPSIjRkZGRkZGIiAvPgogICAgCiAgICA8IS0tIFdpbmRvd3MgLS0+CiAgICA8cmVjdCB4PSIxNTAiIHk9IjI2MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiByeD0iNCIgZmlsbD0iIzczQzdGRiIgLz4KICAgIDxyZWN0IHg9IjI5MiIgeT0iMjYwIiB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHJ4PSI0IiBmaWxsPSIjNzNDN0ZGIiAvPgogICAgCiAgICA8IS0tIERvb3IgLS0+CiAgICA8cmVjdCB4PSIyMzEiIHk9IjMyMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjExMiIgcng9IjQiIGZpbGw9IiNGRjlBM0MiIC8+CiAgICA8Y2lyY2xlIGN4PSIyNDYiIGN5PSIzNzYiIHI9IjUiIGZpbGw9IiMzMzMzMzMiIC8+CiAgICAKICAgIDwhLS0gUm9vZiAtLT4KICAgIDxwYXRoIGQ9Ik0xMDAgMjMwTDI1NiAxMDBMNDEyIDIzMEgxMDBaIiBmaWxsPSIjRkY1QTVGIiAvPgogICAgCiAgICA8IS0tIENoaW1uZXkgLS0+CiAgICA8cmVjdCB4PSIzNDAiIHk9IjEzMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREI0QzQ4IiAvPgogICAgPHJlY3QgeD0iMzM1IiB5PSIxMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzMzMzMzMyIgLz4KICAgIAogICAgPCEtLSBGb3VuZGF0aW9uIC0tPgogICAgPHJlY3QgeD0iMTAwIiB5PSI0MzIiIHdpZHRoPSIzMTIiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjQkJCQkJCIiAvPgogIDwvZz4KICAKICA8IS0tIEFwcCBUaXRsZSBhbmQgVGFnbGluZSAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTAsIDIwMCkiPgogICAgPHRleHQgeD0iMCIgeT0iMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjcyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+VVNBIEhPTUU8L3RleHQ+CiAgICA8dGV4dCB4PSIwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjRkZGRkZGIj5Zb3VyIERyZWFtIEhvbWU8L3RleHQ+CiAgICA8dGV4dCB4PSIwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgZmlsbD0iI0ZGRkZGRiI+U3RhcnRzIEhlcmU8L3RleHQ+CiAgICAKICAgIDwhLS0gRGVjb3JhdGl2ZSBsaW5lIC0tPgogICAgPGxpbmUgeDE9IjAiIHkxPSIxNDAiIHgyPSI0MDAiIHkyPSIxNDAiIHN0cm9rZT0iI0Y3MjU4NSIgc3Ryb2tlLXdpZHRoPSI0IiAvPgogICAgCiAgICA8IS0tIEZlYXR1cmUgaWNvbnMgLS0+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAxNzApIj4KICAgICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IiM0Q0M5RjAiIC8+CiAgICAgIDx0ZXh0IHg9IjUwIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIj5CdWlsZDwvdGV4dD4KICAgICAgCiAgICAgIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwIiByPSIxNSIgZmlsbD0iI0Y3MjU4NSIgLz4KICAgICAgPHRleHQgeD0iMTgwIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIj5EZXNpZ248L3RleHQ+CiAgICAgIAogICAgICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IiNGRjlBM0MiIC8+CiAgICAgIDx0ZXh0IHg9IjMzMCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGRkZGRiI+RmluYW5jZTwvdGV4dD4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==" 
              alt="Feature Graphic" 
              className="w-full max-w-3xl" 
            />
          </div>
          <button
            onClick={downloadFeatureGraphic}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
          >
            Download Feature Graphic
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-primary-dark mb-4">App Store Listing Text</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">App Name</h3>
          <textarea 
            readOnly 
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50" 
            rows={1}
            value="USA Home"
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Short Description (80 characters max)</h3>
          <textarea 
            readOnly 
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50" 
            rows={2}
            value="Your complete platform for building, designing, and financing your dream home."
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Full Description</h3>
          <textarea 
            readOnly 
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50" 
            rows={15}
            value={`USA Home: Your All-in-One Home Building & Design Solution

Transform your vision into reality with USA Home - your comprehensive platform for building, designing, and financing your perfect home. Whether you're planning to build a new home, renovate an existing one, or simply need financing options, USA Home connects you with the right professionals for your project.

🏗️ BUILD YOUR HOME
• Connect with licensed general contractors and construction professionals
• Find specialized tradespeople: electricians, plumbers, HVAC specialists, and more
• Access expert foundation, framing, and roofing contractors
• Discover interior finishing specialists for every room in your home

🎨 DESIGN YOUR HOME
• Browse professional interior designers and decorators
• Connect with landscape architects for outdoor spaces
• Find furniture specialists and custom cabinetry experts
• Discover sustainable and eco-friendly design solutions

💰 FINANCE & REAL ESTATE
• Compare mortgage options and home loans
• Apply for construction financing
• Connect with real estate agents in your area
• Explore business loan options for contractors and service providers

KEY FEATURES:
• Intuitive navigation through an interactive house illustration
• Comprehensive service provider listings with verified reviews
• Multilingual support in eight languages
• Simple communication tools to connect with professionals
• Secure payment processing for service providers
• Detailed professional profiles with portfolios and credentials

USA Home brings together homeowners, contractors, designers, and financial services in one seamless platform, making the home building and designing process easier than ever before.

Start your journey to creating your dream home today with USA Home – where your perfect home begins.`}
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Keywords</h3>
          <textarea 
            readOnly 
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50" 
            rows={2}
            value="home building, interior design, construction, mortgage, real estate, house design, renovation"
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-primary-dark mb-4">Screenshot Guide</h2>
        <textarea 
          readOnly 
          className="w-full p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50" 
          rows={15}
          value={`# USA Home App Store Screenshots Guide

This document provides guidance on creating high-quality screenshots for your Google Play and App Store submissions.

## Required Screenshots

Google Play requires screenshots in these formats:
- Phone screenshots (16:9 aspect ratio)
- 7-inch tablet screenshots (optional but recommended)
- 10-inch tablet screenshots (optional but recommended)

## Screenshot Locations

Take screenshots of these key screens:

### 1. Home Screen with Interactive House
- Show the main house illustration with all elements visible
- Make sure the UI is clean with no overlays or dialogs
- Capture in both portrait and landscape orientations

### 2. Build Home Section
- Show the category selection screen
- Include a few sample professionals if possible
- Make sure the UI shows breadcrumb navigation

### 3. Design Home Section
- Show the interior design professionals
- If possible, show some example portfolio items
- Capture the filter/search interface if applicable

### 4. Finance & Real Estate Section
- Show the mortgage options and calculators
- Include the real estate agent finder if implemented
- Show any loan comparison tools

### 5. Professional Profile
- Show a detailed profile of a service provider
- Make sure ratings and reviews are visible
- Include contact information section (blurred for privacy)

### 6. Language Selection
- Show the language selector dropdown
- Try to capture multiple language options visible
- Show how translations appear in the UI

### 7. Review Form
- Show the emoji-based rating system
- Include the review text field
- Show any validation or confirmation messages

### 8. App Settings or Profile
- Show user account management options
- Include app preferences if applicable
- Show navigation between major sections

## Screenshot Tips

1. **Clean Status Bar**: Make sure your device status bar is clean (full battery, no notifications)
2. **Consistent Time**: Set the same time (preferably 9:41) on all screenshots
3. **Use Real Data**: Use realistic data, not placeholder content
4. **Consistent Theme**: Use the same theme (light/dark) across all screenshots
5. **Device Frames**: Don't add device frames; app stores often add these automatically`}
        />
      </section>
    </div>
  );
};

export default AppStoreAssetsPage;