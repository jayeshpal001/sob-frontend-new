// src/pages/Dashboard.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Package, User as UserIcon, MapPin, CreditCard, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/authSlice";
import { Button } from "../components/ui/Button";

// Dummy Data
const mockOrders = [
  { id: "#SOB-10992", date: "Oct 24, 2026", status: "Delivered", total: "$145" },
  { id: "#SOB-10845", date: "Sep 12, 2026", status: "Processing", total: "$295" }
];

const mockAddresses = [
  { id: 1, type: "Home", street: "123 Luxury Avenue, Apt 4B", city: "New York", state: "NY", zip: "10012" },
  { id: 2, type: "Office", street: "88 Tech Boulevard, Floor 12", city: "San Francisco", state: "CA", zip: "94105" }
];

const mockPayments = [
  { id: 1, type: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
  { id: 2, type: "Mastercard", last4: "8899", expiry: "08/27", isDefault: false }
];

type TabType = 'orders' | 'addresses' | 'payments';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('orders');

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-surface)] pt-32 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        <div className="mb-16">
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            My Account
          </span>
          <h1 className="text-4xl md:text-5xl font-display text-gray-900">
            Welcome back, <span className="italic text-gray-400">{user?.name || 'Member'}</span>.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Sidebar: Navigation & Profile Info */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 overflow-hidden"
            >
              <div className="p-8 flex flex-col items-center text-center border-b border-gray-100 bg-gray-50/50">
                <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                  <UserIcon strokeWidth={1.5} className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-display text-xl mb-1">{user?.name}</h3>
                <p className="text-sm text-gray-500 font-sans">{user?.email}</p>
              </div>

              {/* Portal Navigation */}
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

          {/* Right Area: Dynamic Content based on Active Tab */}
          <div className="lg:col-span-8 bg-white p-8 md:p-10 border border-gray-100 min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                    <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
                      <Package className="w-5 h-5" /> Recent Orders
                    </h2>
                  </div>

                  {mockOrders.length === 0 ? (
                    <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {mockOrders.map((order, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[var(--color-surface)] border border-gray-100 hover:border-black transition-colors duration-300">
                          <div>
                            <p className="font-bold text-sm mb-1">{order.id}</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                          <div className="mt-4 sm:mt-0 flex items-center justify-between sm:w-1/2">
                            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white border border-gray-200">
                              {order.status}
                            </span>
                            <span className="font-sans font-bold">{order.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                    <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
                      <MapPin className="w-5 h-5" /> Address Book
                    </h2>
                    <button className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                      <Plus className="w-4 h-4" /> Add New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockAddresses.map((addr) => (
                      <div key={addr.id} className="p-6 border border-gray-100 hover:border-black transition-colors flex flex-col justify-between h-full">
                        <div>
                          <h4 className="font-bold text-sm uppercase tracking-widest mb-4">{addr.type}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {addr.street}<br />
                            {addr.city}, {addr.state} {addr.zip}
                          </p>
                        </div>
                        <div className="mt-8 flex gap-4 text-xs font-bold uppercase tracking-widest">
                          <button className="text-black border-b border-black pb-0.5">Edit</button>
                          <button className="text-red-500 border-b border-transparent hover:border-red-500 pb-0.5 transition-colors">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PAYMENTS TAB */}
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
                    <button className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                      <Plus className="w-4 h-4" /> Add Card
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {mockPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-10 bg-[var(--color-surface)] border border-gray-200 flex items-center justify-center text-xs font-bold tracking-widest">
                            {payment.type}
                          </div>
                          <div>
                            <p className="font-bold text-sm mb-1">•••• •••• •••• {payment.last4}</p>
                            <p className="text-xs text-gray-500">Expires {payment.expiry}</p>
                          </div>
                        </div>
                        {payment.isDefault ? (
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-gray-100 px-3 py-1">Default</span>
                        ) : (
                          <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Set Default</button>
                        )}
                      </div>
                    ))}
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