// src/pages/admin/AdminAddProduct.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UploadCloud, Save, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateProductMutation, useGetCategoriesQuery } from "../../store/api/adminApi";

export const AdminAddProduct = () => {
  const navigate = useNavigate();
  
  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();
  const { data: categoriesData = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  
  // Safe extraction based on backend response structure
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    tagline: "", 
    description: "",
    price: "",
    stock: "",
    category: "",
    badge: "",
    size: "100ML", 
    scentNotes: "", 
    ingredients: "Alcohol Denat., Fragrance (Parfum), Water (Aqua), Linalool, Limonene.", 
    shippingAndReturns: "Free standard shipping on all orders. Returns accepted within 14 days of delivery.", 
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      setImageFiles((prev) => [...prev, ...filesArray]);
      
      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewsArray]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields (Name, Price, Category).");
      return;
    }

    try {
      const submitData = new FormData();
      
      // Core Details
      submitData.append("name", formData.name);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock || "0");
      submitData.append("category", formData.category);
      
      // Premium Details
      if (formData.tagline) submitData.append("tagline", formData.tagline);
      if (formData.description) submitData.append("description", formData.description);
      if (formData.badge) submitData.append("badge", formData.badge);
      if (formData.size) submitData.append("size", formData.size);
      if (formData.scentNotes) submitData.append("scentNotes", formData.scentNotes); // Expects comma separated string
      if (formData.ingredients) submitData.append("ingredients", formData.ingredients);
      if (formData.shippingAndReturns) submitData.append("shippingAndReturns", formData.shippingAndReturns);
      
      // Append Images
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          submitData.append("images", file); 
        });
      }

      await createProduct(submitData).unwrap();
      
      toast.success("Product created successfully", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
      navigate("/admin/products");

    } catch (error: any) {
      console.error("Create Product Error:", error);
      toast.error(error?.data?.message || "Failed to create product.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto space-y-8 pb-20"
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
        
        {/* Left Column: Extensive Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Core Identity</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name *</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder="e.g. Noir Absolu"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tagline</label>
              <input 
                type="text" name="tagline" value={formData.tagline} onChange={handleChange}
                placeholder="e.g. A seductive, passionate composition..."
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows={5}
                placeholder="Deep dive into the fragrance profile..."
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300 resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Premium Details</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Scent Notes (Comma Separated)</label>
              <input 
                type="text" name="scentNotes" value={formData.scentNotes} onChange={handleChange}
                placeholder="Oud, Bergamot, Vanilla, Patchouli"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Ingredients</label>
              <textarea 
                name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3}
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Shipping & Returns Policy</label>
              <textarea 
                name="shippingAndReturns" value={formData.shippingAndReturns} onChange={handleChange} rows={3}
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300 resize-none"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Media & Organization */}
        <div className="space-y-8">
          
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

          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Product Images</h3>
            
            <label className="border-2 border-dashed border-gray-200 bg-[#F9FAFB] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all aspect-video">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900">Click to upload images</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square w-full bg-[#F7F7F7] border border-gray-200 p-1 group">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-contain" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white text-red-500 hover:bg-red-50 rounded shadow-sm border border-red-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
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
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Bottle Size</label>
              <input 
                type="text" name="size" value={formData.size} onChange={handleChange}
                placeholder="e.g. 100ML or 50ML"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Badge (Optional)</label>
              <input 
                type="text" name="badge" value={formData.badge} onChange={handleChange}
                placeholder="e.g. Bestseller, New Arrival"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>
          </div>

        </div>
      </form>
    </motion.div>
  );
};