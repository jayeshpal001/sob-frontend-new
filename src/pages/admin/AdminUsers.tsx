// src/pages/admin/AdminUsers.tsx
import { useState } from "react";
import { motion,type Variants } from "framer-motion";
import { Search, Filter, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// Mock Data: Replace with data from GET /api/admin/users
const initialUsers = [
  { id: "USR-001", name: "Aarav Sharma", email: "aarav@example.com", joined: "Jan 12, 2026", orders: 12, isBlocked: false },
  { id: "USR-002", name: "Priya Patel", email: "priya@example.com", joined: "Feb 05, 2026", orders: 4, isBlocked: false },
  { id: "USR-003", name: "Rohan Desai", email: "rohan@example.com", joined: "Mar 18, 2026", orders: 1, isBlocked: true },
  { id: "USR-004", name: "Neha Gupta", email: "neha@example.com", joined: "Apr 02, 2026", orders: 7, isBlocked: false },
  { id: "USR-005", name: "Kabir Singh", email: "kabir@example.com", joined: "Apr 20, 2026", orders: 0, isBlocked: false },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
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

  // Toggle Block/Unblock Status
  const handleToggleBlock = (userId: string, currentStatus: boolean) => {
    
    // Optimistic UI Update for demonstration
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isBlocked: !currentStatus } : user
    ));

    toast.success(`User access ${currentStatus ? 'restored' : 'revoked'} successfully.`, {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
    });
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || 
                          (activeFilter === "Active" && !user.isBlocked) || 
                          (activeFilter === "Blocked" && user.isBlocked);
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Customer Directory</h2>
          <p className="text-sm text-gray-500 mt-1">Manage user access and view customer activity.</p>
        </div>
      </motion.div>

      {/* Toolbar (Search & Filters) */}
      <motion.div variants={item} className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
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
          {["All", "Active", "Blocked"].map((status) => (
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

      {/* Users Table */}
      <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">User</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Joined Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Orders</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`transition-colors group ${user.isBlocked ? 'bg-red-50/20' : 'hover:bg-gray-50/80'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-display tracking-widest ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.orders}</td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-red-200 bg-red-50 text-red-700 rounded">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-green-200 bg-green-50 text-green-700 rounded">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                        user.isBlocked 
                          ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black' 
                          : 'border-red-200 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {user.isBlocked ? (
                        <><ShieldCheck className="w-3.5 h-3.5" /> Unblock</>
                      ) : (
                        <><ShieldAlert className="w-3.5 h-3.5" /> Block</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="w-full py-12 text-center text-sm text-gray-400 tracking-widest uppercase">
              No users found matching your criteria.
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
};