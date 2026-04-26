// src/components/ui/ProductCard.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner"; 
import { type Product } from "../../data/products";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} Added`, {
      style: { background: '#111', color: '#fff', borderRadius: '0px' }
    });
  };

  return (
    <motion.div 
      className="group cursor-pointer flex flex-col w-full bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-300"
      onClick={() => navigate(`/product/${product.id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image Wrapper: Adapts if your image has a dark background or is transparent */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
        
        {/* Badge: Black background, Top Left */}
        {product.badge && (
          <span className="absolute top-4 left-4 z-20 bg-black text-white text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 shadow-md">
            {product.badge}
          </span>
        )}

        {/* Product Image */}
        <motion.img
          src={product.image}
          alt={product.name}
          /* object-cover ensures it fills perfectly if your images have backgrounds baked in like the screenshot */
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105 z-10"
          loading="lazy"
        />
      </div>

      {/* Typography Section (White Background) */}
      <div className="p-6 flex flex-col bg-white flex-grow">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-display text-xl text-[#111] tracking-tight">{product.name}</h3>
          <p className="font-display text-lg text-[#111]">${product.price}</p>
        </div>
        <p className="text-sm text-gray-500 font-sans">{product.tagline}</p>
      </div>

      {/* Persistent Add to Cart Footer */}
      <div 
        className="w-full border-t border-gray-100 py-4 px-6 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] bg-white group-hover:bg-[#111] group-hover:text-white transition-colors duration-300"
        onClick={handleAddToCart}
      >
        <ShoppingBag className="w-4 h-4" />
        Add to Cart
      </div>
    </motion.div>
  );
};