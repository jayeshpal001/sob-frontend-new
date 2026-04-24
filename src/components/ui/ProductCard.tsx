// src/components/ui/ProductCard.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner"; 
import {type Product } from "../../data/products";
import { Button } from "./Button";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.name} Added`);
  };

  return (
    <motion.div 
      className="group cursor-pointer flex flex-col gap-4 w-full"
      onClick={() => navigate(`/product/${product.id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
        {product.badge && (
          <span className="absolute top-4 left-4 z-20 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
            {product.badge}
          </span>
        )}

        <motion.img
          src={product.image}
          alt={product.name}
          className="w-[60%] h-auto object-contain drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-110 z-10"
          loading="lazy"
        />

        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          {/* ONACTION YAHAN UPDATE KIYA */}
          <Button variant="primary" className="w-full flex items-center justify-center gap-2 py-3" onClick={handleAddToCart}>
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-xl text-black">{product.name}</h3>
          <p className="font-sans font-medium text-black">${product.price}</p>
        </div>
        <p className="text-sm text-gray-500 font-sans">{product.tagline}</p>
      </div>
    </motion.div>
  );
};