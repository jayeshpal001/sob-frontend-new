// src/components/ui/FloatingContact.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const FloatingContact = () => {
  const [isHovered, setIsHovered] = useState(false);

  // UPDATE YOUR WHATSAPP NUMBER HERE (Country code without '+')
  const phoneNumber = "919876543210"; 
  const defaultMessage = "Hello SOB Perfumes, I want to know more about your luxury fragrances!";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex items-center gap-4">
      
      {/*  Tooltip that shows on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block bg-white text-black px-4 py-2 rounded-full shadow-lg border border-gray-100 text-xs font-bold uppercase tracking-widest whitespace-nowrap"
          >
            Chat with us
          </motion.div>
        )}
      </AnimatePresence>

      {/*  The Floating Button */}
      <motion.button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300"
      >
        {/* Continuous Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 duration-1000" />
        
        {/* Authentic WhatsApp SVG Icon */}
        <svg 
          className="w-7 h-7 relative z-10" 
          fill="currentColor" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path d="M12.031 0C5.394 0 0 5.394 0 12.033c0 2.115.549 4.181 1.593 6.002L.03 24l6.126-1.593A11.967 11.967 0 0012.033 24c6.636 0 12.031-5.394 12.031-12.033C24.064 5.394 18.67 0 12.031 0zm0 22.016c-1.782 0-3.527-.478-5.06-1.385l-.363-.214-3.766.978.997-3.673-.235-.373a9.988 9.988 0 01-1.523-5.316C2.081 5.485 7.487.076 12.033.076c4.545 0 9.953 5.409 9.953 11.957 0 6.549-5.408 11.957-9.955 11.957zm5.457-8.15c-.299-.15-1.767-.872-2.04-.972-.271-.101-.47-.15-.668.15-.198.3-.769.972-.942 1.171-.173.199-.347.225-.646.075-.299-.15-1.262-.465-2.404-1.485-.888-.794-1.488-1.774-1.661-2.073-.173-.3-.018-.462.132-.611.134-.133.299-.35.449-.525.15-.175.2-.3.299-.5.1-.2.05-.375-.025-.525-.075-.15-.668-1.611-.916-2.206-.241-.58-.485-.502-.668-.512-.172-.01-.371-.01-.571-.01-.198 0-.521.075-.794.375-.271.3-1.045 1.022-1.045 2.492s1.07 2.89 1.219 3.09c.15.2 2.106 3.216 5.105 4.51.714.309 1.27.493 1.705.632.716.227 1.368.195 1.883.118.578-.086 1.767-.722 2.016-1.422.249-.7.249-1.298.173-1.422-.074-.124-.272-.199-.571-.349z" />
        </svg>
      </motion.button>
      
    </div>
  );
};