// src/pages/admin/AdminCategories.tsx
import { useState } from "react";
import { motion,type Variants } from "framer-motion";
import { Tags, Edit2, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

// Mock Data: Replace with data from GET /api/admin/categories
const mockCategories = [
  { id: "CAT-1", name: "Men's Fragrance", parent: null, items: 12 },
  { id: "CAT-2", name: "Women's Fragrance", parent: null, items: 18 },
  { id: "CAT-3", name: "Unisex", parent: null, items: 8 },
  { id: "CAT-4", name: "Limited Edition", parent: null, items: 3 },
  { id: "CAT-5", name: "Oud Collection", parent: "Men's Fragrance", items: 4 },
  { id: "CAT-6", name: "Floral Notes", parent: "Women's Fragrance", items: 6 },
];

export const AdminCategories = () => {
  const [formData, setFormData] = useState({ name: "", parent: "" });
  const [isEditing, setIsEditing] = useState(false);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    toast.success(`Category ${isEditing ? 'updated' : 'created'} successfully`, {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
    });
    
    setFormData({ name: "", parent: "" });
    setIsEditing(false);
  };

  const handleEdit = (category: any) => {
    setFormData({ name: category.name, parent: category.parent || "" });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setFormData({ name: "", parent: "" });
    setIsEditing(false);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Organize your products into logical collections.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Categories List (Takes up 2 columns) */}
        <motion.div variants={item} className="lg:col-span-2 bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-3">
            <Tags className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900">All Categories</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Name</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Parent</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Items</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-4">
                      <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                    </td>
                    <td className="px-8 py-4">
                      {cat.parent ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-widest font-bold border border-gray-200 rounded">
                          {cat.parent}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-500">{cat.items} products</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-[#111] hover:bg-gray-100 rounded transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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

        {/* Right Side: Add / Edit Form (Takes up 1 column & Sticky) */}
        <motion.div variants={item} className="lg:col-span-1 bg-white border border-gray-200 shadow-sm sticky top-28">
          <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h3>
            {isEditing && (
              <button onClick={cancelEdit} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required
                placeholder="e.g. Summer Collection"
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Parent Category (Optional)</label>
              <select 
                value={formData.parent} 
                onChange={(e) => setFormData({...formData, parent: e.target.value})} 
                className="w-full p-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300 cursor-pointer text-gray-700"
              >
                <option value="">No Parent (Top Level)</option>
                {mockCategories.filter(c => !c.parent).map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#111] text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors mt-4"
            >
              <Save className="w-4 h-4" />
              {isEditing ? "Update Category" : "Save Category"}
            </button>
          </form>
        </motion.div>

      </div>
    </motion.div>
  );
};