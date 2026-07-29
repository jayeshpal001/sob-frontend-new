// src/components/sections/StorySection.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const storyImages = [

  "/story-4.png", 
  "/story-5.png",
  "/story-6.png",
];

export const StorySection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % storyImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-white py-24 md:py-32 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Side: Auto-Sliding Editorial Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-[3/4] bg-[#F9FAFB] overflow-hidden"
        >
          {/* Animated Image Slider */}
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImageIndex} // Triggers animation on change
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              src={storyImages[currentImageIndex]} 
              alt="Crafted with Obsession" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Decorative Frame Overlay */}
          <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none z-10" />
        </motion.div>

        {/* Right Side: Copy & Stats */}
        <div className="flex flex-col space-y-8 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-5 block">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-gray-900 leading-tight">
              Born from Desire, <br />
              <span className="italic text-gray-400">Crafted with Obsession.</span>
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-600 text-sm md:text-base leading-relaxed"
          >
            SOB was founded on a singular belief: fragrance is the most intimate form of self-expression. Every bottle carries a narrative of confidence, identity, and the courage to stand apart. 
            <br /><br />
            We source the rarest ingredients from across the globe — from the ancient oud forests of Southeast Asia to the jasmine fields of Grasse. Our master perfumers spend years perfecting each composition.
          </motion.p>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 pt-8 mt-4 border-t border-gray-100"
          >
            <div>
              <h4 className="text-2xl md:text-3xl font-display text-black">50+</h4>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Countries</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-display text-black">15+</h4>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Perfumers</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-display text-black">100%</h4>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Pure Ingred.</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};