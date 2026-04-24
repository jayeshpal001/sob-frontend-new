// src/components/common/Footer.tsx
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-24 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link to="/" className="mb-6">
              <img 
                src="/sob-logo.jpg" 
                alt="SOB" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">
              Premium fragrances crafted for the modern connoisseur. Dare to be unforgettable.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-sans font-bold text-black text-xs uppercase tracking-[0.2em] mb-2">Quick Links</h4>
            <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">Home</Link>
            <Link to="/collection" className="text-sm text-gray-500 hover:text-black transition-colors">Collection</Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-black transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-sans font-bold text-black text-xs uppercase tracking-[0.2em] mb-2">Legal</h4>
            <Link to="#" className="text-sm text-gray-500 hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-black transition-colors">Terms of Service</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-black transition-colors">Shipping Policy</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-black transition-colors">Returns</Link>
          </div>

          {/* Socials */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-sans font-bold text-black text-xs uppercase tracking-[0.2em] mb-2">Follow Us</h4>
            <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Instagram</a>
            <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Twitter / X</a>
            <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Facebook</a>
            <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">TikTok</a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-sans tracking-wide">
            © {currentYear} SOB Fragrances. All rights reserved.
          </p>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
            Luxury Fragrance House
          </p>
        </div>

      </div>
    </footer>
  );
};