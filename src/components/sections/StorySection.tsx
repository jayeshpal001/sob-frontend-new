// src/components/sections/StorySection.tsx
import { motion } from "framer-motion";

export const StorySection = () => {
  return (
    <section className="w-full bg-white py-32 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Editorial Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-square md:aspect-[4/3] bg-[var(--color-surface)] overflow-hidden flex items-center justify-center p-8"
        >
          {/* Parallax Image Effect */}
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/sob-perfume-bottle.png" // Reusing our generated asset for now
            alt="Crafted with Obsession" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full border-[10px] border-white/20 pointer-events-none z-10" />
        </motion.div>

        {/* Right Side: Copy & Stats */}
        <div className="flex flex-col space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-gray-900 leading-tight">
              Born from Desire, <br />
              <span className="italic text-gray-400">Crafted with Obsession.</span>
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-600 text-base leading-relaxed"
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
            className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100"
          >
            <div>
              <h4 className="text-3xl font-display text-black">50+</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Countries</p>
            </div>
            <div>
              <h4 className="text-3xl font-display text-black">12</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Master Perfumers</p>
            </div>
            <div>
              <h4 className="text-3xl font-display text-black">100%</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Premium Ingredients</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};