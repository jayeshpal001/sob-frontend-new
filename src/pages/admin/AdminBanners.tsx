// src/pages/admin/AdminBanners.tsx
import { useState } from "react";
import { motion,type Variants, AnimatePresence } from "framer-motion";
import { Plus, Link as LinkIcon, Trash2, Edit2, Check, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";

// Mock Data: Replace with data from GET /api/admin/banners
const initialBanners = [
  { id: "BAN-1", title: "Summer Collection 2026", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop", link: "/collection?category=summer", isActive: true },
  { id: "BAN-2", title: "Noir Absolu Launch", image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop", link: "/product/PRD-001", isActive: true },
  { id: "BAN-3", title: "Holiday Sale 30% OFF", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2000&auto=format&fit=crop", link: "/collection", isActive: false },
];

export const AdminBanners = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", link: "", isActive: true });

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !currentStatus } : b));
    toast.success(`Banner ${!currentStatus ? 'activated' : 'deactivated'}`, {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
    });
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
    toast.error("Banner removed permanently.", {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("New banner published!", {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
    });
    setIsModalOpen(false);
    setFormData({ title: "", link: "", isActive: true });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Banner Management</h2>
          <p className="text-sm text-gray-500 mt-1">Control your homepage hero sliders and promotions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#111] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add New Banner
        </button>
      </motion.div>

      {/* Banners Grid */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white border border-gray-200 shadow-sm overflow-hidden group">
            
            {/* Banner Image Preview */}
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-gray-100">
              <img 
                src={banner.image} 
                alt={banner.title} 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!banner.isActive && 'grayscale opacity-60'}`}
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border shadow-sm ${
                  banner.isActive ? 'bg-white text-black border-transparent' : 'bg-black text-white border-transparent'
                }`}>
                  {banner.isActive ? 'Live' : 'Hidden'}
                </span>
              </div>
            </div>

            {/* Banner Details & Actions */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{banner.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{banner.link}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => toggleStatus(banner.id, banner.isActive)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                    banner.isActive ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {banner.isActive ? <><X className="w-3.5 h-3.5" /> Disable</> : <><Check className="w-3.5 h-3.5" /> Enable</>}
                </button>
                <button className="p-2 border border-gray-200 text-gray-400 hover:text-[#111] hover:bg-gray-50 transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-2 border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </motion.div>

      {/* Add Banner Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white shadow-2xl z-[90] border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900">Upload New Banner</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Image Dropzone */}
                <div className="border-2 border-dashed border-gray-200 bg-[#F9FAFB] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all aspect-[21/9]">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-4" />
                  <p className="text-sm font-medium text-gray-900">Upload Banner Image</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1920x800px</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Banner Title</label>
                    <input 
                      type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Winter Collection Launch"
                      className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Redirect Link</label>
                    <input 
                      type="text" required value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})}
                      placeholder="e.g. /collection?tag=winter"
                      className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#111] text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors">
                  Publish Banner
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
};