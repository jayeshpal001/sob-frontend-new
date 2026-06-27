// src/components/sections/BuildYourBoxBanner.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const BuildYourBoxBanner = () => {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <Link 
          to="/build-your-own-box" 
          className="block relative group overflow-hidden cursor-pointer bg-[#F8F6F0] rounded-sm shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full relative"
          >
          
            <img
              src="/build-your-own-box.png" 
              alt="Build Your Own Signature Box"
              className="w-full h-auto object-contain transform group-hover:scale-[1.01] transition-transform duration-700 ease-[0.16,1,0.3,1]"
            />
            
            {/* Gentle dark overlay on hover to indicate it's clickable */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
          </motion.div>
        </Link>
        
      </div>
    </section>
  );
};