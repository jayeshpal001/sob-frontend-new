// src/pages/admin/AdminDashboard.tsx
import { motion, type Variants } from "framer-motion"; 
import { Users, ShoppingBag, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetDashboardStatsQuery } from "../../store/adminApi"; 

export const AdminDashboard = () => {
  
  const { data: response, isLoading, isError } = useGetDashboardStatsQuery();


  const stats = response?.data || { totalUsers: 0, totalOrders: 0, totalRevenue: 0 };
  const recentOrders = response?.data?.recentOrders || [];

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
    if (!status) return 'bg-gray-50 text-gray-500 border-gray-200';
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'shipped': return 'bg-black text-white border-black';
      case 'pending': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'processing': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  // Show a sleek loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  // Handle potential API errors gracefully
  if (isError) {
    return (
      <div className="w-full py-12 text-center text-sm font-bold text-red-500 tracking-widest uppercase border border-red-100 bg-red-50">
        Failed to load dashboard data. Ensure backend is active.
      </div>
    );
  }

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
          <h3 className="text-4xl md:text-5xl  text-gray-900 tracking-tight">
            ${stats.totalRevenue.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div variants={item} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Orders</p>
            <div className="p-2 bg-gray-50 text-[#111] rounded-md group-hover:bg-[#111] group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl  text-gray-900 tracking-tight">
            {stats.totalOrders.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div variants={item} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Users</p>
            <div className="p-2 bg-gray-50 text-[#111] rounded-md group-hover:bg-[#111] group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl  text-gray-900 tracking-tight">
            {stats.totalUsers.toLocaleString()}
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
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-semibold text-gray-900">{order._id.substring(0, 8)}...</td>
                    <td className="px-8 py-5 text-sm text-gray-600">{order.user?.name || "Guest"}</td>
                    <td className="px-8 py-5 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-gray-900 text-right">${order.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="w-full py-12 text-center text-sm text-gray-400 tracking-widest uppercase">
                    No recent orders found.
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