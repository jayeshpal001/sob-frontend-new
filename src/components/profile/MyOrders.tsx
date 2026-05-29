// src/components/profile/MyOrders.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Loader2, CheckCircle2, Clock, XCircle, Ticket } from "lucide-react"; // <-- Ticket import kiya
import { toast } from "sonner";
import { Button } from "../ui/Button";

// Imported the cancel mutation here
import { useGetMyOrdersQuery, useCancelOrderMutation } from "../../store/api/userApi";
import { OrderDetailsModal } from "./OrderDetailsModal";

export const MyOrders = () => {
  const { data: ordersResponse, isLoading: isLoadingOrders } = useGetMyOrdersQuery();
  
  // Initialized the cancel order hook
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const myOrders = ordersResponse?.data || [];

  // Implemented the actual API call logic
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    
    try {
      toast.loading("Cancelling order...", { id: "cancel-toast" });
      await cancelOrder(orderId).unwrap();
      toast.success("Order cancelled successfully", { id: "cancel-toast" });
    } catch (error: any) {
      console.error("Cancel failed", error);
      toast.error(error?.data?.message || "Failed to cancel order", { id: "cancel-toast" });
    }
  };

  return (
    <>
      <OrderDetailsModal 
        orderId={selectedOrderId} 
        onClose={() => setSelectedOrderId(null)} 
      />

      <motion.div
        key="orders"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        // Optional visual indicator while cancelling
        className={isCancelling ? "opacity-70 pointer-events-none transition-opacity" : ""}
      >
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
            <Package className="w-5 h-5" /> Recent Orders
          </h2>
        </div>

        {isLoadingOrders ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : myOrders.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
            <Package className="w-8 h-8 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No orders yet.</p>
            <p className="text-xs text-gray-400 mt-1">Your luxury purchases will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {myOrders.map((order: any) => (
              <div key={order._id} className="p-6 bg-[var(--color-surface)] border border-gray-100 hover:border-black transition-colors duration-300">
                
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono text-xs font-semibold text-gray-900">{order._id.toUpperCase()}</p>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Date</p>
                    <p className="font-sans text-xs font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-6">
                  {/* Products Summary */}
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Items</p>
                    <p className="font-sans text-sm font-medium text-gray-800">
                      {order.products?.length || 0} {order.products?.length === 1 ? 'Product' : 'Products'} Totaling ₹{order.totalAmount?.toLocaleString() || 0}
                    </p>
                    
                    {/*  COUPON HIGHLIGHT */}
                    {order.couponCode && order.discountAmount > 0 && (
                      <p className="text-xs font-bold text-green-600 mt-1 flex items-center gap-1 uppercase tracking-widest">
                        <Ticket className="w-3 h-3" /> {order.couponCode} APPLIED (-₹{order.discountAmount.toLocaleString()})
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 border border-gray-200 uppercase tracking-wider font-bold">
                        {order.paymentMethod}
                      </span>
                      {order.paymentStatus === 'paid' ? (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-green-600 bg-green-50 px-2 py-1 border border-green-100">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : order.paymentStatus === 'failed' ? (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-red-600 bg-red-50 px-2 py-1 border border-red-100">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-orange-500 bg-orange-50 px-2 py-1 border border-orange-100">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Shipping Summary */}
                  <div className="flex-1 md:text-right space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Shipped To</p>
                    <p className="font-sans text-xs text-gray-700 leading-relaxed">
                      <span className="font-bold block mb-1">{order.address?.name}</span>
                      {order.address?.addressLine}<br/>
                      {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                    </p>
                  </div>
                </div>

                {/* Status Footer & Actions */}
                <div className="bg-white p-4 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'confirmed' || order.status === 'delivered' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
                      Status: {order.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={isCancelling} 
                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        Cancel Order
                      </button>
                    )}
                    <Button 
                      variant="outline" 
                      className="py-2 px-6 text-[10px] w-full sm:w-auto" 
                      onClick={() => setSelectedOrderId(order._id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};