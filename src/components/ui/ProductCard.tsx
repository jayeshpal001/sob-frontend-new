// src/components/ui/ProductCard.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner"; 
import { useAppDispatch, useAppSelector } from "../../store/hooks"; 
import { addToCart, type Product } from "../../store/slices/cartSlice";
import { useAddToCartApiMutation } from "../../store/api/userApi"; 

interface ProductCardProps {
  product: Product | any; 
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Auth State & Backend API
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [addToCartDb, { isLoading }] = useAddToCartApiMutation();

  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url || product.images[0];
    }
    return product.image || "/placeholder-image.png"; // Fallback
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    
    // Prevent multiple clicks while API is processing
    if (isLoading) return;
    
    try {
      // 1. If Logged In: Sync with MongoDB Cart
      if (isAuthenticated) {
        // Assuming your backend expects { productId, quantity }
        await addToCartDb({ productId: product._id, quantity: 1 }).unwrap();
      }

      // 2. Always update local Redux state for instant snappy UI feedback
      dispatch(addToCart(product));
      
      toast.success(`${product.name} Added to Cart`, {
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

  return (
    <motion.div 
      className="group cursor-pointer flex flex-col w-full bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-300"
      onClick={() => navigate(`/product/${product._id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image Wrapper */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
        
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 z-20 bg-black text-white text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 shadow-md">
            {product.badge}
          </span>
        )}

        {/* Product Image */}
        <motion.img
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105 z-10"
          loading="lazy"
        />
      </div>

      {/* Typography Section */}
      <div className="p-6 flex flex-col bg-white flex-grow">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-display text-xl text-[#111] tracking-tight">{product.name}</h3>
          <p className="font-display text-lg text-[#111]">${product.price}</p>
        </div>
        <p className="text-sm text-gray-500 font-sans">{product.tagline || product.description?.substring(0, 50) + "..."}</p>
      </div>

      {/* Persistent Add to Cart Footer */}
      <div 
        className="w-full border-t border-gray-100 py-4 px-6 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] bg-white group-hover:bg-[#111] group-hover:text-white transition-colors duration-300 disabled:opacity-50"
        onClick={handleAddToCart}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShoppingBag className="w-4 h-4" />
        )}
        {isLoading ? "ADDING..." : "ADD TO CART"}
      </div>
    </motion.div>
  );
};