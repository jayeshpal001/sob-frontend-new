// src/components/admin/AdminLayout.tsx
import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Star, 
  Image as ImageIcon, 
  LogOut, 
  Menu, 
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Reviews", path: "/admin/reviews", icon: Star },
  { name: "Banners", path: "/admin/banners", icon: ImageIcon },
];

export const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 🚀 Logout Modal State
  const location = useLocation();
  const navigate = useNavigate(); 
  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Open the animated popup
    if (isMobileOpen) setIsMobileOpen(false); // Close sidebar on mobile
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    
    // Redirect to secure gate
    navigate("/admin/login");
  };

  // The Sidebar Content (Reusable for Desktop & Mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111] text-white">
      {/* Admin Branding */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800 px-6">
        <h2 className="font-display text-2xl tracking-widest uppercase">SOB Admin</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Management</p>
        {sidebarLinks.map((link) => {
          const isActive = location.pathname.includes(link.path);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-300 ${
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon strokeWidth={isActive ? 2 : 1.5} className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogoutClick}
          className="flex items-center gap-4 px-4 py-3 w-full text-left text-gray-400 hover:bg-white/5 hover:text-white hover:text-red-400 rounded-md transition-colors group"
        >
          <LogOut strokeWidth={1.5} className="w-5 h-5 group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-semibold tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );

  // Get current page name for Header
  const currentPathName = sidebarLinks.find(link => location.pathname.includes(link.path))?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex w-full relative">
      
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu strokeWidth={1.5} className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-display text-gray-900 tracking-tight">
              {currentPathName}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">Admin Master</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500">Superadmin</span>
            </div>
            <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center text-white font-display text-lg">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Page Content goes here via React Router's Outlet */}
        <div className="flex-1 p-6 md:p-10">
          <Outlet /> 
        </div>

      </main>

      {/*  Animated Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white max-w-sm w-full p-8 shadow-2xl border border-gray-200 text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
                <LogOut className="w-6 h-6 text-red-600 ml-1" />
              </div>
              <h3 className="text-xl font-display text-gray-900 mb-2">End Session?</h3>
              <p className="text-sm text-gray-500 mb-8">
                Are you sure you want to log out of the admin panel? You will need to sign in again.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] border border-gray-200 hover:bg-gray-100 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-[#111] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-600 transition-colors shadow-md"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};