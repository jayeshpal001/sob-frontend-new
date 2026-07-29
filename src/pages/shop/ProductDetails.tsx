// src/pages/ProductDetails.tsx
import { useEffect, useState } from "react"; 
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, Star, Loader2, Leaf, Droplet, Sparkles, Wind } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";

// Component Imports
import { ProductReviews } from "../../components/product/ProductReviews";
import { Button } from "../../components/ui/Button"; // IMPORTED CUSTOM BUTTON

// API Hooks Import
import { 
  useGetProductByIdQuery, 
  useGetReviewsQuery,
  useAddToCartApiMutation 
} from "../../store/api/userApi";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  // Auth State
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // States
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Dynamic Variant States
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentBasePrice, setCurrentBasePrice] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);

  // Backend API Mutation
  const [addToCartDb, { isLoading: isAddingToCart }] = useAddToCartApiMutation();

  // Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  // Fetching Data
  const { data: productResponse, isLoading: isProductLoading, isError: isProductError } = useGetProductByIdQuery(id as string, { skip: !id });
  const { data: reviewsResponse } = useGetReviewsQuery(id as string, { skip: !id });

  const product = productResponse?.data;
  const reviews = reviewsResponse?.data || [];

  // Helper to format image URLs safely
  const getImageUrl = (img: string | any) => {
    if (!img) return "/placeholder-image.png";
    const imgStr = typeof img === 'string' ? img : img.url;
    if (!imgStr) return "/placeholder-image.png";
    return imgStr.startsWith('http') ? imgStr : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${imgStr}`;
  };

  // Generate Variants Logic: Combine Root Product (Default) + Variants Array
  const getAvailableVariants = () => {
    if (!product) return [];

    const baseVariant = {
      size: product.size || "Default",
      price: product.price || 0,
      basePrice: product.basePrice || product.price || 0,
      stock: product.stock || 0
    };

    const additionalVariants = Array.isArray(product.variants) ? product.variants : [];
    
    // Combine and remove duplicate sizes to prevent UI bugs
    const allVariants = [baseVariant, ...additionalVariants];
    const uniqueVariants = Array.from(new Map(allVariants.map(v => [v.size, v])).values());
    
    return uniqueVariants;
  };

  const availableVariants = getAvailableVariants();

  // Set Initial Product Data
  useEffect(() => {
    if (product && availableVariants.length > 0) {
      if (product.images && product.images.length > 0) {
        setActiveImage(getImageUrl(product.images[0]));
      } else {
        setActiveImage("/placeholder-image.png");
      }

      // Initialize with the first available variant (the root product details)
      setSelectedSize(availableVariants[0].size);
      setCurrentPrice(availableVariants[0].price);
      setCurrentBasePrice(availableVariants[0].basePrice);
      setCurrentStock(availableVariants[0].stock);
      setQuantity(1);
    }
  }, [product]);

  // Handle Size Selection
  const handleSizeSelect = (variant: any) => {
    setSelectedSize(variant.size);
    setCurrentPrice(variant.price);
    setCurrentBasePrice(variant.basePrice);
    setCurrentStock(variant.stock);
    setQuantity(1); // Reset quantity when size changes to prevent over-ordering
  };

  // Handle Add to Cart Logic
  const handleAddToCart = async () => {
    if (isAddingToCart || currentStock === 0) return;

    // Construct the payload with the selected variant details
    const cartPayload = {
      ...product,
      name: `${product.name} (${selectedSize})`,
      price: currentPrice,
      size: selectedSize,
      image: getImageUrl(product.images?.[0]),
      quantity: quantity
    };

    try {
      if (isAuthenticated) {
        await addToCartDb({ 
          productId: product._id, 
          quantity: quantity,
          size: selectedSize, 
          price: currentPrice
        }).unwrap();
      }

      dispatch(addToCart(cartPayload));
      
      toast.success(`${quantity}x ${product.name} (${selectedSize}) Added to Cart`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }
      });
      
    } catch (error) {
      console.error("Failed to add to DB Cart:", error);
      toast.error("FAILED TO ADD ITEM", {
        description: "Something went wrong while syncing your cart.",
        style: { background: '#FFF0F0', color: '#D92D20', border: '1px solid #FDA29B', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', fontWeight: 'bold' }
      });
    }
  };

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-gray-900" />
      </div>
    );
  }

  if (isProductError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-white gap-6">
        <h1 className="font-serif text-3xl text-gray-900">Product not found.</h1>
        <Link to="/collection" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 transition-colors">
          Return to Collection
        </Link>
      </div>
    );
  }

  const categoryName = product.category?.name || (typeof product.category === 'string' ? product.category : "Male Perfume");
  const tagline = product.tagline || "Long Lasting | Eau De Parfum";
  
  let scentNotes = ["Lemon", "Lavender", "Tonka", "Mandarin", "Vetiver"]; 
  if (Array.isArray(product.scentNotes) && product.scentNotes.length > 0) {
    scentNotes = product.scentNotes;
  } else if (typeof product.scentNotes === 'string' && product.scentNotes.trim() !== '') {
    scentNotes = product.scentNotes.split(',').map((n: string) => n.trim());
  }
  
  const accordionData = [
    { 
      id: 'ingredients', 
      title: 'Ingredients', 
      content: product.ingredients || "Alcohol Denat., Fragrance (Parfum), Water (Aqua), Linalool, Limonene, Citronellol, Coumarin." 
    },
    { 
      id: 'shipping', 
      title: 'Shipping & Returns', 
      content: product.shippingAndReturns || "Free standard shipping on all orders. Returns accepted within 14 days of delivery provided the item is unopened and in original packaging." 
    }
  ];
  
  const calculatedAverage = reviews.length > 0 
    ? reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviews.length 
    : 0;
  const averageRating = product.averageRating || calculatedAverage;
  const totalReviews = product.numOfReviews || reviews.length || 0;

  const getScentIcon = (note: string) => {
    const n = note.toLowerCase();
    if (n.includes('wood') || n.includes('oud') || n.includes('vetiver') || n.includes('cedar')) return <Leaf className="w-4 h-4 text-black" />;
    if (n.includes('citrus') || n.includes('lemon') || n.includes('mandarin') || n.includes('orange')) return <Sparkles className="w-4 h-4 text-black" />;
    if (n.includes('vanilla') || n.includes('tonka') || n.includes('sweet')) return <Droplet className="w-4 h-4 text-black" />;
    return <Wind className="w-4 h-4 text-black" />;
  };

  const discountPercentage = currentBasePrice > currentPrice 
    ? Math.round(((currentBasePrice - currentPrice) / currentBasePrice) * 100)
    : 0;

  return (
    <div className="w-full min-h-screen pt-24 bg-white font-sans text-gray-900">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-32">
        
        <Link to="/collection" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24">
          
          {/* Left Side: Premium Image Gallery */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-[#f8f8f8] aspect-[4/5] flex items-center justify-center p-12 relative"
            >
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={activeImage || "/placeholder-image.png"} 
                alt={product.name} 
                className="w-[75%] h-auto object-contain mix-blend-multiply"
              />
              
              {product.badge && (
                <span className="absolute top-6 left-6 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                  {product.badge}
                </span>
              )}
            </motion.div>

            {/* Clean Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((imgObj: any, idx: number) => {
                  const imgSrc = getImageUrl(imgObj);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgSrc)}
                      className={`relative w-20 h-24 flex-shrink-0 bg-[#f8f8f8] border transition-all duration-300 ${
                        activeImage === imgSrc ? 'border-black shadow-sm' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={imgSrc} alt={`View ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply p-2" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Professional Product Information */}
          <div className="lg:col-span-7 flex flex-col pt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-gray-500 mb-4 block">
                {categoryName}
              </span>
              
              {/* Elegant Serif Title with Dynamic Size */}
              <h1 className="text-4xl md:text-[2.75rem] font-serif text-gray-900 mb-3 leading-[1.15] tracking-tight">
                {product.name} | {selectedSize} | {tagline}
              </h1>

              {/* Dynamic Price Display */}
              <div className="mb-5 mt-4">
                <span className="text-2xl font-medium text-gray-900">₹{currentPrice.toLocaleString()}</span>
                {discountPercentage > 0 && (
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>Was <span className="line-through">₹{currentBasePrice.toLocaleString()}</span></span>
                    <span className="text-red-700 font-medium">({discountPercentage}% off)</span>
                  </div>
                )}
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-[#eab308] text-[#eab308]' : 'fill-transparent text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span 
                  className="text-sm text-gray-600 underline cursor-pointer hover:text-black transition-colors" 
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                >
                  {averageRating.toFixed(1)} ({totalReviews} Reviews)
                </span>
              </div>

              {/* DYNAMIC SIZE SELECTOR UI */}
              <div className="mb-8">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-3">Select Size</h4>
                <div className="flex flex-wrap gap-3">
                  {availableVariants.map((variant: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleSizeSelect(variant)}
                      className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border transition-all ${
                        selectedSize === variant.size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scent Profile & Key Notes Columns */}
              <div className="grid grid-cols-2 gap-8 border-y border-gray-200 py-6 mb-8">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Scent Profile</h4>
                  <p className="text-sm text-gray-600">{scentNotes.slice(0, 3).join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Key Notes</h4>
                  <p className="text-sm text-gray-600">{scentNotes.join(", ")}</p>
                </div>
              </div>

              {/* Styled Scent Notes Chips */}
              <div className="mb-10">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-4">Scent Notes</h4>
                <div className="flex flex-wrap gap-3">
                  {scentNotes.map((note: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-white hover:border-black transition-colors cursor-default">
                      {getScentIcon(note)}
                      <span className="text-sm text-gray-800 font-medium">{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-gray-200">
                {accordionData.map((item) => {
                  const isOpen = expandedSection === item.id;
                  return (
                    <div key={item.id} className="border-b border-gray-200">
                      <div 
                        className="py-5 flex justify-between items-center cursor-pointer group"
                        onClick={() => setExpandedSection(isOpen ? null : item.id)}
                      >
                        <span className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${isOpen ? 'text-black' : 'text-gray-900'}`}>
                          {item.title}
                        </span>
                        {isOpen ? <Minus className="w-5 h-5 text-black" /> : <Plus className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />}
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-5 text-sm text-gray-600 leading-relaxed pr-8">
                              {item.content}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/*  Action Area: Quantity, Add to Cart (UPDATED WITH CUSTOM BUTTON) */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 w-full sm:w-32 py-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={quantity <= 1}
                    className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="flex-1 text-center font-medium text-sm text-gray-900">{quantity}</span>
                  
                  {/* Plus button capped at dynamic stock */}
                  <button 
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} 
                    disabled={quantity >= currentStock}
                    className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add to Cart (CUSTOM BUTTON) */}
                <Button 
                  variant="primary"
                  disabled={currentStock === 0 || isAddingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart && <Loader2 className="w-4 h-4 animate-spin" />}
                  {currentStock === 0 
                    ? "OUT OF STOCK" 
                    : isAddingToCart 
                      ? "ADDING..." 
                      : `ADD TO CART — ₹${(currentPrice * quantity).toLocaleString()}`}
                </Button>

              </div>

              {currentStock > 0 && currentStock <= 5 && (
                <p className="text-xs text-red-600 font-medium mt-4">
                  Hurry! Only {currentStock} left in stock.
                </p>
              )}

            </motion.div>
          </div>
        </div>

        {/* Separated Product Reviews Component */}
        <ProductReviews productId={product._id} />

      </div>
    </div>
  );
};