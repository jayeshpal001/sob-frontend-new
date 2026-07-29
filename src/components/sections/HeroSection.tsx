// src/components/sections/HeroSection.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

// Array of bottle images to slide through
const bottleImages = [
  // "/sob-perfume-bottle.png",
  // "/sob-perfume-bottle-2.png", 
  // "/sob-perfume-bottle-3.png",
  "/sob-bottle-1.png",
  "/sob-bottle-2.png",
  "/sob-bottle-3.png",
  "/sob-bottle-4.png",
];

export const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play the slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bottleImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-96px)] w-full overflow-hidden flex flex-col lg:flex-row items-center justify-center bg-white py-12 lg:py-0 ">
      
      {/* Subtle Background Texture/Text */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.03, scale: 1 }} 
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[24vw] lg:text-[18vw] font-black tracking-tighter select-none z-0 text-gray-900 pointer-events-none"
      >
        LUXURY
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center w-full max-w-[1600px] mx-auto px-6 md:px-12 gap-0 lg:gap-8 h-full flex-grow">
        
        {/* Left Side: Typography & CTA */}
        <div className="lg:col-span-5 flex flex-col items-start text-left space-y-4 lg:space-y-5 z-30 pt-8 lg:pt-0">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500"
          >
            Premium Fragrance House
          </motion.div>

          <div className="flex flex-col leading-[1.05] lg:leading-[1.05]">
            <div className="overflow-hidden pb-1">
              <motion.h1 
                initial={{ y: "100%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[3rem] sm:text-[4rem] md:text-[4.5rem] lg:text-[5.5rem] font-display font-normal text-gray-900 tracking-tight"
              >
                Unleash the
              </motion.h1>
            </div>
            
            <div className="overflow-hidden pb-1">
              <motion.h1 
                initial={{ y: "100%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
       
                className="text-[3rem] sm:text-[4rem] md:text-[4.5rem] lg:text-[5.5rem] font-display font-normal text-gray-900 tracking-tight italic"
              >
                Essence of
              </motion.h1>
            </div>

            <div className="overflow-hidden pb-2">
              <motion.h1 
                initial={{ y: "100%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
  
                className="text-[3rem] sm:text-[4rem] md:text-[4.5rem] lg:text-[5.5rem] font-sans font-black text-black tracking-tighter"
              >
                Luxury.
              </motion.h1>
            </div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-600 max-w-sm text-sm lg:text-base leading-relaxed"
          >
            Crafted for those who refuse to blend in. Each scent tells a story of confidence, identity, and unapologetic elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 pt-4 relative z-50 pointer-events-auto"
          >
            <Link to="/collection" className="block">
              <Button variant="primary">Shop Now</Button>
            </Link>
            <Link to="/about" className="block">
              <Button variant="outline">Our Story</Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Marble Plinth + Animated Image Slider */}
        <div className="lg:col-span-7 relative flex items-center justify-center w-full h-[320px] md:h-[500px] lg:h-[750px] mt-0 lg:mt-0">
          
          {/* Layer 1: Marble Plinth (Static Background Base) */}
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: "-10%", x: "-50%" }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            src="/travertine-plinth.png" 
            alt="Luxury Base" 
            className="lg:mt-6 mt-3 absolute top-1/2 left-1/2 w-[90%] lg:w-[70%] max-w-[340px] lg:max-w-[500px] object-contain drop-shadow-xl z-10 pointer-events-none"
            style={{ x: "-50%", y: "10%" }} 
          />

          {/* Layer 2: Floating & Fading Image Slider */}
          <motion.div
            animate={{ y: ["-50%", "-55%", "-50%"] }} // Gentle floating effect
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-[85%] lg:w-[70%] max-w-[300px] lg:max-w-[480px] z-20 pointer-events-none flex items-center justify-center"
            style={{ x: "-50%", y: "-50%" }} 
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                src={bottleImages[currentImageIndex]} 
                alt="SOB Signature Scent" 
                className="w-full h-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.3)] pointer-events-auto cursor-pointer"
                loading="eager" 
              />
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </section>
  );
};