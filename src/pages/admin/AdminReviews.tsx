// src/pages/admin/AdminReviews.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Search, Filter, Trash2, MessageSquare, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { useGetReviewsQuery, useDeleteReviewMutation } from "../../store/adminApi"; // 🚀 RTK Query Hooks

export const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: responseData, isLoading, isError } = useGetReviewsQuery();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Extract data array safely based on the JSON response
  const reviews = responseData?.data || [];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review permanently deleted.", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete review.");
    }
  };

  // Filter Logic
  const filteredReviews = reviews.filter((review: any) => {
    const customerName = review.user?.name || review.name || "Unknown";
    const productName = review.product?.name || "";
    const comment = review.comment || "";
    
    return (
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-12 text-center text-sm font-bold text-red-500 tracking-widest uppercase border border-red-100 bg-red-50">
        Failed to load reviews. Ensure backend is active.
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Review Moderation</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage customer feedback.</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={item} className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by customer, product, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black hover:border-gray-400 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </motion.div>

      {/* Reviews Table */}
      <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm overflow-hidden relative">
        {isDeleting && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating & Comment</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map((review: any) => (
                <tr key={review._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {review.user?.name || review.name || "Guest"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {review.product?.name || "Unknown Product"}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex text-[#111]">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < (review.rating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2" title={review.comment}>
                        {review.comment || "No comment provided."}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(review._id)}
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50" 
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredReviews.length === 0 && (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">No reviews found.</p>
              <p className="text-xs text-gray-400 mt-1">When customers leave reviews, they will appear here.</p>
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
};