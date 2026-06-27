"use client";

import { motion } from "framer-motion";

export const InfiniteSlider = () => {
  const items = [
    "40% Oil Concentration",
    "Long Lasting Fragrance",
    "Premium Quality",
    "Made with Finest Oils",
  ];

  return (
    <div className="relative flex w-full overflow-hidden border-y border-[#d4af37]/20 bg-black py-2">
      {/* Fade Effect */}
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-black to-transparent" />

      <motion.div
        className="flex w-max gap-24 px-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 25,
        }}
      >
        {[...items, ...items, ...items].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-6 whitespace-nowrap"
          >
            <span className="text-[#d4af37] text-xl">✦</span>

            <span className="font-serif text-xl tracking-wide text-[#f5f0e8]">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};