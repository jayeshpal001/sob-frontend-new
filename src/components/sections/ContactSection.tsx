// src/components/sections/ContactSection.tsx
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export const ContactSection = () => {
  return (
    <section className="w-full bg-[var(--color-surface)] py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-gray-900 mb-6">
            Let's Find Your <br />
            Signature Scent
          </h2>
          <p className="text-gray-600 max-w-md text-base leading-relaxed mb-10">
            Our fragrance consultants are available to guide you to the perfect scent. Reach out via the form, and we will respond within 24 hours.
          </p>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-10 shadow-sm border border-gray-100"
        >
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <select className="w-full border-b border-gray-300 py-3 bg-transparent text-sm text-gray-500 focus:outline-none focus:border-black transition-colors cursor-pointer appearance-none rounded-none">
              <option value="" disabled selected>Interested In...</option>
              <option value="consultation">Fragrance Consultation</option>
              <option value="order">Order Inquiry</option>
              <option value="press">Press & Media</option>
            </select>
            <textarea 
              placeholder="Your Message" 
              rows={4}
              className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors resize-none"
            ></textarea>
            
            <Button type="submit" className="mt-4 w-full md:w-auto self-end">
              Send Message
            </Button>
          </form>
        </motion.div>

      </div>
    </section>
  );
};