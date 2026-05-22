// src/components/common/CartDrawer.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  toggleCart,
  removeFromCart,
  updateQuantity,
} from "../../store/slices/cartSlice";
import { Button } from "../ui/Button";

// API Hooks Import
import { 
  useGetCartQuery, 
  useUpdateCartApiMutation, 
  useRemoveItemFromCartApiMutation 
} from "../../store/api/userApi";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Auth & Local State
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: reduxItems, isOpen } = useAppSelector((state) => state.cart);

  // Backend API Queries & Mutations
  const { data: dbCartResponse, isLoading: isFetchingCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, 
  });
  
  const [updateCartDb] = useUpdateCartApiMutation();
  const [removeCartItemDb] = useRemoveItemFromCartApiMutation();

  // Smart Data Normalization
  // DB send raw object, so we handle it securely
  const rawDbCart = dbCartResponse?.data || dbCartResponse || {};
  const rawDbItems = rawDbCart.items || [];
  
  const cartItems = isAuthenticated 
    ? rawDbItems.map((item: any) => {
        let imageUrl = "/placeholder-image.png";
        if (item.product?.images && item.product.images.length > 0) {
          const img = item.product.images[0].url || item.product.images[0];
          imageUrl = img.startsWith('http') 
            ? img 
            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${img}`;
        }

        return {
          _id: item.product?._id, 
          name: item.product?.name,
          price: item.price || item.product?.price,
          image: imageUrl,
          quantity: item.quantity,
          stock: item.product?.stock || 0 
        };
      })
    : reduxItems;

  // SMART BILLING EXTRACTION
  // Use DB values if logged in, otherwise fallback to manual calculation for guests
  const subtotal = isAuthenticated && rawDbCart.subtotal !== undefined 
    ? rawDbCart.subtotal 
    : cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);

  // Default guest tax calculation (assuming 10% based on your backend response 150 for 1500)
  const tax = isAuthenticated && rawDbCart.tax !== undefined 
    ? rawDbCart.tax 
    : subtotal * 0.10;

  const total = isAuthenticated && rawDbCart.total !== undefined 
    ? rawDbCart.total 
    : subtotal + tax;

  // Handlers for API + Redux Sync
  const handleUpdateQuantity = async (productId: string, currentQuantity: number, change: number, stockLimit: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    //  STOCK VALIDATION
    if (change > 0 && newQuantity > stockLimit) {
      toast.error("STOCK LIMIT REACHED", {
        description: `Only ${stockLimit} units available.`,
        style: { background: '#FFF0F0', color: '#D92D20', border: '1px solid #FDA29B', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', fontWeight: 'bold' }
      });
      return;
    }

    // 1. Instant UI update
    dispatch(updateQuantity({ _id: productId, quantity: newQuantity }));

    // 2. Background DB Sync
    if (isAuthenticated) {
      try {
        await updateCartDb({ productId, quantity: newQuantity }).unwrap();
      } catch (error) {
        console.error("Cart Update Failed:", error);
        toast.error("Failed to sync quantity");
        dispatch(updateQuantity({ _id: productId, quantity: currentQuantity })); // Rollback
      }
    }
  };

  const handleRemoveItem = async (productId: string) => {
    dispatch(removeFromCart(productId));

    if (isAuthenticated) {
      try {
        await removeCartItemDb(productId).unwrap();
        toast.success("Item removed from cart", {
          style: { background: '#111', color: '#fff', borderRadius: '0px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }
        });
      } catch (error) {
        console.error("Cart Delete Failed:", error);
        toast.error("Failed to remove item");
      }
    } else {
      toast.success("Item removed from cart", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart())}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display text-2xl flex items-center gap-2">
                Your Cart
                {isFetchingCart && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              </h2>
              <button
                onClick={() => dispatch(toggleCart())}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X strokeWidth={1.5} className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <p className="font-sans text-sm uppercase tracking-widest">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                cartItems.map((item: any) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-[#050505] flex items-center justify-center p-2 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-display text-lg leading-none text-gray-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 font-sans">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 border border-gray-200 px-2 py-1 bg-white">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity, -1, item.stock)}
                            className="hover:text-gray-600 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity, 1, item.stock)}
                            className="hover:text-gray-600 transition-colors disabled:opacity-50"
                            disabled={item.quantity >= item.stock} // Automatically disable if max stock reached
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Remove Item */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/*  Footer / Checkout with Detailed Billing */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white">
                
                {/* Billing Details */}
                <div className="space-y-3 mb-6 font-sans">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Estimated Tax</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold text-gray-900 border-t border-gray-100 pt-3 mt-3">
                    <span className="uppercase tracking-widest text-xs">Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em]"
                  onClick={() => {
                    dispatch(toggleCart()); 
                    navigate("/checkout"); 
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};