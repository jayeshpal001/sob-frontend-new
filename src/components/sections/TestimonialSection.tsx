// src/components/sections/TestimonialSection.tsx
import { motion,type Variants } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Noir Absolu is unlike anything I've worn. People stop me on the street to ask what I'm wearing. It's magnetic.",
    author: "Isabella Fontaine",
    location: "Paris, France"
  },
  {
    quote: "The longevity is extraordinary. I apply in the morning and still get compliments at dinner. SOB has ruined every other brand for me.",
    author: "James Whitfield",
    location: "London, UK"
  },
  {
    quote: "Blanc Éthéréal captures femininity without being predictable. The packaging alone makes it feel like opening a treasure.",
    author: "Aisha Al-Rashid",
    location: "Dubai, UAE"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export const TestimonialSection = () => {
  return (
    <section className="w-full bg-white py-32 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="text-center mb-20">
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-gray-900">
            What Our Clients Say
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              className="bg-[var(--color-surface)] p-10 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
                <p className="text-gray-600 font-display text-lg italic leading-relaxed mb-8">
                  "{item.quote}"
                </p>
              </div>
              <div>
                <h4 className="font-sans font-bold text-black text-sm uppercase tracking-wider">{item.author}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};