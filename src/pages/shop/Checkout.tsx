// src/pages/Checkout.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Loader2,
  CreditCard,
  Truck,
  Ticket,
  X,
  Package,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Button } from "../../components/ui/Button";
import { clearCart, removeFromCart } from "../../store/slices/cartSlice";

// API Hooks Import
import {
  useGetCartQuery,
  useCheckoutOrderMutation,
  useVerifyPaymentMutation,
  useAddAddressMutation,
  useGetDefaultAddressQuery,
  useApplyCouponMutation,
  useGetSettingsQuery,
  useRemoveItemFromCartApiMutation,
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
  const [removeCartItemDb] = useRemoveItemFromCartApiMutation();

  // Fetch Dynamic Settings (Tax & Delivery)
  const { data: settingsResponse } = useGetSettingsQuery("");
  const settings = settingsResponse?.data || {
    taxPercentage: 18,
    deliveryCharge: 100,
    freeDeliveryThreshold: 1500,
  };

  const [checkoutOrder, { isLoading: isProcessing }] =
    useCheckoutOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // Address APIs
  const [addAddress] = useAddAddressMutation();
  const { data: defaultAddressResponse } = useGetDefaultAddressQuery();

  // Coupon API
  const [applyCouponApi, { isLoading: isApplying }] = useApplyCouponMutation();

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

  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">(
    "ONLINE",
  );
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    if (defaultAddressResponse?.success && defaultAddressResponse?.data) {
      const addr = defaultAddressResponse.data;
      setFormData((prev) => ({
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

  // Logic to remove item from Checkout Page
  const handleRemoveItem = async (productId: string) => {
    dispatch(removeFromCart(productId)); // Instant UI update
    if (user) {
      try {
        await removeCartItemDb(productId).unwrap(); // Background DB sync
        toast.success("Item removed from checkout");
      } catch (error) {
        toast.error("Failed to remove item");
      }
    }
  };

  const rawDbCart = dbCartResponse?.data || dbCartResponse || {};
  const rawDbItems = rawDbCart.items || [];

  const cartItems = rawDbItems.map((item: any) => {
    if (item.isBundle) {
      return {
        productId: item._id,
        name: item.name || "Custom Discovery Box",
        price: item.price,
        image: item.image || "/placeholder-image.png",
        quantity: item.quantity,
        isBundle: true,
        bundleContents: item.bundleContents,
      };
    }
    let imageUrl = "/placeholder-image.png";
    if (item.product?.images && item.product.images.length > 0) {
      const img =
        typeof item.product.images[0] === "string"
          ? item.product.images[0]
          : item.product.images[0]?.url;
      if (img) {
        imageUrl = img.startsWith("http")
          ? img
          : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/uploads/${img}`;
      }
    }
    return {
      productId: item.product?._id,
      name: item.product?.name,
      price: item.price || item.product?.price,
      image: imageUrl,
      quantity: item.quantity,
      isBundle: false,
    };
  });

  const subtotal = cartItems.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0,
  );
  const tax = (subtotal * settings.taxPercentage) / 100;
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : settings.deliveryCharge;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal + tax + deliveryFee - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await applyCouponApi({
        code: couponCode,
        cartTotal: subtotal,
      }).unwrap();
      setAppliedCoupon(res.data);
      toast.success("Coupon applied successfully!", {
        style: { background: "#111", color: "#fff", borderRadius: "0px" },
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid Coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePlaceOrder = async () => {
    if (
      !formData.addressLine ||
      !formData.city ||
      !formData.postalCode ||
      !formData.phone
    ) {
      toast.error(
        "Please fill in your complete shipping address and phone number.",
      );
      return;
    }

    try {
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

      const payload: any = {
        products: cartItems,
        address: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          pincode: formData.postalCode,
          country: "India",
        },
        paymentMethod: paymentMethod,
      };

      if (appliedCoupon) {
        payload.couponCode = appliedCoupon.couponCode;
      }

      const orderResponse = await checkoutOrder(payload).unwrap();

      if (paymentMethod === "COD") {
        toast.success("Order Placed Successfully via COD!");
        dispatch(clearCart());
        navigate("/profile");
        return;
      }

      if (paymentMethod === "ONLINE") {
        const res = await loadRazorpayScript();
        if (!res) {
          toast.error(
            "Razorpay SDK failed to load. Please check your connection.",
          );
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

              toast.success("Payment Successful! Order Placed.", {
                id: "payment-verify",
              });
              dispatch(clearCart());
              navigate("/profile");
            } catch (verifyError) {
              console.error("Verification failed:", verifyError);
              toast.error("Payment verification failed. Contact support.", {
                id: "payment-verify",
              });
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
      toast.error(
        error?.data?.message || "Something went wrong during checkout.",
      );
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
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <h1 className="text-4xl font-display text-gray-900 mt-6">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Contact Info */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6">
                1. Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address"
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number"
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name"
                    className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6">
                2. Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                  placeholder="Street Address / Address Line"
                  className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="State / Province"
                    className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="Postal Code (Pincode)"
                    className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Save Address Checkbox */}
                <div className="pt-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddressToProfile}
                    onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                    className="w-4 h-4 accent-black text-black border-gray-300 rounded-none cursor-pointer"
                  />
                  <label
                    htmlFor="saveAddress"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                  >
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
                  className={`border p-6 cursor-pointer flex flex-col items-center gap-3 transition-colors ${paymentMethod === "ONLINE" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <CreditCard
                    className={`w-6 h-6 ${paymentMethod === "ONLINE" ? "text-black" : "text-gray-400"}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest text-center">
                    Pay Online <br />
                    <span className="text-[10px] font-normal text-gray-500">
                      (Cards, UPI, NetBanking)
                    </span>
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`border p-6 cursor-pointer flex flex-col items-center gap-3 transition-colors ${paymentMethod === "COD" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Truck
                    className={`w-6 h-6 ${paymentMethod === "COD" ? "text-black" : "text-gray-400"}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest text-center">
                    Cash On Delivery <br />
                    <span className="text-[10px] font-normal text-gray-500">
                      (Pay at your doorstep)
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-6 bg-[var(--color-surface)] border border-gray-100 flex flex-col items-center justify-center py-10">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full max-w-sm flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : null}
                  {isProcessing
                    ? "Processing..."
                    : paymentMethod === "ONLINE"
                      ? `Pay ₹${Math.round(finalTotal).toLocaleString()}`
                      : "Place Order (COD)"}
                </Button>
                {paymentMethod === "ONLINE" && (
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-4">
                    Secured by Razorpay (256-bit Encryption)
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 bg-[var(--color-surface)] p-8 lg:p-10 border border-gray-100">
            <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-8">
              Order Summary
            </h2>

            {/* Products List */}
            <div
              className="flex flex-col gap-6 mb-8 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar overscroll-contain"
              style={{ overscrollBehavior: "contain" }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item: any) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-white flex items-center justify-center p-2 shrink-0 border border-gray-100 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-md text-gray-900 flex items-center gap-2">
                        {item.name}
                        {item.isBundle && (
                          <Package className="w-3 h-3 text-gray-400" />
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                        Qty: {item.quantity}
                      </p>

                      {/* PREMIUM THUMBNAIL UI FOR BUNDLE CONTENTS */}
                      {item.isBundle &&
                        item.bundleContents &&
                        item.bundleContents.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.bundleContents.map(
                              (content: any, i: number) => {
                                // Smart Fallback Avatar API
                                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(content.name)}&background=f9fafb&color=000&size=64&font-size=0.4`;

                                // Format URL securely
                                const imgUrl = content.image
                                  ? content.image.startsWith("http")
                                    ? content.image
                                    : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/uploads/${content.image}`
                                  : avatarUrl;

                                return (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 p-1 pr-2.5 rounded-full"
                                  >
                                    <div className="w-5 h-5 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                      <img
                                        src={imgUrl}
                                        alt={content.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = avatarUrl;
                                        }}
                                      />
                                    </div>
                                    <span className="text-[9px] text-gray-600 font-medium whitespace-nowrap">
                                      {content.name.substring(0, 12)}
                                      {content.name.length > 12
                                        ? ".."
                                        : ""}{" "}
                                      <span className="font-bold text-black">
                                        x{content.quantity}
                                      </span>
                                    </span>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        )}
                    </div>

                    {/* ADDED TRASH BUTTON HERE */}
                    <div className="flex flex-col items-end justify-between h-full gap-2 py-1">
                      <p className="font-sans font-medium text-sm text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ====== COUPON COMPONENT ====== */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="ENTER COUPON CODE"
                    className="flex-1 border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest bg-white"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplying || !couponCode}
                    className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {isApplying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-100 p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Ticket className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-widest">
                      {appliedCoupon.couponCode} APPLIED
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-green-700">
                      - ₹{appliedCoupon.discountAmount.toLocaleString()}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* ====== END COUPON ====== */}

            {/* Calculations Breakdown */}
            <div className="space-y-4 font-sans text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({appliedCoupon.couponCode})</span>
                  <span>
                    - ₹{appliedCoupon.discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Dynamic Tax Calculation */}
              <div className="flex justify-between text-gray-500">
                <span>Tax ({settings.taxPercentage}%)</span>
                <span>₹{Math.round(tax).toLocaleString()}</span>
              </div>

              {/* Dynamic Delivery Calculation */}
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Delivery
                </span>
                <span>
                  {isFreeDelivery ? (
                    <span className="text-[10px] bg-green-50 text-green-600 font-bold uppercase tracking-widest px-2 py-1 border border-green-200">
                      Free
                    </span>
                  ) : (
                    `₹${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-black font-bold text-lg pt-4 border-t border-gray-200">
                <span className="uppercase tracking-widest text-xs self-end pb-1">
                  Total
                </span>
                <span>₹{Math.round(finalTotal).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
