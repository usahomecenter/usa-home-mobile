import { useState } from "react";
import { Download, Smartphone, Monitor, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppStoreDownloads() {
  const [downloadCount, setDownloadCount] = useState(0);

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFeatureGraphic = () => {
    const featureGraphicContent = `<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1024" height="500" fill="url(#bgGradient)"/>
  
  <!-- House Icon -->
  <g transform="translate(50, 120) scale(0.8)">
    <!-- White house walls -->
    <rect x="50" y="200" width="300" height="150" fill="#ffffff" stroke="#D2B48C" stroke-width="2"/>
    
    <!-- American flag triangular roof -->
    <!-- Blue section with stars -->
    <polygon points="50,200 200,100 200,200" fill="#1e40af"/>
    
    <!-- White stars in blue section -->
    <g fill="#ffffff">
      <circle cx="100" cy="130" r="4"/>
      <circle cx="125" cy="120" r="4"/>
      <circle cx="150" cy="130" r="4"/>
      <circle cx="175" cy="120" r="4"/>
      <circle cx="100" cy="150" r="4"/>
      <circle cx="125" cy="160" r="4"/>
      <circle cx="150" cy="150" r="4"/>
      <circle cx="175" cy="160" r="4"/>
      <circle cx="100" cy="170" r="4"/>
      <circle cx="125" cy="180" r="4"/>
      <circle cx="150" cy="170" r="4"/>
      <circle cx="175" cy="180" r="4"/>
    </g>
    
    <!-- Red and white stripes section -->
    <polygon points="200,100 350,200 200,200" fill="#DC143C"/>
    <!-- White stripes -->
    <polygon points="200,115 335,190 200,190" fill="#ffffff"/>
    <polygon points="200,135 320,180 200,180" fill="#DC143C"/>
    <polygon points="200,155 305,170 200,170" fill="#ffffff"/>
    <polygon points="200,175 290,160 200,160" fill="#DC143C"/>
    
    <!-- Red chimney -->
    <rect x="300" y="130" width="20" height="70" fill="#DC143C"/>
    
    <!-- Two windows -->
    <rect x="80" y="230" width="50" height="40" fill="#87CEEB" stroke="#8B4513" stroke-width="2"/>
    <rect x="270" y="230" width="50" height="40" fill="#87CEEB" stroke="#8B4513" stroke-width="2"/>
    
    <!-- Window grid lines -->
    <line x1="105" y1="230" x2="105" y2="270" stroke="#8B4513" stroke-width="1"/>
    <line x1="80" y1="250" x2="130" y2="250" stroke="#8B4513" stroke-width="1"/>
    <line x1="295" y1="230" x2="295" y2="270" stroke="#8B4513" stroke-width="1"/>
    <line x1="270" y1="250" x2="320" y2="250" stroke="#8B4513" stroke-width="1"/>
    
    <!-- Brown door -->
    <rect x="175" y="280" width="40" height="70" fill="#8B4513"/>
    <circle cx="205" cy="315" r="2" fill="#FFD700"/>
    
    <!-- Foundation -->
    <rect x="50" y="350" width="300" height="10" fill="#D2B48C"/>
  </g>
  
  <!-- USA HOME Text -->
  <text x="480" y="180" font-family="Arial" font-size="72" font-weight="bold" text-anchor="middle" fill="#ffffff">USA HOME</text>
  
  <!-- Subtitle -->
  <text x="480" y="240" font-family="Arial" font-size="28" text-anchor="middle" fill="#e5e7eb">YOUR DREAM HOME STARTS HERE</text>
  
  <!-- Line separator -->
  <rect x="350" y="260" width="260" height="3" fill="#ffffff"/>
  
  <!-- Services text -->
  <text x="480" y="320" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="#ffffff">BUILD • DESIGN • FINANCE</text>
  
  <!-- Decorative dots -->
  <circle cx="420" cy="380" r="12" fill="#06d6a0"/>
  <circle cx="480" cy="380" r="12" fill="#f472b6"/>
  <circle cx="540" cy="380" r="12" fill="#fb923c"/>
  
  <!-- Right side professional icons -->
  <g transform="translate(750, 150)">
    <!-- Construction worker icon -->
    <circle cx="40" cy="40" r="35" fill="#ffffff" opacity="0.2"/>
    <rect x="25" y="30" width="30" height="20" fill="#8B4513"/>
    <circle cx="40" cy="25" r="8" fill="#F4A460"/>
    
    <!-- Designer icon -->
    <circle cx="40" cy="120" r="35" fill="#ffffff" opacity="0.2"/>
    <rect x="30" y="115" width="20" height="10" fill="#4169E1"/>
    <polygon points="25,125 40,110 55,125" fill="#32CD32"/>
    
    <!-- Finance icon -->
    <circle cx="40" cy="200" r="35" fill="#ffffff" opacity="0.2"/>
    <text x="40" y="210" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#FFD700">$</text>
  </g>
  
</svg>`;

    downloadFile('feature-graphic.svg', featureGraphicContent);
    setDownloadCount(prev => prev + 1);
  };

  const downloadHeaderImage = () => {
    const headerSvgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="4096" height="2304" viewBox="0 0 4096 2304" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a5b4fc;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f472b6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#06d6a0;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#06d6a0;stop-opacity:0.3" />
    </radialGradient>
  </defs>
  
  <!-- Sky background -->
  <rect width="4096" height="2304" fill="url(#skyGradient)"/>
  
  <!-- Sun -->
  <circle cx="3500" cy="500" r="180" fill="url(#sunGlow)"/>
  
  <!-- Clouds -->
  <g fill="#ffffff" opacity="0.7">
    <ellipse cx="800" cy="400" rx="120" ry="60"/>
    <ellipse cx="750" cy="400" rx="80" ry="40"/>
    <ellipse cx="850" cy="400" rx="100" ry="50"/>
    
    <ellipse cx="2800" cy="600" rx="150" ry="80"/>
    <ellipse cx="2750" cy="600" rx="100" ry="50"/>
    <ellipse cx="2900" cy="600" rx="120" ry="60"/>
  </g>
  
  <!-- Main Title with modern typography -->
  <image x="200" y="800" width="400" height="400" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7N17vF1Vfe/xz2+tnRDuCQQSLpKAXOWiAgJeUFsVtFqtpz2tPfW0drS2Wltbj55qz3nZ06vX9jy2L1t7qbXVWi+1ahW8VEFAQe4g9yAhCQm5kpCQhOy91po/xpyTvfdeO2Qnc6055xzf9+u1X3vtOdc++zfWXHN855xzjCnOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeecc84555xzzjnnnHPOOeec68r2X3K4mq7bpbGxsW2I2Yfb1/8kIjKNmV1vZjea2S9NrPFz/52ISNmKGMBZjElpZtPM7E1m9jIzO9vMjjaz6UlEE4Haa9C8u++3M8esZzO23rfX/qmvNWwF4PZdtmD+LOXnPG9Wa/y5sw9o+4ePGtxgZpePfqvOOTfxigpgVq8W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"/>
  
  <!-- Centered content with balanced layout -->
  <g transform="translate(1400, 700)">
    <!-- Different brand messaging with improved typography and spacing -->
    <text x="650" y="180" font-family="Arial" font-size="160" font-weight="700" text-anchor="middle" fill="#ffffff" letter-spacing="8px">CONNECTING</text>
    <text x="650" y="340" font-family="Arial" font-size="180" font-weight="800" text-anchor="middle" fill="url(#titleGradient)" letter-spacing="12px">AMERICA</text>
    
    <!-- Unique tagline with better spacing -->
    <text x="650" y="480" font-family="Arial" font-size="85" text-anchor="middle" fill="#ffffff">One Project at a Time</text>
    
    <!-- Supporting message -->
    <text x="650" y="580" font-family="Arial" font-size="55" text-anchor="middle" fill="#ffffff">From Coast to Coast, We Make It Happen</text>
    
    <!-- Different value propositions centered -->
    <g transform="translate(200, 700)">
      <text x="450" y="0" font-family="Arial" font-size="45" text-anchor="middle" fill="#ffffff">🏆 Award-Winning Service Network</text>
      <text x="450" y="70" font-family="Arial" font-size="45" text-anchor="middle" fill="#ffffff">⚡ Same-Day Response Guarantee</text>
      <text x="450" y="140" font-family="Arial" font-size="45" text-anchor="middle" fill="#ffffff">🛡️ Full Project Protection</text>
      <text x="450" y="210" font-family="Arial" font-size="45" text-anchor="middle" fill="#ffffff">💯 100% Satisfaction Promise</text>
    </g>
  </g>
  
  <!-- Decorative elements around house -->
  <circle cx="1800" cy="800" r="150" fill="url(#sunGlow)"/>
  <circle cx="3200" cy="1500" r="100" fill="url(#sunGlow)"/>
  
</svg>`;

    downloadFile('usa-home-header.svg', headerSvgContent);
    setDownloadCount(prev => prev + 1);
  };

  const downloadSVGIcon = () => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Square background for Google Play Store -->
  <rect width="512" height="512" fill="#f0f0f0" rx="90"/>
  
  <!-- Define clip path for roof - adjusted for square design -->
  <defs>
    <clipPath id="roofClip">
      <polygon points="60,220 256,100 452,220"/>
    </clipPath>
  </defs>
  
  <!-- Realistic House Body with gradient and depth -->
  <defs>
    <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f8f8f8;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="foundationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#e0e0e0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c0c0c0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Foundation base - adjusted for square design -->
  <rect x="90" y="420" width="332" height="15" fill="url(#foundationGradient)" stroke="#aaa" stroke-width="1"/>
  
  <!-- Main house body with realistic gradient - square proportions -->
  <rect x="90" y="220" width="332" height="200" fill="url(#wallGradient)" stroke="#ddd" stroke-width="2"/>
  
  <!-- Realistic siding panels with enhanced 3D effect -->
  <g>
    <!-- Horizontal siding lines for realistic texture -->
    <g stroke="#e8e8e8" stroke-width="1" opacity="0.7">
      <line x1="90" y1="240" x2="422" y2="240"/>
      <line x1="90" y1="260" x2="422" y2="260"/>
      <line x1="90" y1="280" x2="422" y2="280"/>
      <line x1="90" y1="300" x2="422" y2="300"/>
      <line x1="90" y1="320" x2="422" y2="320"/>
      <line x1="90" y1="340" x2="422" y2="340"/>
      <line x1="90" y1="360" x2="422" y2="360"/>
      <line x1="90" y1="380" x2="422" y2="380"/>
      <line x1="90" y1="400" x2="422" y2="400"/>
    </g>
    
    <!-- Vertical board and batten siding -->
    <g>
      <!-- Shadow lines (darker) -->
      <g stroke="#d0d0d0" stroke-width="1.5" opacity="0.6">
        <line x1="130" y1="220" x2="130" y2="420"/>
        <line x1="170" y1="220" x2="170" y2="420"/>
        <line x1="210" y1="220" x2="210" y2="420"/>
        <line x1="250" y1="220" x2="250" y2="420"/>
        <line x1="290" y1="220" x2="290" y2="420"/>
        <line x1="330" y1="220" x2="330" y2="420"/>
        <line x1="370" y1="220" x2="370" y2="420"/>
      </g>
      <!-- Highlight lines for 3D depth -->
      <g stroke="#ffffff" stroke-width="1" opacity="0.8">
        <line x1="132" y1="220" x2="132" y2="420"/>
        <line x1="172" y1="220" x2="172" y2="420"/>
        <line x1="212" y1="220" x2="212" y2="420"/>
        <line x1="252" y1="220" x2="252" y2="420"/>
        <line x1="292" y1="220" x2="292" y2="420"/>
        <line x1="332" y1="220" x2="332" y2="420"/>
        <line x1="372" y1="220" x2="372" y2="420"/>
      </g>
    </g>
  </g>
  
  <!-- Realistic windows with depth and glass effect -->
  <defs>
    <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e6f3ff;stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:#cce7ff;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#b3daff;stop-opacity:0.9" />
    </linearGradient>
    <linearGradient id="windowFrameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#2c5aa0;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="doorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8b4513;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#a0522d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Left realistic window - adjusted for square format -->
  <g>
    <!-- Window canopy -->
    <g>
      <!-- Canopy shadow -->
      <path d="M 105 245 L 185 245 L 180 250 L 110 250 Z" fill="#333" opacity="0.3"/>
      <!-- Main canopy body -->
      <path d="M 105 243 L 185 243 L 180 248 L 110 248 Z" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <!-- Canopy support brackets -->
      <rect x="110" y="248" width="4" height="6" fill="#654321"/>
      <rect x="175" y="248" width="4" height="6" fill="#654321"/>
    </g>
    
    <!-- Window balcony -->
    <g>
      <!-- Balcony platform shadow -->
      <rect x="108" y="322" width="80" height="4" fill="#333" opacity="0.3"/>
      <!-- Balcony platform -->
      <rect x="110" y="320" width="76" height="3" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="0.5"/>
      <!-- Balcony railing -->
      <rect x="110" y="317" width="76" height="3" fill="none" stroke="#4B5563" stroke-width="1"/>
      <!-- Railing balusters -->
      <line x1="120" y1="317" x2="120" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="135" y1="317" x2="135" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="150" y1="317" x2="150" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="165" y1="317" x2="165" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="180" y1="317" x2="180" y2="320" stroke="#4B5563" stroke-width="1"/>
    </g>
    
    <!-- Window frame shadow for depth -->
    <rect x="108" y="253" width="80" height="64" fill="#333" opacity="0.2" rx="4"/>
    <!-- Window frame -->
    <rect x="110" y="255" width="76" height="60" fill="url(#windowFrameGradient)" stroke="#1E3A8A" stroke-width="1" rx="4"/>
    <!-- Glass with realistic reflection -->
    <rect x="113" y="258" width="70" height="54" fill="url(#glassGradient)" rx="2"/>
    <!-- Window mullions (cross pattern) -->
    <line x1="148" y1="258" x2="148" y2="312" stroke="#1E3A8A" stroke-width="1"/>
    <line x1="113" y1="285" x2="183" y2="285" stroke="#1E3A8A" stroke-width="1"/>
    <!-- Window reflection highlight -->
    <rect x="116" y="261" width="15" height="15" fill="white" opacity="0.5" rx="1"/>
  </g>
  
  <!-- Right realistic window - adjusted for square format -->
  <g>
    <!-- Window canopy -->
    <g>
      <!-- Canopy shadow -->
      <path d="M 325 245 L 405 245 L 400 250 L 330 250 Z" fill="#333" opacity="0.3"/>
      <!-- Main canopy body -->
      <path d="M 325 243 L 405 243 L 400 248 L 330 248 Z" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <!-- Canopy support brackets -->
      <rect x="330" y="248" width="4" height="6" fill="#654321"/>
      <rect x="395" y="248" width="4" height="6" fill="#654321"/>
    </g>
    
    <!-- Window balcony -->
    <g>
      <!-- Balcony platform shadow -->
      <rect x="328" y="322" width="80" height="4" fill="#333" opacity="0.3"/>
      <!-- Balcony platform -->
      <rect x="330" y="320" width="76" height="3" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="0.5"/>
      <!-- Balcony railing -->
      <rect x="330" y="317" width="76" height="3" fill="none" stroke="#4B5563" stroke-width="1"/>
      <!-- Railing balusters -->
      <line x1="340" y1="317" x2="340" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="355" y1="317" x2="355" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="370" y1="317" x2="370" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="385" y1="317" x2="385" y2="320" stroke="#4B5563" stroke-width="1"/>
      <line x1="400" y1="317" x2="400" y2="320" stroke="#4B5563" stroke-width="1"/>
    </g>
    
    <!-- Window frame shadow for depth -->
    <rect x="328" y="253" width="80" height="64" fill="#333" opacity="0.2" rx="4"/>
    <!-- Window frame -->
    <rect x="330" y="255" width="76" height="60" fill="url(#windowFrameGradient)" stroke="#1E3A8A" stroke-width="1" rx="4"/>
    <!-- Glass with realistic reflection -->
    <rect x="333" y="258" width="70" height="54" fill="url(#glassGradient)" rx="2"/>
    <!-- Window mullions (cross pattern) -->
    <line x1="368" y1="258" x2="368" y2="312" stroke="#1E3A8A" stroke-width="1"/>
    <line x1="333" y1="285" x2="403" y2="285" stroke="#1E3A8A" stroke-width="1"/>
    <!-- Window reflection highlight -->
    <rect x="336" y="261" width="15" height="15" fill="white" opacity="0.5" rx="1"/>
  </g>
  
  <!-- Realistic wooden front door - adjusted for square format -->
  <g>
    <!-- Door canopy -->
    <g>
      <!-- Canopy shadow -->
      <path d="M 205 330 L 307 330 L 302 335 L 210 335 Z" fill="#333" opacity="0.3"/>
      <!-- Main canopy body -->
      <path d="M 205 328 L 307 328 L 302 333 L 210 333 Z" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <!-- Canopy support brackets -->
      <rect x="210" y="333" width="6" height="8" fill="#654321"/>
      <rect x="296" y="333" width="6" height="8" fill="#654321"/>
      <!-- Decorative canopy trim -->
      <rect x="202" y="326" width="108" height="2" fill="#654321"/>
    </g>
    
    <!-- Door platform/step -->
    <g>
      <!-- Platform shadow -->
      <rect x="208" y="422" width="96" height="8" fill="#333" opacity="0.3"/>
      <!-- Main platform -->
      <rect x="210" y="420" width="92" height="6" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="1"/>
      <!-- Platform edge detail -->
      <rect x="210" y="418" width="92" height="2" fill="#D1D5DB"/>
    </g>
    
    <!-- Door shadow for depth -->
    <rect x="218" y="335" width="76" height="85" fill="#333" opacity="0.2" rx="3"/>
    <!-- Main door body -->
    <rect x="220" y="337" width="72" height="83" fill="url(#doorGradient)" stroke="#654321" stroke-width="1" rx="3"/>
    <!-- Door panels for realistic wood appearance -->
    <rect x="225" y="343" width="62" height="22" fill="#8b4513" stroke="#654321" stroke-width="0.5" rx="2"/>
    <rect x="225" y="370" width="62" height="22" fill="#8b4513" stroke="#654321" stroke-width="0.5" rx="2"/>
    <rect x="225" y="397" width="62" height="18" fill="#8b4513" stroke="#654321" stroke-width="0.5" rx="2"/>
    <!-- Realistic door handle -->
    <circle cx="275" cy="385" r="4" fill="#b8860b" stroke="#8b6914" stroke-width="0.5"/>
    <circle cx="275" cy="385" r="2" fill="#ffd700"/>
    <!-- Door frame trim -->
    <rect x="218" y="335" width="76" height="85" fill="none" stroke="#654321" stroke-width="2" rx="3"/>
  </g>
  
  <!-- Gray foundation -->
  <rect x="90" y="435" width="332" height="15" fill="#9CA3AF"/>
  
  <!-- Red and white stripes below foundation -->
  <rect x="226" y="455" width="60" height="5" fill="#DC2626"/>
  <rect x="226" y="460" width="60" height="5" fill="white"/>
  
  <!-- Triangular Roof with American Flag Design (rendered on top of walls) -->
  <!-- Main roof triangle with proper overhang to cover all wall tops -->
  <polygon points="60,220 256,100 452,220" fill="#EE3024" stroke="#2C2C54" stroke-width="2"/>
  
  <!-- Roof eave/overhang for architectural depth -->
  <g>
    <!-- Eave shadow -->
    <polygon points="60,220 452,220 447,228 65,228" fill="#333" opacity="0.4"/>
    <!-- Main eave structure -->
    <polygon points="60,220 452,220 447,225 65,225" fill="#8B4513" stroke="#654321" stroke-width="1"/>
    <!-- Eave support brackets -->
    <rect x="120" y="220" width="4" height="6" fill="#654321"/>
    <rect x="180" y="220" width="4" height="6" fill="#654321"/>
    <rect x="240" y="220" width="4" height="6" fill="#654321"/>
    <rect x="300" y="220" width="4" height="6" fill="#654321"/>
    <rect x="360" y="220" width="4" height="6" fill="#654321"/>
  </g>
  
  <!-- American Flag Section clipped to roof -->
  <g clip-path="url(#roofClip)">
    
    <!-- Blue canton background (left 40%) - adjusted for square roof -->
    <polygon points="60,220 217,142 217,220" fill="#3A3B95"/>
    <!-- Additional blue rectangle to ensure complete coverage -->
    <rect x="60" y="100" width="157" height="120" fill="#3A3B95"/>
    
    <!-- White stars on blue background - repositioned for square design -->
    <g fill="white">
      <!-- Row 1 -->
      <polygon points="80,150 81,155 87,155 83,158 84,164 80,161 76,164 77,158 73,155 79,155" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="110,150 111,155 117,155 113,158 114,164 110,161 106,164 107,158 103,155 109,155" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="140,150 141,155 147,155 143,158 144,164 140,161 136,164 137,158 133,155 139,155" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="170,150 171,155 177,155 173,158 174,164 170,161 166,164 167,158 163,155 169,155" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="200,150 201,155 207,155 203,158 204,164 200,161 196,164 197,158 193,155 199,155" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      
      <!-- Row 2 -->
      <polygon points="95,175 96,180 102,180 98,183 99,189 95,186 91,189 92,183 88,180 94,180" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="125,175 126,180 132,180 128,183 129,189 125,186 121,189 122,183 118,180 124,180" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="155,175 156,180 162,180 158,183 159,189 155,186 151,189 152,183 148,180 154,180" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="185,175 186,180 192,180 188,183 189,189 185,186 181,189 182,183 178,180 184,180" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      
      <!-- Row 3 -->
      <polygon points="80,200 81,205 87,205 83,208 84,214 80,211 76,214 77,208 73,205 79,205" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="110,200 111,205 117,205 113,208 114,214 110,211 106,214 107,208 103,205 109,205" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="140,200 141,205 147,205 143,208 144,214 140,211 136,214 137,208 133,205 139,205" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="170,200 171,205 177,205 173,208 174,214 170,211 166,214 167,208 163,205 169,205" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
      <polygon points="200,200 201,205 207,205 203,208 204,214 200,211 196,214 197,208 193,205 199,205" style="filter: drop-shadow(0 0 2px rgba(255,255,255,1));"/>
    </g>
    
    <!-- Authentic red and white stripes - adjusted for square roof -->
    <g transform="translate(217,100)">
      <rect x="0" y="0" width="235" height="9.23" fill="#EE3024"/>
      <rect x="0" y="9.23" width="235" height="9.23" fill="#FFFFFF"/>
      <rect x="0" y="18.46" width="235" height="9.23" fill="#EE3024"/>
      <rect x="0" y="27.69" width="235" height="9.23" fill="#FFFFFF"/>
      <rect x="0" y="36.92" width="235" height="9.23" fill="#EE3024"/>
      <rect x="0" y="46.15" width="235" height="9.23" fill="#FFFFFF"/>
      <rect x="0" y="55.38" width="235" height="9.23" fill="#EE3024"/>
      <rect x="0" y="64.61" width="235" height="9.23" fill="#FFFFFF"/>
      <rect x="0" y="73.84" width="235" height="9.23" fill="#EE3024"/>
      <rect x="0" y="83.07" width="235" height="9.23" fill="#FFFFFF"/>
      <rect x="0" y="92.30" width="235" height="9.23" fill="#EE3024"/>
      <rect x="0" y="101.53" width="235" height="9.23" fill="#FFFFFF"/>
      <rect x="0" y="110.76" width="235" height="9.23" fill="#EE3024"/>
    </g>
    
  </g>
  
  <!-- Red Chimney attached to roof - adjusted for square design -->
  <rect x="350" y="140" width="20" height="40" fill="#DC2626"/>
  <rect x="347" y="140" width="26" height="5" fill="#8B4513"/>
  
</svg>`;

    downloadFile('usa-home-app-icon.svg', svgContent);
    setDownloadCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            USA Home App Store Assets
          </h1>
          <p className="text-lg text-gray-600">
            Download official app icons and assets for mobile app submission
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-green-600" />
                Header Image (4096x2304px)
              </CardTitle>
              <CardDescription>
                Professional header for Google Play Console developer page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-bold">USA Home</span>
                </div>
                <Button onClick={downloadHeaderImage} className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Header Image SVG
                </Button>
                <div className="text-xs text-gray-500 space-y-1 text-center">
                  <p>• Convert to JPEG or 24-bit PNG (not transparent)</p>
                  <p>• Exact dimensions: 4096 x 2304 px</p>
                  <p>• Maximum file size: 1 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                App Icon (512x512px)
              </CardTitle>
              <CardDescription>
                Perfect for Google Play Store submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg width="80" height="80" viewBox="0 0 512 512" className="rounded-lg">
                    <rect width="512" height="512" fill="#f0f0f0" rx="90"/>
                    <polygon points="60,220 256,100 452,220" fill="#EE3024" stroke="#2C2C54" strokeWidth="2"/>
                    <polygon points="60,220 217,142 217,220" fill="#3A3B95"/>
                    <rect x="90" y="220" width="332" height="200" fill="#e5e7eb"/>
                  </svg>
                </div>
                <Button onClick={downloadSVGIcon} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download App Icon SVG
                </Button>
                <p className="text-sm text-gray-500">
                  Downloaded {downloadCount} times
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                Feature Graphic (1024x500px)
              </CardTitle>
              <CardDescription>
                Google Play Store feature graphic - exactly 1024 x 500 pixels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <span className="text-white text-2xl font-bold">USA HOME</span>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xs">
                    BUILD • DESIGN • FINANCE
                  </div>
                </div>
                <Button onClick={downloadFeatureGraphic} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Feature Graphic SVG
                </Button>
                <div className="text-xs text-gray-500 space-y-1 text-center">
                  <p>• Convert to PNG or JPEG format</p>
                  <p>• Exact dimensions: 1024 x 500 px</p>
                  <p>• Maximum file size: 15 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-red-600" />
                App Store Guidelines
              </CardTitle>
              <CardDescription>
                Requirements for app store submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Apple App Store:</strong>
                  <ul className="list-disc list-inside text-gray-600 mt-1">
                    <li>1024x1024px PNG format</li>
                    <li>No transparency or alpha channels</li>
                    <li>Square corners (iOS adds rounded corners)</li>
                  </ul>
                </div>
                <div>
                  <strong>Google Play Store:</strong>
                  <ul className="list-disc list-inside text-gray-600 mt-1">
                    <li>512x512px PNG format</li>
                    <li>32-bit PNG with alpha channel</li>
                    <li>Maximum file size: 1024KB</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Convert the SVG to required formats using design tools like Figma, Adobe Illustrator, or online converters.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/50 backdrop-blur">
          <CardHeader>
            <CardTitle>App Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>App Name:</strong> USA Home
              </div>
              <div>
                <strong>Package Name:</strong> com.usahome.app
              </div>
              <div>
                <strong>Version:</strong> 1.0.0
              </div>
              <div>
                <strong>Category:</strong> Business
              </div>
              <div className="md:col-span-2">
                <strong>Description:</strong> Your comprehensive platform for home building, design, and financing solutions.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}