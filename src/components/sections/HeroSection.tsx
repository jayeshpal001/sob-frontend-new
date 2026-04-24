// src/components/sections/HeroSection.tsx
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-96px)] w-full overflow-hidden flex items-center justify-center bg-[var(--color-surface)] pt-10">
      
      {/* Subtle Background Texture/Text */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.03, scale: 1 }} 
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black tracking-tighter select-none z-0 text-gray-500 pointer-events-none"
      >
        LUXURY
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center w-full max-w-[1600px] mx-auto px-6 md:px-12 gap-12 lg:gap-0 h-full">
        
        {/* Left Side: Typography & CTA (6 columns) */}
        <div className="lg:col-span-6 flex flex-col space-y-8 z-30 pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500"
          >
            Premium Fragrance House
          </motion.div>

          <div className="flex flex-col leading-[1.1]">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-6xl md:text-7xl lg:text-[7.5rem] font-display font-normal text-gray-900 tracking-tight"
            >
              Unleash the
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="text-6xl md:text-7xl lg:text-[7.5rem] font-display font-normal text-gray-900 tracking-tight italic"
            >
              Essence of
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
              className="text-6xl md:text-7xl lg:text-[7.5rem] font-sans font-black text-black tracking-tighter"
            >
              Luxury.
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-gray-600 max-w-md text-base leading-relaxed"
          >
            Crafted for those who refuse to blend in. Each scent tells a story of confidence, identity, and unapologetic elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button variant="primary">Shop Now</Button>
            <Button variant="outline">Our Story</Button>
          </motion.div>
        </div>

        {/* Right Side: Advanced 3D Product Presentation */}
        <div className="lg:col-span-6 relative flex items-center justify-center w-full h-[500px] lg:h-[700px] mt-10 lg:mt-0" style={{ perspective: "1000px" }}>
          
          {/* Base Plinth */}
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: "-10%", x: "-50%" }}
            transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
            src="/travertine-plinth.png" 
            alt="Luxury Base" 
            className="absolute top-1/2 left-1/2 w-[70%] max-w-[450px] object-contain drop-shadow-xl z-10"
            style={{ x: "-50%", y: "15%" }} 
          />

          {/* Floating & Rotating Bottle */}
          <motion.div
            animate={{ y: ["-55%", "-62%", "-55%"], x: "-50%" }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-[70%]  z-20"
            style={{ x: "-50%", y: "-55%" }} 
          >
            <motion.img 
              whileHover={{ rotateY: 360, scale: 1.05 }} 
              transition={{ duration: 1.2, ease: "easeInOut" }}
              src="/sob-perfume-bottle.png" 
              alt="SOB Signature Scent" 
              className="w-full h-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)] cursor-pointer"
              loading="eager" 
              style={{ transformStyle: "preserve-3d" }}
            />
          </motion.div>

           {/* Dynamic Ground Shadow */}
           <motion.div 
            animate={{ scale: [1, 0.85, 1], opacity: [0.3, 0.15, 0.3], x: "-50%" }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-[80%] left-1/2 w-48 h-6 bg-black rounded-[50%] blur-xl z-[5]"
            style={{ x: "-50%" }}
          />
        </div>

      </div>
    </section>
  );
};