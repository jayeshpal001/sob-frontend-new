// src/pages/admin/AdminOrders.tsx
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Eye, Loader2, X, MapPin,  Package } from "lucide-react";
import { toast } from "sonner";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "../../store/adminApi"; 

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { data: responseData, isLoading, isError } = useGetOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

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
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped': return 'bg-[#111] text-white border-[#111]';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-orange-500';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus.toLowerCase() }).unwrap();
      toast.success(`Order #${orderId.substring(0, 8)} marked as ${newStatus}`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
      
      // Update selected order locally if the panel is open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus.toLowerCase() });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update order status.");
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const customerName = order.userId?.name || "Guest";
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = activeFilter === "All" || order.status?.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) return <div className="w-full h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>;
  if (isError) return <div className="w-full py-12 text-center text-sm font-bold text-red-500 tracking-widest uppercase border border-red-100 bg-red-50">Failed to load orders.</div>;

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 relative">
        <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Track, process, and manage customer orders.</p>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div variants={item} className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
              </div>
              <input type="text" placeholder="Search by Order ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm transition-all duration-300" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {["All", ...statuses].map((status) => (
              <button key={status} onClick={() => setActiveFilter(status)} className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-colors border ${activeFilter === status ? "bg-[#111] text-white border-[#111]" : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm overflow-hidden relative">
          {isUpdating && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-black" /></div>}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount & Payment</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 font-mono">#{order._id.substring(0, 8).toUpperCase()}</span>
                        <span className="text-xs text-gray-500 mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{order.userId?.name || "Guest"}</span>
                        <span className="text-xs text-gray-500 mt-1">{order.userId?.email || "No Email"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">₹{order.totalAmount?.toLocaleString() || 0}</span>
                        <span className={`text-[10px] uppercase tracking-widest mt-1 font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus || "Pending"} {order.paymentMethod ? `• ${order.paymentMethod}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded ${getStatusColor(order.status)}`}>{order.status || "Pending"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-4">
                        <select 
                          className="text-xs border border-gray-200 bg-[#F9FAFB] text-gray-600 py-1.5 px-2 outline-none cursor-pointer hover:border-gray-400 transition-colors focus:border-black"
                          value={order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase()} 
                          onChange={(e) => handleStatusChange(order._id, e.target.value)} disabled={isUpdating}
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button 
                          onClick={() => setSelectedOrder(order)} // 🚀 Open Slide-over Panel
                          className="p-2 text-gray-400 hover:text-[#111] hover:bg-gray-100 rounded transition-colors" title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
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

      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            
            {/* Slide Panel */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                <div>
                  <h3 className="font-display text-xl text-gray-900">Order Details</h3>
                  <p className="text-xs font-mono text-gray-500 mt-1">#{selectedOrder._id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Status & Payment Block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-100 bg-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Status</p>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border rounded inline-block ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status || "Pending"}
                    </span>
                  </div>
                  <div className="p-4 border border-gray-100 bg-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Payment</p>
                    <span className={`text-xs font-bold uppercase tracking-widest ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus || "Pending"} {selectedOrder.paymentMethod ? `(${selectedOrder.paymentMethod})` : ''}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.address ? (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                      <MapPin className="w-4 h-4" /> Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-bold text-gray-900">{selectedOrder.address.name}</p>
                      <p>{selectedOrder.address.addressLine}</p>
                      <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.pincode}</p>
                      <p className="pt-2 font-mono text-xs">Ph: {selectedOrder.address.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                      <MapPin className="w-4 h-4" /> Customer Info
                    </h4>
                    <p className="text-sm text-gray-600">{selectedOrder.userId?.name || "Guest User"}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.userId?.email || "No Email Provided"}</p>
                    <p className="text-xs text-orange-500 mt-2 italic">Detailed address not captured for this order.</p>
                  </div>
                )}

                {/* Items List */}
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    <Package className="w-4 h-4" /> Order Items ({selectedOrder.products?.length || 0})
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.products?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.productId?.name || "Unknown Product"}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">₹{(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal?.toLocaleString() || selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax (Estimated)</span>
                      <span>₹{selectedOrder.tax?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-black pt-3 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span>₹{selectedOrder.totalAmount?.toLocaleString() || 0}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};