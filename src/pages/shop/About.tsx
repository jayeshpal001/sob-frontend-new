// src/pages/About.tsx
import { motion } from "framer-motion";
import { StorySection } from "../../components/sections/StorySection";

export const About = () => {
  return (
    <div className="w-full min-h-screen pt-32 pb-20 bg-white">
      {/* Hero Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            The House of SOB
          </span>
          <h1 className="text-5xl md:text-7xl font-display text-gray-900 mb-8 leading-tight">
            About SOB Perfumes
          </h1>
        </motion.div>
      </div>

      {/* Main About Text Section */}
      <div className="max-w-[800px] mx-auto px-6 md:px-12 text-gray-600 text-sm md:text-base leading-relaxed font-sans text-justify md:text-center mb-24 space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <strong className="text-black font-semibold">SOB Perfumes</strong> is a fragrance house dedicated to bringing the finest inspiration from French luxury perfumery and world-class scent craftsmanship to perfume lovers. Our passion lies in creating premium-quality fragrances that combine elegance, performance, and affordability.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We carefully select high-grade ingredients and blend them with modern fragrance expertise to develop scents that are sophisticated, long-lasting, and memorable. Inspired by iconic French and luxury fragrances, our collections are designed for individuals who appreciate refined aromas and exceptional quality.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          At SOB Perfumes, our mission is simple: to make luxury fragrances accessible to everyone without compromising on quality. Every bottle is crafted with attention to detail, ensuring a rich olfactory experience that leaves a lasting impression.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          From fresh and modern everyday scents to bold and exclusive signature fragrances, we continuously innovate to create perfumes that suit every personality and occasion. With a growing collection of unique creations, SOB Perfumes is committed to delivering premium fragrances that embody style, confidence, and timeless luxury.
        </motion.p>
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
            "Inspired by Luxury, Crafted for Excellence."
          </motion.h3>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            — SOB Perfumes
          </p>
        </div>
      </div>
    </div>
  );
};