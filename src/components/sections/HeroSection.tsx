// src/components/sections/HeroSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { LuxuryShape } from "../ui/LuxuryShape";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-96px)] w-full overflow-hidden flex items-center justify-center bg-white py-12 lg:py-0 lg:pt-10">
      
      {/* Subtle Background Texture/Text */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.03, scale: 1 }} 
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[24vw] lg:text-[18vw] font-black tracking-tighter select-none z-0 text-gray-900 pointer-events-none"
      >
        LUXURY
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center w-full max-w-[1600px] mx-auto px-6 md:px-12 gap-8 lg:gap-0 h-full">
        
        {/* Left Side: Haute Parfumerie Typography & CTA */}
        <div className="lg:col-span-5 flex flex-col items-start text-left space-y-5 lg:space-y-6 z-30 pt-8 lg:pt-0">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="uppercase tracking-[0.25em] text-[9px] lg:text-[10px] font-bold text-gray-400"
          >
            Haute Parfumerie
          </motion.span>
          
          <div className="flex flex-col leading-[1.0] lg:leading-[1.05]">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4rem] sm:text-6xl md:text-7xl lg:text-[7.5rem] font-display font-normal text-[#111] tracking-tight"
            >
              Ethereal
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4rem] sm:text-6xl md:text-7xl lg:text-[7.5rem] font-display font-normal text-[#777] tracking-tight italic"
            >
              Presence.
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-500 max-w-sm text-sm lg:text-base leading-relaxed"
          >
            An olfactory masterpiece distilled from the world's rarest botanicals. A signature scent that doesn't just linger—it commands the room and captures the memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 lg:pt-6"
          >
            <Link to="/collection" className="inline-block group pointer-events-auto">
              <button className="bg-[#111] text-white px-6 py-4 lg:px-9 lg:py-5 flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 group-hover:bg-[#222] lg:group-hover:pr-7">
                Discover the Essence 
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side: 3D Liquid + Marble + Bottle */}
        {/*  FIX: Adjusted Height for Mobile (h-[400px]) so it doesn't overflow */}
        <div className="lg:col-span-7 relative flex items-center justify-center w-full h-[400px] md:h-[500px] lg:h-[750px] mt-6 lg:mt-0">
          
          {/* Layer 1: 3D Liquid Sphere */}
          {/*  FIX: Reduced scale on mobile to prevent massive cutoff */}
          <div className="absolute inset-0 z-0 flex items-center justify-center scale-[1.1] md:scale-[1.25] lg:scale-[1.6] lg:translate-x-20">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              
              <LuxuryShape />
              
              <Environment resolution={256}>
                <group rotation={[-Math.PI / 4, -0.3, 0]}>
                  <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                  <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
                  <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
                </group>
              </Environment>
            </Canvas>
          </div>

          {/* Layer 2: Marble Plinth */}
          {/*  FIX: Added max-w-[280px] for mobile to keep elements perfectly centered and visible */}
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: "-10%", x: "-50%" }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            src="/travertine-plinth.png" 
            alt="Luxury Base" 
            className="absolute top-1/2 left-1/2 w-[75%] lg:w-[70%] max-w-[280px] lg:max-w-[500px] object-contain drop-shadow-xl z-10"
            style={{ x: "-50%", y: "15%" }} 
          />

          {/* Floating & Rotating Bottle */}
          <motion.div
            animate={{ y: ["-55%", "-62%", "-55%"], x: "-50%" }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-[75%] lg:w-[70%] max-w-[280px] lg:max-w-[550px] z-20"
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
        </div>

      </div>
    </section>
  );
};