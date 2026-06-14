// src/components/sections/FeaturesSection.tsx
import { motion, type Variants } from "framer-motion";
import { Droplets, Sparkles, Fingerprint, Clock } from "lucide-react";

const features = [
  {
    icon: <Sparkles strokeWidth={1} className="w-8 h-8 mb-6 text-gray-900" />,
    title: "Premium Quality Ingredients",
    desc: "Made with carefully selected fragrance compounds and fine ingredients to ensure exceptional quality and consistency."
  },
  {
    icon: <Droplets strokeWidth={1} className="w-8 h-8 mb-6 text-gray-900" />,
    title: "Extrait de Parfum",
    desc: "Crafted with a high concentration of premium fragrance oils for an intense, rich, and luxurious scent experience."
  },
  {
    icon: <Clock strokeWidth={1} className="w-8 h-8 mb-6 text-gray-900" />,
    title: "8 to 12 Hours Performance",
    desc: "Designed to stay with you from morning to night, leaving a powerful and elegant trail wherever you go."
  },
  {
    icon: <Fingerprint strokeWidth={1} className="w-8 h-8 mb-6 text-gray-900" />,
    title: "Unique Scent Profiles",
    desc: "Every SOB creation features a unique blend of notes, carefully designed to offer a signature scent that stands out."
  }
];

// Staggered animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export const FeaturesSection = () => {
  return (
    <section className="w-full bg-[var(--color-surface)] py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="text-center mb-20">
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            The SOB Difference
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-gray-900">
            Why Choose SOB
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center md:items-start group">
              <div className="p-4 bg-white rounded-none border border-gray-100 group-hover:border-black transition-colors duration-500">
                {feature.icon}
              </div>
              <h3 className="text-lg font-sans font-bold text-black mt-6 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};