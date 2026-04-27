// src/pages/admin/AdminProducts.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// Mock Data: Replace with data from GET /api/admin/products
const mockProducts = [
  {
    id: "PRD-001",
    name: "Noir Absolu",
    category: "Men",
    price: 245,
    stock: 45,
    status: "Active",
    image: "/sob-perfume-bottle.png",
  },
  {
    id: "PRD-002",
    name: "Azure Depths",
    category: "Unisex",
    price: 275,
    stock: 12,
    status: "Low Stock",
    image: "/sob-perfume-bottle.png",
  },
  {
    id: "PRD-003",
    name: "Blanc Éthéréal",
    category: "Women",
    price: 220,
    stock: 0,
    status: "Out of Stock",
    image: "/sob-perfume-bottle.png",
  },
  {
    id: "PRD-004",
    name: "Obsidian Edge",
    category: "Limited",
    price: 295,
    stock: 8,
    status: "Low Stock",
    image: "/sob-perfume-bottle.png",
  },
];

export const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");

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

  const getStockColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Low Stock":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Out of Stock":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

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
            placeholder="Search products..."
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
              {mockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-16 bg-[#F7F7F7] flex items-center justify-center p-1">
                      <img
                        src={product.image}
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
                        {product.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded ${getStockColor(product.status)}`}
                      >
                        {product.status}
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
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
