// src/pages/admin/AdminDashboard.tsx
import { motion,type Variants } from "framer-motion"; 
import { Users, ShoppingBag, CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock Data: Replace this with data from /api/admin/dashboard later
const mockStats = {
  totalUsers: 1248,
  totalOrders: 432,
  revenue: 84500,
};

const mockRecentOrders = [
  { id: "#ORD-001", customer: "Aarav Sharma", date: "Apr 28, 2026", total: 245, status: "Pending" },
  { id: "#ORD-002", customer: "Priya Patel", date: "Apr 27, 2026", total: 540, status: "Shipped" },
  { id: "#ORD-003", customer: "Rohan Desai", date: "Apr 27, 2026", total: 175, status: "Delivered" },
  { id: "#ORD-004", customer: "Neha Gupta", date: "Apr 26, 2026", total: 310, status: "Processing" },
];

export const AdminDashboard = () => {

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  // Helper for Status Badge styling
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'shipped': return 'bg-black text-white border-black';
      case 'pending': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'processing': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <motion.div variants={item} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Revenue</p>
            <div className="p-2 bg-gray-50 text-[#111] rounded-md group-hover:bg-[#111] group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-display text-gray-900 tracking-tight">
            ${mockStats.revenue.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div variants={item} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Orders</p>
            <div className="p-2 bg-gray-50 text-[#111] rounded-md group-hover:bg-[#111] group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-display text-gray-900 tracking-tight">
            {mockStats.totalOrders.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div variants={item} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Users</p>
            <div className="p-2 bg-gray-50 text-[#111] rounded-md group-hover:bg-[#111] group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-display text-gray-900 tracking-tight">
            {mockStats.totalUsers.toLocaleString()}
          </h3>
        </motion.div>

      </div>

      {/* Recent Orders Table Section */}
      <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm">
        
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900">Recent Transactions</h3>
          <Link to="/admin/orders" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockRecentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-semibold text-gray-900">{order.id}</td>
                  <td className="px-8 py-5 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-8 py-5 text-sm text-gray-500">{order.date}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-gray-900 text-right">${order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State Fallback */}
          {mockRecentOrders.length === 0 && (
            <div className="w-full py-12 text-center text-sm text-gray-400 tracking-widest uppercase">
              No recent orders found.
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};