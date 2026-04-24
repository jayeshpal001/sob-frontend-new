// src/pages/About.tsx
import { motion } from "framer-motion";
import { StorySection } from "../components/sections/StorySection";

export const About = () => {
  return (
    <div className="w-full min-h-screen pt-32 pb-20 bg-white">
      {/* Hero Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            The House of SOB
          </span>
          <h1 className="text-5xl md:text-7xl font-display text-gray-900 mb-8 leading-tight">
            Redefining <br className="hidden md:block" /> Modern Perfumery.
          </h1>
        </motion.div>
      </div>

      {/* We can reuse our existing StorySection here! */}
      <StorySection />
      
      {/* Manifesto Section */}
      <div className="bg-[var(--color-surface)] py-32 mt-20">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-display leading-relaxed italic text-gray-800"
          >
            "We don't create perfumes to make you smell good. We create them to make you unforgettable. Every bottle is a statement, every note is an attitude."
          </motion.h3>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            — The Master Perfumer
          </p>
        </div>
      </div>
    </div>
  );
};