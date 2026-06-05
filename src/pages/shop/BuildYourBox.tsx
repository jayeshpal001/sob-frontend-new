// src/pages/BuildYourBox.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Loader2, PackageOpen, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks"; 
import { addToCart } from "../../store/slices/cartSlice";
import { ProductCard } from "../../components/ui/ProductCard"; // Imported ProductCard
import {
  useGetBundleProductsQuery,
  useGetSettingsQuery,
  useAddToCartApiMutation,
} from "../../store/api/userApi"; 

interface BundleItem {
  product: any;
  quantity: number;
}

export const BuildYourBox = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [addToCartDb, { isLoading: isAddingToCart }] = useAddToCartApiMutation();

  const { data: settingsResponse, isLoading: isSettingsLoading } = useGetSettingsQuery("");
  const globalSettings = settingsResponse?.data || {};

  const BUNDLE_LIMIT = globalSettings.bundleLimit || 4;
  const BUNDLE_PRICE = globalSettings.bundlePrice || 899;
  const BUNDLE_IS_ACTIVE = globalSettings.bundleIsActive ?? true;

  const {
    data: responseData,
    isLoading: isProductsLoading,
    isError,
  } = useGetBundleProductsQuery();
  const products = responseData?.data || [];

  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);

  const totalSelected = bundleItems.reduce((total, item) => total + item.quantity, 0);

  const getImageUrl = (imgObj: any) => {
    if (!imgObj) return "/placeholder-image.png";
    const img = imgObj.url || imgObj;
    return img.startsWith("http")
      ? img
      : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/uploads/${img}`;
  };

  const handleAddToBundle = (product: any) => {
    if (totalSelected >= BUNDLE_LIMIT) {
      toast.error("Bundle is full", {
        description: `You can only select up to ${BUNDLE_LIMIT} items.`,
        style: {
          background: "#FFF0F0",
          color: "#D92D20",
          border: "1px solid #FDA29B",
          borderRadius: "0px",
        },
      });
      return;
    }

    setBundleItems((prev) => {
      const existingItem = prev.find((item) => item.product._id === product._id);
      if (existingItem) {
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromBundle = (productId: string) => {
    setBundleItems((prev) => {
      const existingItem = prev.find((item) => item.product._id === productId);
      if (existingItem?.quantity === 1) {
        return prev.filter((item) => item.product._id !== productId);
      }
      return prev.map((item) =>
        item.product._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const getItemQuantity = (productId: string) => {
    const item = bundleItems.find((i) => i.product._id === productId);
    return item ? item.quantity : 0;
  };

  const visualSlots: any[] = [];
  bundleItems.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      visualSlots.push(item.product);
    }
  });

  while (visualSlots.length < BUNDLE_LIMIT) {
    visualSlots.push(null);
  }

  const handleAddToCart = async () => {
    if (totalSelected < BUNDLE_LIMIT) {
      toast.error(`Please select ${BUNDLE_LIMIT - totalSelected} more items.`);
      return;
    }

    if (isAddingToCart) return;

    const bundlePayload = {
      _id: `bundle-${Date.now()}`,
      name: "Custom Discovery Box",
      price: BUNDLE_PRICE,
      image: getImageUrl(visualSlots[0]?.images?.[0]),
      quantity: 1,
      stock: 999, 
      isBundle: true,
      bundleContents: bundleItems.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        image: getImageUrl(item.product.images?.[0]) 
      })),
    };

    try {
      if (isAuthenticated) {
        await addToCartDb(bundlePayload).unwrap();
      }

      dispatch(addToCart(bundlePayload));
      toast.success("Bundle Added to Cart!", {
        description: "You can view it in your cart or build another one.",
        style: { background: "#111", color: "#fff", borderRadius: "0px" },
      });

      setBundleItems([]);
    } catch (error) {
      console.error("Failed to save Bundle to DB Cart:", error);
      toast.error("FAILED TO SAVE BUNDLE", {
        description: "Something went wrong while syncing your cart.",
        style: {
          background: "#FFF0F0",
          color: "#D92D20",
          border: "1px solid #FDA29B",
          borderRadius: "0px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: "10px",
          fontWeight: "bold",
        },
      });
    }
  };

  if (isProductsLoading || isSettingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-white">
        <p className="text-red-500 font-bold uppercase tracking-widest">
          Failed to load products
        </p>
      </div>
    );
  }

  if (!BUNDLE_IS_ACTIVE) {
    return (
      <div className="w-full min-h-screen pt-28 pb-40 bg-white flex flex-col items-center justify-center font-sans px-6">
        <PackageOpen className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="text-2xl font-display text-black mb-2 text-center">
          Bundle Offer Paused
        </h2>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-md">
          Our "Build Your Own Box" offer is currently taking a short break.
          Please check back later or explore our full collection.
        </p>
        <button
          onClick={() => navigate("/collection")}
          className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Explore Full Collection
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full min-h-screen pt-28 pb-40 bg-white flex flex-col items-center justify-center font-sans px-6">
        <PackageOpen className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="text-2xl font-display text-black mb-2 text-center">
          We're Curating New Minis!
        </h2>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-md">
          Our custom discovery box options are currently out of stock or being
          updated. Please check back soon to build your signature collection.
        </p>
        <button
          onClick={() => navigate("/collection")}
          className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Explore Full Collection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-28 pb-40 bg-white font-sans">
      <div className="w-full bg-gray-50 py-8 border-y border-gray-200 mb-12">
        <h1 className="text-center font-display text-3xl text-black tracking-tight">
          Buy any {BUNDLE_LIMIT} @ ₹{BUNDLE_PRICE}
        </h1>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product: any) => {
            const currentQty = getItemQuantity(product._id);
            const isMaxReached = totalSelected >= BUNDLE_LIMIT;

            return (
              <ProductCard 
                key={product._id} 
                product={product} 
                customFooter={
                  currentQty === 0 ? (
                    <button
                      onClick={(e) => { e.preventDefault(); handleAddToBundle(product); }}
                      disabled={isMaxReached || product.stock === 0}
                      className="w-full py-4 px-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] bg-white group-hover:bg-[#111] group-hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#111]"
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Bundle"}
                    </button>
                  ) : (
                    <div className="w-full h-[46px] flex items-center justify-between px-4 bg-white">
                      <button
                        onClick={(e) => { e.preventDefault(); handleRemoveFromBundle(product._id); }}
                        className="p-2 text-black hover:bg-gray-100 transition-colors rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-sm text-black">
                        {currentQty}
                      </span>
                      <button
                        onClick={(e) => { e.preventDefault(); handleAddToBundle(product); }}
                        disabled={isMaxReached}
                        className="p-2 text-black hover:bg-gray-100 transition-colors rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )
                }
              />
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-black text-white py-4 px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <span className="text-sm font-bold uppercase tracking-widest whitespace-nowrap">
              {totalSelected}/{BUNDLE_LIMIT} Selected
            </span>

            <div className="flex gap-3">
              {visualSlots.map((item, index) => (
                <div
                  key={index}
                  className="w-12 h-14 border border-gray-600 bg-gray-900 flex items-center justify-center overflow-hidden"
                >
                  <AnimatePresence mode="popLayout">
                    {item ? (
                      <motion.img
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        src={getImageUrl(item.images?.[0])}
                        alt="selected"
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest">
                Total
              </span>
              <span className="text-lg font-medium">₹{BUNDLE_PRICE}.00</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={totalSelected < BUNDLE_LIMIT || isAddingToCart}
              className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <>
                  ADDING... <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  Add to Cart <ShoppingBag className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};