// src/pages/Checkout.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Loader2, CreditCard, Truck } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Button } from "../../components/ui/Button";
import { clearCart } from "../../store/slices/cartSlice"; 

// API Hooks Import
import { 
  useGetCartQuery, 
  useCheckoutOrderMutation, 
  useVerifyPaymentMutation,
  useAddAddressMutation,       
  useGetDefaultAddressQuery   
} from "../../store/api/userApi";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: dbCartResponse, isLoading: isFetchingCart } = useGetCartQuery();
  const [checkoutOrder, { isLoading: isProcessing }] = useCheckoutOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  //  Address APIs
  const [addAddress] = useAddAddressMutation();
  const { data: defaultAddressResponse } = useGetDefaultAddressQuery();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    phone: "", 
    addressLine: "", 
    city: "",
    state: "",
    postalCode: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true); // Checkbox state

  useEffect(() => {
    if (defaultAddressResponse?.success && defaultAddressResponse?.data) {
      const addr = defaultAddressResponse.data;
      setFormData(prev => ({
        ...prev,
        firstName: addr.name?.split(" ")[0] || prev.firstName,
        lastName: addr.name?.split(" ").slice(1).join(" ") || prev.lastName,
        phone: addr.phone || prev.phone,
        addressLine: addr.addressLine || prev.addressLine,
        city: addr.city || prev.city,
        state: addr.state || prev.state,
        postalCode: addr.pincode || prev.postalCode,
      }));
      setSaveAddressToProfile(false); 
    }
  }, [defaultAddressResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const rawDbCart = dbCartResponse?.data || dbCartResponse || {};
  const rawDbItems = rawDbCart.items || [];
  
  const cartItems = rawDbItems.map((item: any) => {
    let imageUrl = "/placeholder-image.png";
    // Using the same robust image logic we built earlier
    if (item.product?.images && item.product.images.length > 0) {
      const img = typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0]?.url;
      if (img) {
         imageUrl = img.startsWith('http') 
          ? img 
          : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${img}`;
      }
    }
    return {
      productId: item.product?._id, 
      name: item.product?.name,
      price: item.price || item.product?.price,
      image: imageUrl,
      quantity: item.quantity,
    };
  });

  const subtotal = rawDbCart.subtotal || 0;
  const tax = rawDbCart.tax || 0;
  const total = rawDbCart.total || 0;

  const handlePlaceOrder = async () => {
    if (!formData.addressLine || !formData.city || !formData.postalCode || !formData.phone) {
      toast.error("Please fill in your complete shipping address and phone number.");
      return;
    }

    try {
      //  AUTO-SAVE ADDRESS TO PROFILE
      if (saveAddressToProfile) {
        try {
          await addAddress({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone,
            addressLine: formData.addressLine,
            city: formData.city,
            state: formData.state,
            pincode: formData.postalCode,
          }).unwrap();
        } catch (addrError) {
          console.error("Silent Address Save Failed:", addrError);
        }
      }

      const payload = {
        products: cartItems, 
        address: {
          name: `${formData.firstName} ${formData.lastName}`.trim(), 
          phone: formData.phone, 
          addressLine: formData.addressLine, 
          city: formData.city,
          state: formData.state,
          pincode: formData.postalCode, 
          country: "India"
        },
        paymentMethod: paymentMethod 
      };

      const orderResponse = await checkoutOrder(payload).unwrap();

      // SCENARIO 1: CASH ON DELIVERY
      if (paymentMethod === "COD") {
        toast.success("Order Placed Successfully via COD!");
        dispatch(clearCart()); 
        navigate("/profile"); 
        return;
      }

      // SCENARIO 2: ONLINE (RAZORPAY)
      if (paymentMethod === "ONLINE") {
        const res = await loadRazorpayScript();
        if (!res) {
          toast.error("Razorpay SDK failed to load. Please check your connection.");
          return;
        }

        const { razorpayOrder, order } = orderResponse; 

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
          amount: razorpayOrder.amount, 
          currency: razorpayOrder.currency,
          name: "SOB Luxe Fragrances",
          description: "Premium Perfume Order",
          image: "/sob-perfume-bottle.png", 
          order_id: razorpayOrder.id, 
          handler: async function (response: any) {
            try {
              toast.loading("Verifying payment...", { id: "payment-verify" });
              
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id, 
              }).unwrap();

              toast.success("Payment Successful! Order Placed.", { id: "payment-verify" });
              dispatch(clearCart()); 
              navigate("/profile"); 
              
            } catch (verifyError) {
              console.error("Verification failed:", verifyError);
              toast.error("Payment verification failed. Contact support.", { id: "payment-verify" });
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#111111", 
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error?.data?.message || "Something went wrong during checkout.");
    }
  };

  if (isFetchingCart) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white pt-24">
        <Loader2 className="w-10 h-10 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Header / Back Link */}
        <div className="mb-12">
          <Link to="/collection" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <h1 className="text-4xl font-display text-gray-900 mt-6">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Contact Info */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6">1. Contact Information</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="Email Address" 
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                  />
                  <input 
                    type="text" name="phone" value={formData.phone} onChange={handleChange} required
                    placeholder="Phone Number" 
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                  />
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                    placeholder="First Name" 
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                  />
                  <input 
                    type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                    placeholder="Last Name" 
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6">2. Shipping Address</h2>
              <div className="space-y-4">
                <input 
                  type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} required
                  placeholder="Street Address / Address Line" 
                  className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                />
                <div className="flex gap-4">
                  <input 
                    type="text" name="city" value={formData.city} onChange={handleChange} required
                    placeholder="City" 
                    className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                  />
                  <input 
                    type="text" name="state" value={formData.state} onChange={handleChange} required
                    placeholder="State / Province" 
                    className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                  />
                  <input 
                    type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required
                    placeholder="Postal Code (Pincode)" 
                    className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" 
                  />
                </div>
                
                {/*  Save Address Checkbox */}
                <div className="pt-4 flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="saveAddress" 
                    checked={saveAddressToProfile}
                    onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                    className="w-4 h-4 accent-black text-black border-gray-300 rounded-none cursor-pointer"
                  />
                  <label htmlFor="saveAddress" className="text-sm text-gray-600 cursor-pointer select-none">
                    Save this address to my profile for future orders
                  </label>
                </div>
              </div>
            </section>

            {/* Payment Method Toggle */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6 flex items-center gap-2">
                3. Payment Method <Lock className="w-4 h-4 text-gray-400" />
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div 
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`border p-6 cursor-pointer flex flex-col items-center gap-3 transition-colors ${paymentMethod === "ONLINE" ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === "ONLINE" ? 'text-black' : 'text-gray-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-center">Pay Online <br/><span className="text-[10px] font-normal text-gray-500">(Cards, UPI, NetBanking)</span></span>
                </div>

                <div 
                  onClick={() => setPaymentMethod("COD")}
                  className={`border p-6 cursor-pointer flex flex-col items-center gap-3 transition-colors ${paymentMethod === "COD" ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Truck className={`w-6 h-6 ${paymentMethod === "COD" ? 'text-black' : 'text-gray-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-center">Cash On Delivery <br/><span className="text-[10px] font-normal text-gray-500">(Pay at your doorstep)</span></span>
                </div>
              </div>

              <div className="p-6 bg-[var(--color-surface)] border border-gray-100 flex flex-col items-center justify-center py-10">
                <Button 
                  onClick={handlePlaceOrder} 
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full max-w-sm flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isProcessing ? "Processing..." : paymentMethod === "ONLINE" ? `Pay ₹${total.toLocaleString()}` : "Place Order (COD)"}
                </Button>
                {paymentMethod === "ONLINE" && (
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-4">Secured by Razorpay (256-bit Encryption)</p>
                )}
              </div>
            </section>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 bg-[var(--color-surface)] p-8 lg:p-10 border border-gray-100">
            <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-8">Order Summary</h2>
            
            <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item: any) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-white flex items-center justify-center p-2 shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-md text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-sans font-medium text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4 font-sans text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Estimated Tax (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-black font-bold text-lg pt-4 border-t border-gray-200">
                <span className="uppercase tracking-widest text-xs self-end pb-1">Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};