// src/components/sections/BuildYourBoxBanner.tsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const BuildYourBoxBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center">
        
        <Link 
          to="/build-your-own-box" 
          className="block relative group overflow-hidden cursor-pointer bg-[#F8F6F0] rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 w-full"
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
        
        {/* 🚀 ADDED: Beautiful & Clear Call-To-Action Button Below the Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 md:mt-10"
        >
          <button
            onClick={() => navigate("/build-your-own-box")}
            className="group flex items-center justify-center gap-3 px-10 py-4 md:px-12 md:py-5 bg-black text-white text-xs md:text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all duration-300"
          >
            Build Your Box Now
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};