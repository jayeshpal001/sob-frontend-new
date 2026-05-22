// src/components/common/PageLoader.tsx
import { motion } from "framer-motion";

export const PageLoader = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5] 
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="w-12 h-12 border border-gray-300 flex items-center justify-center bg-white shadow-sm"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase">SOB</span>
      </motion.div>
    </div>
  );
};