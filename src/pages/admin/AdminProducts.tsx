// src/pages/admin/AdminProducts.tsx
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Filter, Loader2, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useGetProductsQuery, useDeleteProductMutation } from "../../store/adminApi"; 

export const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🚀 New States for Functional Filter Dropdown
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState("All");

  const { data: responseData, isLoading, isError } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Safely extract products array (Handles both plain arrays and { success: true, data: [...] })
  const products = Array.isArray(responseData) ? responseData : (responseData?.data || []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  // Dynamically calculate status based on actual stock levels
  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-700 border-red-200' };
    if (stock < 15) return { label: 'Low Stock', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { label: 'Active', color: 'bg-green-50 text-green-700 border-green-200' };
  };

  // Safe Image URL Generator
  const getImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "/sob-perfume-bottle.png"; // Fallback luxury image
    if (images[0].startsWith('http')) return images[0]; // If it's already a full URL
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return `${API_URL}/uploads/${images[0]}`; // Connect local filename to backend uploads folder
  };

  // Handle Product Deletion
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      await deleteProduct(id).unwrap();
      toast.success(`${name} deleted successfully`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product.");
    }
  };

  // Live Filtering Logic (Search + Stock Status)
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    let matchesStock = true;
    if (stockFilter === "Active") matchesStock = product.stock >= 15;
    if (stockFilter === "Low Stock") matchesStock = product.stock > 0 && product.stock < 15;
    if (stockFilter === "Out of Stock") matchesStock = product.stock <= 0;

    return matchesSearch && matchesStock;
  });

  if (isLoading) return <div className="w-full h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>;
  if (isError) return <div className="w-full py-12 text-center text-sm font-bold text-red-500 tracking-widest uppercase border border-red-100 bg-red-50">Failed to load inventory. Ensure backend is active.</div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 relative">
      
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Inventory</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your signature scents and stock levels.</p>
        </div>
        <Link to="/admin/products/new">
          <button className="flex items-center gap-2 bg-[#111] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors shadow-lg">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </Link>
      </motion.div>

      {/* Toolbar (Search & Active Filters) */}
      <motion.div variants={item} className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center relative">
          
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
            />
          </div>
          
          {/* Functional Dropdown Filter */}
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-2 px-6 py-3 border text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-auto justify-center ${isFilterMenuOpen ? 'border-black text-black' : 'border-gray-200 text-gray-600 hover:text-black hover:border-gray-400'}`}
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            
            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl z-20"
                >
                  <div className="p-4">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Stock Filter</p>
                    <div className="flex flex-col space-y-2">
                      {["All", "Active", "Low Stock", "Out of Stock"].map(filterOp => (
                        <label key={filterOp} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" name="stockFilter" value={filterOp} 
                            checked={stockFilter === filterOp} 
                            onChange={() => { setStockFilter(filterOp); setIsFilterMenuOpen(false); }}
                            className="accent-black"
                          />
                          <span className="text-xs text-gray-700">{filterOp}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected Filter Pills Display */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {["All", "Active", "Low Stock", "Out of Stock"].map((status) => (
            <button
              key={status}
              onClick={() => setStockFilter(status)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-colors border ${
                stockFilter === status 
                  ? "bg-[#111] text-white border-[#111]" 
                  : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Product Table */}
      <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm overflow-hidden relative z-10">
        
        {isDeleting && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-20">Image</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Info</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product: any) => {
                const status = getStockStatus(product.stock);
                
                return (
                  <tr key={product._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-16 bg-[#F7F7F7] flex items-center justify-center p-1 relative border border-gray-100 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img src={getImageUrl(product.images)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                        <span className="text-[10px] text-gray-400 tracking-widest mt-1 uppercase">
                          Added: {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-500 font-medium ml-1">
                          {product.stock} units
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        {/* 🚀 Wrapper Added for Navigation */}
                        <Link to={`/admin/products/edit/${product._id}`}>
                          <button className="p-2 text-gray-400 hover:text-[#111] hover:bg-gray-100 rounded transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button onClick={() => handleDelete(product._id, product.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="w-full py-16 text-center text-sm text-gray-400 tracking-widest uppercase">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};