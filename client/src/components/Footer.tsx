import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();
  
  return (
    <footer className="bg-neutral-dark text-white py-1 md:py-6 mt-0">
      <div className="container mx-auto px-2 md:px-4">
        {/* Newsletter Subscription Section - Moved to Top */}
        <div className="mb-3 md:mb-6 p-3 md:p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <h4 className="font-heading text-sm md:text-lg font-semibold mb-1 md:mb-2">📧 Subscribe to Our Newsletter</h4>
            <p className="text-xs md:text-sm text-gray-300 mb-2 md:mb-3">Get the latest updates on home building trends, design tips, and exclusive financing offers</p>
            <div className="flex max-w-md mx-auto">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className="px-2 py-1 md:px-3 md:py-2 text-sm rounded-l text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-primary w-full" 
              />
              <button 
                onClick={() => {
                  if (!email || !email.includes('@')) {
                    toast({
                      title: "Invalid Email",
                      description: "Please enter a valid email address",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  setIsSubscribing(true);
                  
                  // Simulate API call for now
                  setTimeout(() => {
                    setIsSubscribing(false);
                    setEmail("");
                    toast({
                      title: "Subscription Successful!",
                      description: "Thank you for subscribing to our newsletter!",
                      variant: "default"
                    });
                  }, 1000);
                }}
                disabled={isSubscribing}
                className="bg-primary px-3 md:px-5 py-1 md:py-2 rounded-r font-button text-xs md:text-sm whitespace-nowrap flex-shrink-0 text-center text-white hover:bg-primary-dark transition-colors disabled:opacity-70"
              >
                {isSubscribing ? "Processing..." : "Subscribe"}
              </button>
            </div>
          </div>
          {/* Copyright and Legal Links - Right below subscription */}
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-center space-y-1">
              <p className="text-white font-medium text-xs md:text-sm">&copy; {new Date().getFullYear()} USA Home. All Rights Reserved</p>
              <div className="flex flex-wrap justify-center gap-1 md:gap-3">
                <a href="https://doc-hosting.flycricket.io/usa-home-terms-of-use/37eb2646-5d94-48c0-86a1-512fd25accdd/terms" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-white hover:text-primary transition-colors bg-gray-800 px-2 py-1 rounded text-xs md:text-sm font-medium">
                  Terms & Conditions
                </a>
                <a href="https://doc-hosting.flycricket.io/usa-home-privacy-policy/32f81fdd-6d80-453a-9876-e34ed8d5d5e4/privacy" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-white hover:text-primary transition-colors bg-gray-800 px-2 py-1 rounded text-xs md:text-sm font-medium">
                  Privacy Policy
                </a>
                <a href="/data-deletion" 
                   className="text-white hover:text-primary transition-colors bg-gray-800 px-2 py-1 rounded text-xs md:text-sm font-medium">
                  Delete My Account
                </a>
                <Link href="/membership-agreement" 
                   className="text-white hover:text-primary transition-colors bg-gray-800 px-2 py-1 rounded text-xs md:text-sm font-medium">
                  Membership Agreement
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-6 mt-4">
          <div className="space-y-0 leading-tight">
            <h3 className="font-heading text-lg md:text-xl font-bold mb-0 md:mb-2 flex items-center gap-1 leading-none">
              <div className="text-xl md:text-2xl leading-none">
                🇺🇸
              </div>
              USA Home
            </h3>
            <p className="text-xs md:text-base text-white font-medium mt-0 leading-tight">Your comprehensive platform for home building, design, and financing solutions.</p>
          </div>
          <div>
            <h4 className="font-heading text-sm md:text-lg font-semibold mb-1 md:mb-3">Quick Links</h4>
            <ul className="space-y-0.5 md:space-y-2">
              <li><Link href="/" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">Home</Link></li>
              <li><Link href="/about-us" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">About Us</Link></li>
              <li><Link href="/support" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">Support</Link></li>
              <li><a href="mailto:info@usahome.center" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm md:text-lg font-semibold mb-1 md:mb-3">Services</h4>
            <ul className="space-y-0.5 md:space-y-2">
              <li><Link href="/build-home" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">Home Building</Link></li>
              <li><Link href="/design-home" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">Home Design</Link></li>
              <li><Link href="/finance" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">Financing</Link></li>
              <li><Link href="/finance/real-estate" className="text-white hover:text-white transition-colors font-medium text-sm md:text-base">Real Estate</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm md:text-lg font-semibold mb-1 md:mb-3">Connect With Us</h4>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:info@usahome.center" className="text-white hover:text-primary transition-colors text-sm md:text-base">
                info@usahome.center
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;