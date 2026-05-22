// src/components/sections/ContactSection.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { useSubmitContactFormMutation } from "../../store/api/userApi";

export const ContactSection = () => {
  const [submitContact, { isLoading }] = useSubmitContactFormMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await submitContact(formData).unwrap();
      toast.success(response.message || "Message sent successfully!", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
      // Clear form on success
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message. Please try again.");
    }
  };

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
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name" 
                required
                className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
              />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email" 
                required
                className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            
            <select 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 py-3 bg-transparent text-sm text-gray-500 focus:outline-none focus:border-black transition-colors cursor-pointer appearance-none rounded-none"
            >
              <option value="" disabled>Interested In...</option>
              <option value="Fragrance Consultation">Fragrance Consultation</option>
              <option value="Order Inquiry">Order Inquiry</option>
              <option value="Press & Media">Press & Media</option>
              <option value="Other">Other</option>
            </select>
            
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message" 
              rows={4}
              required
              className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors resize-none"
            ></textarea>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full md:w-auto self-end flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </motion.div>

      </div>
    </section>
  );
};