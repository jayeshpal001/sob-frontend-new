// src/pages/admin/AdminProductForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetProductByIdQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation 
} from "../../store/adminApi"; 

export const AdminEditProduct = () => {
  const { id } = useParams(); 
  const isEditMode = Boolean(id); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "69e75a2814508dc5e43b4023", 
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  const { data: responseData, isLoading: isFetching } = useGetProductByIdQuery(id as string, {
    skip: !isEditMode, 
  });
  
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (isEditMode && responseData) {
      const product = responseData.data || responseData; 
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        stock: product.stock?.toString() || "",
        category: product.category?._id || product.category || "",
      });
      setImages(product.images || []);
    }
  }, [responseData, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImage = () => {
    if (imageInput.trim() !== "") {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: images,
    };

    try {
      if (isEditMode) {
        await updateProduct({ id: id as string, data: payload }).unwrap(); 
        toast.success("Product updated successfully!", {
          style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
        });
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully!", {
          style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
        });
      }
      navigate("/admin/products"); 
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save product.");
    }
  };

  if (isEditMode && isFetching) {
    return <div className="w-full h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-display text-gray-900 tracking-tight">
              {isEditMode ? "Edit Product" : "New Product"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? `Updating product ID: ${id}` : "Add a new signature scent to your collection."}
            </p>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#111] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Product Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black transition-colors" placeholder="e.g. SOB Éclat Prestige" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black transition-colors resize-none" placeholder="Describe the fragrance notes and details..."></textarea>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-display text-lg border-b border-gray-100 pb-4 mb-4">Media</h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Image URL / Filename</label>
              <div className="flex gap-2">
                <input type="text" value={imageInput} onChange={(e) => setImageInput(e.target.value)} className="flex-1 border border-gray-200 p-3 text-sm outline-none focus:border-black transition-colors" placeholder="Enter image name from backend uploads..." />
                <button type="button" onClick={handleAddImage} className="bg-gray-100 px-6 hover:bg-gray-200 transition-colors"><Upload className="w-4 h-4 text-gray-600" /></button>
              </div>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square border border-gray-200 bg-gray-50 group flex items-center justify-center overflow-hidden">
                    <img src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${img}`} alt={`Product preview ${idx}`} className="object-contain w-full h-full p-2" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3 text-red-500" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-display text-lg border-b border-gray-100 pb-4 mb-4">Pricing & Stock</h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Price (₹)</label>
              <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black transition-colors" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Stock Quantity</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black transition-colors" placeholder="0" />
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-display text-lg border-b border-gray-100 pb-4 mb-4">Organization</h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Category ID</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black transition-colors" placeholder="Category Object ID" />
              <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest">Ensure valid MongoDB ID</p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};