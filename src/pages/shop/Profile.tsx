// src/pages/Profile.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Package, User as UserIcon, MapPin, CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";

// Component Imports
import { MyOrders } from "../../components/profile/MyOrders";
import { AddressBook } from "../../components/profile/AddressBook";

import { useGetProfileQuery } from "../../store/api/userApi"; 

type TabType = 'orders' | 'addresses' | 'payments';

export const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetProfileQuery();
  
  const localUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const user = profileResponse?.data || profileResponse || localUser;

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully", {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
    });
    navigate("/auth");
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-surface)] pt-32 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        <div className="mb-16">
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            My Account
          </span>
          <h1 className="text-4xl md:text-5xl font-display text-gray-900">
            Welcome back, <span className="italic text-gray-400">{user?.name?.split(' ')[0] || 'Member'}</span>.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar Navigation & Profile Information */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 overflow-hidden shadow-sm"
            >
              <div className="p-8 flex flex-col items-center text-center border-b border-gray-100 bg-gray-50/50 relative">
                {isLoadingProfile && (
                  <Loader2 className="absolute top-4 right-4 w-4 h-4 animate-spin text-gray-300" />
                )}
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 text-2xl font-display text-gray-800 tracking-widest">
                  {user?.name?.charAt(0).toUpperCase() || <UserIcon strokeWidth={1.5} className="w-8 h-8 text-black" />}
                </div>
                <h3 className="font-display text-xl mb-1">{user?.name || "Loading..."}</h3>
                <p className="text-sm text-gray-500 font-sans">{user?.email}</p>
              </div>

              {/* Navigation Menu */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 p-5 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <Package className="w-4 h-4" /> Order History
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center gap-3 p-5 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <MapPin className="w-4 h-4" /> Address Book
                </button>
                <button 
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center gap-3 p-5 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'payments' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <CreditCard className="w-4 h-4" /> Payment Methods
                </button>
              </div>
              
              <div className="p-6 bg-white">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Dynamic Content Area */}
          <div className="lg:col-span-8 bg-white p-8 md:p-10 border border-gray-100 min-h-[500px] shadow-sm relative">
            <AnimatePresence mode="wait">
              
              {/* Order History Panel */}
              {activeTab === 'orders' && <MyOrders />}

              {/* Address Book Panel */}
              {activeTab === 'addresses' && <AddressBook />}

              {/* Payment Methods Panel */}
              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                    <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> Saved Methods
                    </h2>
                  </div>

                  <div className="py-12 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <CreditCard className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Secure Payments</p>
                    <p className="text-xs text-gray-400 mt-1">Payment method saving will be available soon.</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};