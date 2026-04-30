// src/pages/admin/AdminReviews.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Search, Filter, Trash2, MessageSquare, Loader2, Star, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useGetReviewsQuery, useDeleteReviewMutation } from "../../store/adminApi"; 

export const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  const { data: responseData, isLoading, isError } = useGetReviewsQuery();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Extract data array safely based on the JSON response { success: true, data: [...] }
  const reviews = Array.isArray(responseData) ? responseData : responseData?.data || [];

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  // 🚀 Filter Logic Mapped to Correct JSON Keys (userId.name & productId.name)
  const filteredReviews = reviews.filter((review: any) => {
    const customerName = review.userId?.name || "Guest User";
    const customerEmail = review.userId?.email || "";
    const productName = review.productId?.name || "Unknown Product";
    const comment = review.comment || "";
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === "All" || review.status?.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesFilter;
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

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {["All", "Approved", "Pending", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-colors border ${
                activeFilter === status 
                  ? "bg-[#111] text-white border-[#111]" 
                  : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {status}
            </button>
          ))}
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
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map((review: any) => (
                <tr key={review._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {review.userId?.name || "Guest"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {review.userId?.email || "No Email"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {review.productId?.name || "Unknown Product"}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex text-[#111]">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < (review.rating || 0) ? 'fill-current' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3">
                        "{review.comment || "No comment provided."}"
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded ${getStatusColor(review.status)}`}>
                      {review.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* Optional: Add status change buttons if needed later */}
                      {review.status === 'pending' && (
                        <>
                           <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(review._id)}
                        disabled={isDeleting}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 ml-2" 
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredReviews.length === 0 && (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center border-t border-gray-100">
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