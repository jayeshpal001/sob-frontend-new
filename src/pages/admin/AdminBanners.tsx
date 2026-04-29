// src/pages/admin/AdminBanners.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { UploadCloud, Trash2, Link as LinkIcon, Plus, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useGetBannersQuery, useCreateBannerMutation, useDeleteBannerMutation } from "../../store/adminApi";

export const AdminBanners = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { data: response, isLoading, isError } = useGetBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const banners = response?.data || [];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a banner image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("redirectUrl", redirectUrl || "/collection");

      await createBanner(formData).unwrap();
      
      toast.success("Banner uploaded successfully");
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload banner.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner removed.");
    } catch (error: any) {
      toast.error("Failed to delete banner.");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setRedirectUrl("");
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
      
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Storefront Banners</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the visual narrative of your homepage.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#111] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </motion.div>

      {/* Add Banner Form (Modalish Overlay) */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-xl w-full p-10 shadow-2xl relative">
            <button onClick={resetForm} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-display text-[#111] mb-8">Upload New Banner</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Banner Image</label>
                {preview ? (
                  <div className="relative aspect-[21/9] w-full bg-gray-100 border border-gray-200 overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => { setPreview(null); setSelectedFile(null); }} className="absolute inset-0 bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold uppercase tracking-widest">Change Image</button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-[21/9] bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-400 cursor-pointer transition-all">
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Banner File</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Redirect Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={redirectUrl} 
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="e.g. /products/collection-name"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-[#111] text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Banner"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Banner Gallery */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map((banner: any) => (
          <div key={banner._id} className="group bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="aspect-[21/9] bg-gray-100 relative overflow-hidden">
              <img 
                src={banner.image.startsWith('http') ? banner.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${banner.image}`} 
                alt="Banner" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => handleDelete(banner._id)}
                  className="p-4 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full shadow-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 flex justify-between items-center bg-white border-t border-gray-50">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Redirects To</span>
                <span className="text-xs font-medium text-gray-900 truncate max-w-[200px]">{banner.redirectUrl}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {banner.isActive ? 'Live' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && !isLoading && (
          <div className="col-span-full py-20 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <ImageIcon className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">No active banners.</p>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
};