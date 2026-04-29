// src/pages/admin/AdminAddProduct.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UploadCloud, Save, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateProductMutation, useGetCategoriesQuery } from "../../store/adminApi";

export const AdminAddProduct = () => {
  const navigate = useNavigate();
  
  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();
  const { data: categoriesData = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  
  // Safe extraction based on your backend response structure
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    badge: "",
    notes: "",
  });

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields (Name, Price, Category).");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock || "0");
      submitData.append("category", formData.category);
      
      if (formData.badge) submitData.append("badge", formData.badge);
      if (formData.notes) submitData.append("notes", formData.notes); 
      
      if (imageFile) {
        // Backend 'req.files' expect kar raha hai matlab multer setup hai
        submitData.append("images", imageFile); 
      }

      console.log("Submitting Product:", Object.fromEntries(submitData)); // Debug Log

      const response = await createProduct(submitData).unwrap();
      console.log("Success Response:", response);
      
      toast.success("Product created successfully", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
      navigate("/admin/products");

    } catch (error: any) {
      console.error("Create Product Error full:", error);
      
      // Detailed error breakdown
      if (error.status === 'FETCH_ERROR') {
         toast.error("Network Error: Backend is down or CORS issue.");
      } else if (error.status === 401 || error.status === 403) {
         toast.error("Authorization Error: Please login again.");
      } else {
         toast.error(error?.data?.message || error?.error || "Failed to create product.");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto space-y-8"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#111] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70 w-full sm:w-auto justify-center shadow-lg"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        
        {/* Left Column: Basic Info & Pricing */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Basic Information</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name *</label>
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (₹) *</label>
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
            
            {imagePreview ? (
              <div className="relative aspect-square w-full bg-[#F7F7F7] border border-gray-200 p-2 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <button 
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="absolute top-2 right-2 p-1 bg-white text-red-500 hover:bg-red-50 rounded shadow-sm border border-red-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 bg-[#F9FAFB] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all aspect-square">
                <UploadCloud className="w-8 h-8 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-900">Click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Organization</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category *</label>
              {isLoadingCategories ? (
                <div className="text-sm text-gray-400 py-3">Loading...</div>
              ) : (
                <select 
                  name="category" value={formData.category} onChange={handleChange} required
                  className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300 cursor-pointer"
                >
                  <option value="" disabled>Select Category</option>
                  {/* 🚀 Dynamic Categories Map */}
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              )}
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Scent Notes</label>
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