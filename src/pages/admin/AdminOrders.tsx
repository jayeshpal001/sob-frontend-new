// src/pages/admin/AdminOrders.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Search, Filter, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "../../store/adminApi"; // 🚀 RTK Query Hooks

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch Live Orders & Status Mutation
  const { data: responseData, isLoading, isError } = useGetOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // Extract orders safely from response (handles { success: true, data: [...] })
  const orders = Array.isArray(responseData) ? responseData : responseData?.data || [];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const getStatusColor = (status: string) => {
    switch (status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Shipped': return 'bg-[#111] text-white border-[#111]';
      case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Backend ko lowercase me status bhejna safe rehta hai JSON ke hisaab se
      await updateStatus({ id: orderId, status: newStatus.toLowerCase() }).unwrap();
      toast.success(`Order #${orderId.substring(0, 8)} marked as ${newStatus}`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
    } catch (error: any) {
      console.error("Status Update Error:", error);
      toast.error(error?.data?.message || "Failed to update order status.");
    }
  };

  // Live Filtering Logic mapped to new JSON keys
  const filteredOrders = orders.filter((order: any) => {
    const customerName = order.userId?.name || "Guest";
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = activeFilter === "All" || order.status?.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

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
        Failed to load orders. Ensure backend is active.
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 relative">
      
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Track, process, and manage customer orders.</p>
        </div>
      </motion.div>

      {/* Toolbar (Search & Filter Pills) */}
      <motion.div variants={item} className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col space-y-4">
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black hover:border-gray-400 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {["All", ...statuses].map((status) => (
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

      {/* Orders Table */}
      <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm overflow-hidden relative">
        
        {/* Mutation Loading Overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 font-mono">
                        #{order._id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {/* 🚀 Mapped correctly to userId.name */}
                        {order.userId?.name || "Guest"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {order.userId?.email || "No Email"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString() || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                        {/* 🚀 Mapped correctly to products array length */}
                        {order.products?.length || 0} Items
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded ${getStatusColor(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-4">
                      
                      {/* 🚀 Real-time Status Updater */}
                      <select 
                        className="text-xs border border-gray-200 bg-[#F9FAFB] text-gray-600 py-1.5 px-2 outline-none cursor-pointer hover:border-gray-400 transition-colors focus:border-black"
                        value={order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase()} // Capitalize for match
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdating}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      
                      {/* View Details Button */}
                      <button className="p-2 text-gray-400 hover:text-[#111] hover:bg-gray-100 rounded transition-colors" title="View Order Details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-gray-400 uppercase tracking-widest">
                    No orders found matching your criteria.
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