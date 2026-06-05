// src/pages/admin/AdminAddProduct.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UploadCloud, Save, Loader2, X, Plus, Trash2 } from "lucide-react";
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
    basePrice: "", // Added Base Price
    stock: "",
    category: "",
    badge: "",
    size: "100ML", // Default fallback
    scentNotes: "", 
    ingredients: "Alcohol Denat., Fragrance (Parfum), Water (Aqua), Linalool, Limonene.", 
    shippingAndReturns: "Free standard shipping on all orders. Returns accepted within 14 days of delivery.", 
  });

  // Dynamic Variants State
  const [variants, setVariants] = useState<{ size: string; price: string; basePrice: string; stock: string }[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Variant Handlers
  const handleAddVariant = () => {
    setVariants([...variants, { size: "", price: "", basePrice: "", stock: "" }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
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
      toast.error("Please fill in all required fields (Name, Selling Price, Category).");
      return;
    }

    try {
      const submitData = new FormData();
      
      // Core Details
      submitData.append("name", formData.name);
      submitData.append("price", formData.price);
      if (formData.basePrice) submitData.append("basePrice", formData.basePrice);
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
      
      // Append Variants as JSON String
      if (variants.length > 0) {
        // Filter out empty variants before sending
        const validVariants = variants.filter(v => v.size && v.price);
        if (validVariants.length > 0) {
          submitData.append("variants", JSON.stringify(validVariants));
        }
      }

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
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Size Variants & Dynamic Pricing</h3>
              <button 
                type="button" 
                onClick={handleAddVariant}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#111] hover:text-gray-600 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            
            {variants.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No variants added. The default Price and Stock (on the right) will be used.</p>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end bg-[#F9FAFB] p-4 border border-gray-100 relative group">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Size</label>
                      <input 
                        type="text" placeholder="e.g. 50ML" value={variant.size}
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 focus:border-black outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Selling Price</label>
                      <input 
                        type="number" placeholder="0" value={variant.price}
                        onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 focus:border-black outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Base Price (MRP)</label>
                      <input 
                        type="number" placeholder="0" value={variant.basePrice}
                        onChange={(e) => handleVariantChange(index, "basePrice", e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 focus:border-black outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Stock</label>
                      <input 
                        type="number" placeholder="0" value={variant.stock}
                        onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 focus:border-black outline-none text-sm"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="p-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors h-[38px] flex items-center justify-center w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <div className="col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">Default Pricing & Inventory</h3>
              <p className="text-xs text-gray-500 mt-2">Used if no variants are provided above.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Selling Price (₹) *</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
                placeholder="0"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Base Price / MRP (₹)</label>
              <input 
                type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} min="0"
                placeholder="0"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock Quantity</label>
              <input 
                type="number" name="stock" value={formData.stock} onChange={handleChange} min="0"
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Default Bottle Size</label>
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