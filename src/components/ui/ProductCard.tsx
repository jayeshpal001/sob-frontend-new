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
  customFooter?: React.ReactNode; 
}

export const ProductCard = ({ product, index = 0, customFooter }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [addToCartDb, { isLoading }] = useAddToCartApiMutation();

  const getImageUrl = () => {
    const imgObj = product.images && product.images.length > 0 ? product.images[0] : product.image;
    
    if (!imgObj) return "/placeholder-image.png";
    const imgStr = typeof imgObj === 'string' ? imgObj : imgObj.url;
    if (!imgStr) return "/placeholder-image.png";
    
    return imgStr.startsWith('http') ? imgStr : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${imgStr}`;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    
    if (isLoading) return;
    
    try {

      const cartPayload = {
        ...product,
        size: product.size || "100ML", // Default fallback if no size is selected on homepage
        image: getImageUrl(),
        quantity: 1
      };

      if (isAuthenticated) {
        await addToCartDb({ 
          productId: product._id, 
          quantity: 1,
          size: cartPayload.size,
          price: product.price
        }).unwrap();
      }

      // Send the formatted payload instead of the raw product
      dispatch(addToCart(cartPayload));
      
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
      className="group cursor-pointer flex flex-col w-full bg-white border border-gray-200 hover:border-gray-400 transition-colors duration-300 h-full"
      onClick={() => navigate(`/product/${product._id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
        
        {product.badge && (
          <span className="absolute top-2 left-2 md:top-4 md:left-4 z-20 bg-black text-white text-[7px] md:text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 md:px-3 md:py-1.5 shadow-md">
            {product.badge}
          </span>
        )}

        <motion.img
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105 z-10"
          loading="lazy"
        />
      </div>

      <div className="p-3 md:p-6 flex flex-col bg-white flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-display text-sm md:text-xl text-[#111] tracking-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="font-display text-xs md:text-lg text-[#111] whitespace-nowrap">
            ₹{product.price}
          </p>
        </div>
        <p className="text-[10px] md:text-sm text-gray-500 font-sans line-clamp-2 md:line-clamp-none">
          {product.tagline || product.description?.substring(0, 50) + "..."}
        </p>
      </div>

      <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
        {customFooter ? (
          <div className="w-full border-t border-gray-100 bg-white">
            {customFooter}
          </div>
        ) : (
          <div 
            className="w-full border-t border-gray-100 py-3 md:py-4 px-2 md:px-6 flex items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] bg-white group-hover:bg-[#111] group-hover:text-white transition-colors duration-300 disabled:opacity-50"
            onClick={handleAddToCart}
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
            ) : (
              <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
            )}
            {isLoading ? "ADDING..." : "ADD TO CART"}
          </div>
        )}
      </div>
    </motion.div>
  );
};