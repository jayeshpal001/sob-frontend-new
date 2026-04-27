// src/pages/admin/AdminReviews.tsx
import { useState } from "react";
import { motion,type Variants } from "framer-motion";
import { Search, Filter, Star, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Mock Data: Replace with data from GET /api/admin/reviews
const initialReviews = [
  { id: "REV-101", customer: "Priya Patel", product: "Noir Absolu", rating: 5, comment: "Absolutely mesmerizing! It lasts all day and feels incredibly premium.", date: "Apr 28, 2026", status: "Pending" },
  { id: "REV-102", customer: "Rohan Desai", product: "Obsidian Edge", rating: 4, comment: "Very strong opening, settles into a nice leathery scent. Good for evenings.", date: "Apr 27, 2026", status: "Approved" },
  { id: "REV-103", customer: "Anonymous", product: "Blanc Éthéréal", rating: 1, comment: "Arrived late and packaging was damaged. Extremely disappointed.", date: "Apr 25, 2026", status: "Rejected" },
  { id: "REV-104", customer: "Aarav Sharma", product: "Noir Absolu", rating: 5, comment: "This is my third bottle. My signature scent now.", date: "Apr 24, 2026", status: "Pending" },
];

export const AdminReviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Pending"); // Default focus on what needs action

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleAction = (id: string, action: "Approved" | "Rejected" | "Deleted") => {
    
    if (action === "Deleted") {
      setReviews(reviews.filter(r => r.id !== id));
      toast.error("Review permanently deleted.", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }
      });
    } else {
      setReviews(reviews.map(r => r.id === id ? { ...r, status: action } : r));
      toast.success(`Review successfully ${action.toLowerCase()}.`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  // Filter Logic
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || review.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Review Moderation</h2>
          <p className="text-sm text-gray-500 mt-1">Approve, reject, or delete customer feedback.</p>
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
              placeholder="Search by product or customer..."
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

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {["Pending", "Approved", "Rejected", "All"].map((status) => (
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

      {/* Reviews List */}
      <motion.div variants={item} className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-gray-200 py-12 text-center text-sm text-gray-400 tracking-widest uppercase shadow-sm">
            No {activeFilter.toLowerCase()} reviews found.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              
              {/* Review Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{review.product}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{review.customer}</span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded ${getStatusBadge(review.status)}`}>
                    {review.status}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'fill-black text-black' : 'fill-gray-100 text-gray-200'}`} 
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-200 pl-4 py-1">
                  "{review.comment}"
                </p>
              </div>

              {/* Action Buttons (Right Aligned on Desktop) */}
              <div className="flex md:flex-col items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                
                {review.status !== 'Approved' && (
                  <button 
                    onClick={() => handleAction(review.id, 'Approved')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 w-full md:w-32 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                )}

                {review.status !== 'Rejected' && (
                  <button 
                    onClick={() => handleAction(review.id, 'Rejected')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 w-full md:w-32 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}

                <button 
                  onClick={() => handleAction(review.id, 'Deleted')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 w-full md:w-32 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

              </div>
            </div>
          ))
        )}
      </motion.div>

    </motion.div>
  );
};