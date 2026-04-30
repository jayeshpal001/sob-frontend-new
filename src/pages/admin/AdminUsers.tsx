// src/pages/admin/AdminUsers.tsx
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Filter, ShieldAlert, ShieldCheck, Loader2, Eye, X, MapPin, User as UserIcon, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";
import { useGetUsersQuery, useToggleBlockUserMutation } from "../../store/adminApi"; 

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  // 🚀 New States for Filters and Slide-over Drawer
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const { data: responseData, isLoading, isError } = useGetUsersQuery();
  const [toggleBlock, { isLoading: isToggling }] = useToggleBlockUserMutation();

  const users = responseData?.users || [];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleToggleBlock = async (userId: string, currentStatus: boolean, role: string) => {
    if (role === 'admin') {
      toast.error("Admin accounts cannot be blocked.");
      return;
    }
    
    try {
      await toggleBlock({ id: userId, isBlocked: !currentStatus }).unwrap();
      toast.success(`User access ${!currentStatus ? 'revoked' : 'restored'} successfully.`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
      
      // Update local drawer state if open
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, isBlocked: !currentStatus });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status.");
    }
  };

  // 🚀 Upgraded Filtering Logic
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      activeFilter === "All" || 
      (activeFilter === "Active" && !user.isBlocked) || 
      (activeFilter === "Blocked" && user.isBlocked);
      
    const matchesRole = 
      roleFilter === "All" || 
      user.role?.toLowerCase() === roleFilter.toLowerCase();
      
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (isLoading) return <div className="w-full h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>;
  if (isError) return <div className="w-full py-12 text-center text-sm font-bold text-red-500 tracking-widest uppercase border border-red-100 bg-red-50">Failed to load users. Ensure backend is active.</div>;

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 relative">
        
        <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Customer Directory</h2>
            <p className="text-sm text-gray-500 mt-1">Manage user access and view customer activity.</p>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div variants={item} className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center relative">
            
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
            
            {/* 🚀 Functional "More Filters" Button */}
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`flex items-center gap-2 px-6 py-3 border text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-auto justify-center ${isFilterMenuOpen ? 'border-black text-black' : 'border-gray-200 text-gray-600 hover:text-black hover:border-gray-400'}`}
              >
                <Filter className="w-4 h-4" />
                More Filters
              </button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isFilterMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl z-20"
                  >
                    <div className="p-4">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Role Filter</p>
                      <div className="flex flex-col space-y-2">
                        {["All", "Admin", "User"].map(role => (
                          <label key={role} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" name="roleFilter" value={role} 
                              checked={roleFilter === role} 
                              onChange={() => { setRoleFilter(role); setIsFilterMenuOpen(false); }}
                              className="accent-black"
                            />
                            <span className="text-xs text-gray-700">{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Status Pills */}
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
        <motion.div variants={item} className="bg-white border border-gray-200 shadow-sm overflow-hidden relative z-10">
          {isToggling && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-black" /></div>}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">User Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Role & Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Saved Addresses</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user: any) => (
                  <tr key={user._id} className={`transition-colors group ${user.isBlocked ? 'bg-red-50/20' : 'hover:bg-gray-50/80'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-display tracking-widest ${user.role === 'admin' ? 'bg-black text-white' : (user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')}`}>
                          {user.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{user.name || "Unknown"}</span>
                          <span className="text-xs text-gray-500 mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded ${user.role === 'admin' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.addresses?.length || 0} Locations
                    </td>
                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-red-200 bg-red-50 text-red-700 rounded">Blocked</span>
                      ) : (
                        <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-green-200 bg-green-50 text-green-700 rounded">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* Block/Unblock Button */}
                        <button 
                          onClick={() => handleToggleBlock(user._id, user.isBlocked, user.role)}
                          disabled={isToggling || user.role === 'admin'}
                          title={user.role === 'admin' ? "Cannot block admin accounts" : "Toggle Access"}
                          className={`p-2 rounded transition-colors ${
                            user.role === 'admin' ? 'text-gray-300 cursor-not-allowed' :
                            (user.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50')
                          } disabled:opacity-50`}
                        >
                          {user.isBlocked ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        </button>
                        
                        {/* 🚀 View Profile Button */}
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="w-full py-12 text-center text-sm text-gray-400 tracking-widest uppercase">
                No customers found.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* 🚀 SLIDE-OVER DRAWER FOR USER PROFILE & ADDRESSES */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-display ${selectedUser.role === 'admin' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {selectedUser.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-gray-900">{selectedUser.name}</h3>
                    <span className={`px-2 py-0.5 mt-1 text-[9px] font-bold uppercase tracking-widest border rounded inline-block ${selectedUser.role === 'admin' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {selectedUser.role} Profile
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Basic Info */}
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    <UserIcon className="w-4 h-4" /> Account Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" /> {selectedUser.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" /> Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System ID: </span>
                      <span className="text-xs font-mono text-gray-500">{selectedUser._id}</span>
                    </div>
                  </div>
                </div>

                {/* Addresses List */}
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    <MapPin className="w-4 h-4" /> Saved Addresses ({selectedUser.addresses?.length || 0})
                  </h4>
                  
                  {(!selectedUser.addresses || selectedUser.addresses.length === 0) ? (
                    <div className="py-8 text-center bg-gray-50 border border-gray-100 text-sm text-gray-400">
                      No addresses saved yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedUser.addresses.map((addr: any, idx: number) => (
                        <div key={idx} className="p-4 border border-gray-200 relative bg-white">
                          {addr.isDefault && (
                            <span className="absolute top-0 right-0 bg-[#111] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                              Default
                            </span>
                          )}
                          <p className="font-bold text-sm text-gray-900 mb-1">{addr.name}</p>
                          <p className="text-sm text-gray-600">{addr.addressLine}</p>
                          <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                          <p className="text-xs font-mono text-gray-500 mt-2">Ph: {addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};