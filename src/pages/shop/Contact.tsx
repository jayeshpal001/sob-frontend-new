// src/pages/Contact.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useSubmitContactFormMutation } from "../../store/api/userApi"; 

export const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [submitContact, { isLoading }] = useSubmitContactFormMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className="w-full min-h-screen bg-white pt-32 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block"
          >
            Get in Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight mb-6"
          >
            We are here to assist you with your signature scent.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 font-sans leading-relaxed"
          >
            Whether you have a question about our collections, need assistance with an order, or seek personalized fragrance advice, our concierges are ready to help.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4 space-y-12"
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-200 pb-3">Contact Details</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-1">Our Boutique</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      123 Luxury Avenue, Suite 400<br />
                      Indore, Madhya Pradesh<br />
                      India 452001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-1">Telephone</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      +91 98765 43210<br />
                      <span className="text-[10px] text-gray-400">Mon-Fri, 10:00 AM - 7:00 PM IST</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-1">Email</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      info@sobglobal.in<br />
                      <span className="text-[10px] text-gray-400">We aim to reply within 24 hours.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f8f8] p-8 border border-gray-100">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Corporate Inquiries</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                For wholesale, press, or partnership opportunities, please direct your correspondence to our corporate team.
              </p>
              <Link to="mailto:info@sobglobal.in" className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">
                info@sobglobal.in
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-8"
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-serif text-gray-900 mb-8">Send a Message</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name *</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    placeholder="Your Name"
                    className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address *</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="your@email.com"
                    className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Subject *</label>
                <input 
                  type="text" name="subject" value={formData.subject} onChange={handleChange} required
                  placeholder="How can we help?"
                  className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-2 mb-10">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Your Message *</label>
                <textarea 
                  name="message" value={formData.message} onChange={handleChange} required rows={5}
                  placeholder="Write your detailed inquiry here..."
                  className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full md:w-auto px-12 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isLoading ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};