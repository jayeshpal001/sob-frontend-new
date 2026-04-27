// src/pages/admin/AdminOrders.tsx
import { useState } from "react";
import { motion,type Variants } from "framer-motion";
import { Search, Filter, Eye} from "lucide-react";
import { toast } from "sonner";

// Mock Data: Replace with data from GET /api/admin/orders
const mockOrders = [
  { id: "#ORD-9081", customer: "Aarav Sharma", email: "aarav@example.com", date: "Apr 28, 2026", total: 245, status: "Pending", items: 1 },
  { id: "#ORD-9080", customer: "Priya Patel", email: "priya@example.com", date: "Apr 27, 2026", total: 540, status: "Processing", items: 3 },
  { id: "#ORD-9079", customer: "Rohan Desai", email: "rohan@example.com", date: "Apr 27, 2026", total: 175, status: "Shipped", items: 1 },
  { id: "#ORD-9078", customer: "Neha Gupta", email: "neha@example.com", date: "Apr 26, 2026", total: 310, status: "Delivered", items: 2 },
  { id: "#ORD-9077", customer: "Kabir Singh", email: "kabir@example.com", date: "Apr 25, 2026", total: 890, status: "Cancelled", items: 4 },
];

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Shipped': return 'bg-[#111] text-white border-[#111]';
      case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} marked as ${newStatus}`, {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
    });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      
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
      <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm overflow-hidden">
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
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                      <span className="text-xs text-gray-500 mt-1">{order.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                      <span className="text-xs text-gray-500 mt-1">{order.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">${order.total}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{order.items} Items</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-4">
                      {/* Inline Status Updater */}
                      <select 
                        className="text-xs border border-gray-200 bg-[#F9FAFB] text-gray-600 py-1.5 px-2 outline-none cursor-pointer hover:border-gray-400 transition-colors focus:border-black"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
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
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
};