// src/pages/admin/AdminAddProduct.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UploadCloud, X, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    badge: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Yahan aap API call karenge: POST /api/admin/products
    // Example: await axios.post('/api/admin/products', formData);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Product created successfully", {
        style: { background: '#111', color: '#fff', borderRadius: '0px' }
      });
      navigate("/admin/products");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto space-y-8"
    >
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-display text-gray-900">Add New Scent</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new product for the catalog.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#111] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70"
        >
          {isLoading ? "Saving..." : <><Save className="w-4 h-4" /> Save Product</>}
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        
        {/* Left Column: Basic Info & Pricing */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Basic Information</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder="e.g. Noir Absolu"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows={5}
                placeholder="Describe the fragrance profile..."
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300 resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm grid grid-cols-2 gap-6">
            <div className="col-span-2"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Pricing & Inventory</h3></div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (USD)</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
                placeholder="0.00"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock Quantity</label>
              <input 
                type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0"
                placeholder="0"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Media & Organization */}
        <div className="space-y-8">
          
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Product Image</h3>
            
            <div className="border-2 border-dashed border-gray-200 bg-[#F9FAFB] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Organization</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</label>
              <select 
                name="category" value={formData.category} onChange={handleChange} required
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300 cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="men">Men's Fragrance</option>
                <option value="women">Women's Fragrance</option>
                <option value="unisex">Unisex</option>
                <option value="limited">Limited Edition</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Badge (Optional)</label>
              <input 
                type="text" name="badge" value={formData.badge} onChange={handleChange}
                placeholder="e.g. Bestseller, New Arrival"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Scent Notes (Comma separated)</label>
              <input 
                type="text" name="notes" value={formData.notes} onChange={handleChange}
                placeholder="Oud, Bergamot, Vanilla"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>
          </div>

        </div>
      </form>
    </motion.div>
  );
};