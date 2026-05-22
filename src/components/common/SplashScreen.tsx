// src/components/common/SplashScreen.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Page load hote hi scroll disable kar do
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      // 🚀 THE FIX: Splash screen gayab hone ke baad scroll WAPAS chalu kar do!
      document.body.style.overflow = "auto";
    }, 2500);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} 
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Brand Name Reveal */}
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="text-white text-6xl md:text-8xl font-display tracking-widest uppercase"
            >
              SOB
            </motion.h1>
          </div>
          
          <div className="overflow-hidden mt-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-gray-400 font-sans text-xs uppercase tracking-[0.4em]"
            >
              Luxury Fragrance House
            </motion.p>
          </div>

          {/* Minimal Loading Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute bottom-10 w-48 h-[1px] bg-white/30 origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};