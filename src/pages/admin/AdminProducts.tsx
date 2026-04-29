// src/pages/admin/AdminProducts.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Filter, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useGetProductsQuery, useDeleteProductMutation } from "../../store/adminApi"; // 🚀 RTK Query Hooks

export const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");


  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Dynamically calculate status based on actual stock levels
  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-700 border-red-200' };
    if (stock < 15) return { label: 'Low Stock', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { label: 'Active', color: 'bg-green-50 text-green-700 border-green-200' };
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
      toast.error("Failed to delete product.");
    }
  };

  // Local filtering based on real backend data
  const filteredProducts = products.filter((product: any) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sleek Loading State
  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  // Error State Fallback
  if (isError) {
    return (
      <div className="w-full py-12 text-center text-sm font-bold text-red-500 tracking-widest uppercase border border-red-100 bg-red-50">
        Failed to load inventory. Ensure backend is active.
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">
            Inventory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your signature scents and stock levels.
          </p>
        </div>
        <Link to="/admin/products/new">
          <button className="flex items-center gap-2 bg-[#111] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors shadow-lg">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </Link>
      </motion.div>

      {/* Toolbar (Search & Filter) */}
      <motion.div
        variants={item}
        className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center"
      >
        <div className="relative w-full sm:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black hover:border-gray-400 transition-colors w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </motion.div>

      {/* Product Table */}
      <motion.div
        variants={item}
        className="bg-white border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-20">
                  Image
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Product Name
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Stock
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product: any) => {
                const status = getStockStatus(product.stock);
                // Handle image logic gracefully based on your API response
                const imageSrc = product.images && product.images.length > 0
                  ? product.images[0] // Note: Might need import.meta.env.VITE_API_BASE_URL if it's just a filename
                  : "/sob-perfume-bottle.png";

                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-16 bg-[#F7F7F7] flex items-center justify-center p-1">
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                          {product._id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {/* Safety check for nested populated category */}
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-500 font-medium ml-1">
                          {product.stock} units
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 text-gray-400 hover:text-[#111] hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="w-full py-12 text-center text-sm text-gray-400 tracking-widest uppercase">
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