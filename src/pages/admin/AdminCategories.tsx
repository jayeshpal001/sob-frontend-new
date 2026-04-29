// src/pages/admin/AdminCategories.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Tags, Edit2, Trash2, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} from "../../store/adminApi"; // 

export const AdminCategories = () => {
  //  Live Data & Mutation Hooks
  const { data: responseData, isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Safely extract categories from the backend response
  const categories = Array.isArray(responseData) ? responseData : responseData?.data || [];

  const [formData, setFormData] = useState({ id: "", name: "", parent: "" });
  const [isEditing, setIsEditing] = useState(false);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Category name is required.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        parentCategory: formData.parent || null, // Map local 'parent' state to API 'parentCategory'
      };

      if (isEditing && formData.id) {
        await updateCategory({ id: formData.id, data: payload }).unwrap();
        toast.success("Category updated successfully", {
          style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
        });
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created successfully", {
          style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
        });
      }
      
      // Reset form on success
      setFormData({ id: "", name: "", parent: "" });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Category Error:", error);
      toast.error(error?.data?.message || "Failed to save category.");
    }
  };

  const handleEdit = (category: any) => {
    // Populate form with existing data
    setFormData({ 
      id: category._id, 
      name: category.name, 
      parent: category.parentCategory || "" 
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    
    try {
      await deleteCategory(id).unwrap();
      toast.success(`${name} category deleted.`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category.");
    }
  };

  const cancelEdit = () => {
    setFormData({ id: "", name: "", parent: "" });
    setIsEditing(false);
  };

  // Sleek Loading State
  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  // Error State Handling
  if (isError) {
    return (
      <div className="w-full py-12 text-center text-sm font-bold text-red-500 tracking-widest uppercase border border-red-100 bg-red-50">
        Failed to load categories. Ensure backend is active.
      </div>
    );
  }

  const isSubmitting = isCreating || isUpdating;

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
        
        {/* Left Side: Categories List */}
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
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat: any) => (
                  <tr key={cat._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-4">
                      <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                    </td>
                    <td className="px-8 py-4">
                      {cat.parentCategory ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-widest font-bold border border-gray-200 rounded">
                          {/* If backend populates parent, use name, else show ID */}
                          {cat.parentCategory.name || cat.parentCategory}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(cat)} 
                          className="p-2 text-gray-400 hover:text-[#111] hover:bg-gray-100 rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id, cat.name)} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-sm text-gray-400 uppercase tracking-widest">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Side: Add / Edit Form (Sticky) */}
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
                {/* Dynamic Mapping of top-level categories */}
                {categories.filter((c: any) => !c.parentCategory).map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#111] text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors mt-4 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? "Update Category" : "Save Category"}
            </button>
          </form>
        </motion.div>

      </div>
    </motion.div>
  );
};