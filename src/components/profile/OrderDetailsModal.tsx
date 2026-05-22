// src/components/profile/OrderDetailsModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, Truck, Check, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useGetOrderDetailsQuery } from "../../store/api/userApi";

interface OrderDetailsModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const OrderDetailsModal = ({ orderId, onClose }: OrderDetailsModalProps) => {
  const navigate = useNavigate(); 

  const { data: response, isLoading } = useGetOrderDetailsQuery(orderId || "", {
    skip: !orderId, 
  });

  const order = response?.data;

  // Tracking Timeline Logic
  const trackingSteps = ["pending", "confirmed", "shipped", "delivered"];
  const currentStepIndex = order ? trackingSteps.indexOf(order.status) : 0;
  const isCancelled = order?.status === "cancelled";

  const handleProductClick = (productId: string) => {
    onClose(); 
    navigate(`/product/${productId}`); 
  };

  const getImageUrl = (images: any) => {
    // Array nahi hai ya khali hai toh placeholder dikhao
    if (!images || !Array.isArray(images) || images.length === 0) return "/placeholder-image.png";
    
    const imgPath = typeof images[0] === 'string' ? images[0] : images[0]?.url;
    
    if (!imgPath) return "/placeholder-image.png";

    return imgPath.startsWith('http') 
      ? imgPath 
      : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${imgPath}`;
  };

  return (
    <AnimatePresence>
      {orderId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white shadow-2xl z-[90] max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="font-display text-2xl text-gray-900">Order Details</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                  ID: {orderId.toUpperCase()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-4" />
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Fetching Order...</p>
                </div>
              ) : !order ? (
                <div className="text-center py-20 text-gray-500">Order not found.</div>
              ) : (
                <div className="space-y-10">
                  
                  {/* Visual Tracking Timeline */}
                  <div className="bg-white border border-gray-100 p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Track Status</h3>
                    
                    {isCancelled ? (
                      <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 border border-red-100">
                        <XCircle className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-widest">Order Cancelled</span>
                      </div>
                    ) : (
                      <div className="relative flex justify-between items-center w-full max-w-md mx-auto">
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                        <div 
                          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{ width: `${(Math.max(0, currentStepIndex) / (trackingSteps.length - 1)) * 100}%` }}
                        ></div>

                        {/* Steps */}
                        {trackingSteps.map((step, index) => {
                          const isCompleted = index <= currentStepIndex;
                          const isActive = index === currentStepIndex;
                          
                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                {isCompleted ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                              </div>
                              <span className={`text-[9px] uppercase tracking-widest font-bold ${isActive ? 'text-gray-900' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Purchased Items</h3>
                    <div className="space-y-4">
                      {order.products.map((item: any) => (
                        <div key={item._id} className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-4 cursor-pointer group"
                            onClick={() => handleProductClick(item.productId._id)}
                          >
                            <div className="w-12 h-16 bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:border-black transition-colors">
                              <img src={getImageUrl(item.productId.images)} alt="Product" className="w-full h-full object-contain p-1" />
                            </div>
                            <div>
                              <p className="font-display text-sm text-gray-900 group-hover:underline">{item.productId.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <p className="font-sans font-medium text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Billing Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Shipping Address */}
                    <div className="bg-gray-50 p-5 border border-gray-100">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                        <Truck className="w-3 h-3" /> Delivery Details
                      </h3>
                      <p className="font-sans text-xs text-gray-700 leading-relaxed">
                        <span className="font-bold text-gray-900 block mb-1">{order.address.name}</span>
                        {order.address.addressLine}<br/>
                        {order.address.city}, {order.address.state} - {order.address.pincode}<br/>
                        <span className="block mt-2 font-mono text-gray-500">PH: {order.address.phone}</span>
                      </p>
                    </div>

                    {/* Billing Summary */}
                    <div className="bg-gray-50 p-5 border border-gray-100">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Payment Summary
                      </h3>
                      <div className="space-y-2 text-xs font-sans">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span>₹{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Tax (18%)</span>
                          <span>₹{order.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200 mt-2">
                          <span>Total Paid</span>
                          <span>₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Method</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white border border-gray-200">{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};