// src/components/sections/FeaturedSection.tsx
import { motion } from "framer-motion";
import { ShoppingBag} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";
import { toast } from "sonner";

// High-end curated data matching the luxury vibe
const curatedProducts = [
  {
    id: "1",
    name: "Noir Absolu",
    price: 245,
    badge: "Bestseller",
    description: "A bold, intoxicating blend that captures the depth of midnight. Noir Absolu is crafted for those who dare to leave a lasting impression.",
    notes: ["Black Pepper", "Bergamot", "Cardamom", "Oud", "Amber"],
    image: "/perfume-1.jpg", 
    reverse: false,
  },
  {
    id: "4",
    name: "Obsidian Edge",
    price: 295,
    badge: "Limited Edition",
    description: "Raw power meets refined luxury. A dark, magnetic fragrance built on rare ingredients and absolute confidence.",
    notes: ["Black Truffle", "Elemi", "Pink Pepper", "Leather", "Oud"],
    image: "/perfume-4.jpg", 
    reverse: true, 
  },
];

export const FeaturedSection = () => {
  const dispatch = useAppDispatch();

  const handleAdd = (product: any) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} Added`, {
      style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }
    });
  };

  return (
    <section className="w-full bg-white py-32 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4"
          >
            Curated Selection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-display text-gray-900"
          >
            Featured Perfumes
          </motion.h2>
        </div>

        {/* Alternating Layout Grid */}
        <div className="flex flex-col space-y-32">
          {curatedProducts.map((product) => (
            <div 
              key={product.id} 
              className={`flex flex-col ${product.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}
            >
              
              {/* Image Side (50%) */}
              <div className="w-full lg:w-1/2 relative overflow-hidden bg-[#050505] aspect-[4/5] sm:aspect-square lg:aspect-[4/5] group flex items-center justify-center">
                {product.badge && (
                  <span className="absolute top-6 left-6 z-20 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 shadow-xl">
                    {product.badge}
                  </span>
                )}
                
                <motion.img
                  initial={{ scale: 1.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  src={product.image}
                  alt={product.name}
                  className="w-[60%] h-auto object-contain z-10 drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)] transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              {/* Text Side (50%) */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-display text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-display text-gray-500 mb-8 italic">
                    ${product.price}
                  </p>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-gray-600 text-sm md:text-base leading-relaxed mb-10 max-w-lg"
                >
                  {product.description}
                </motion.p>

                {/* Scent Notes */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-12"
                >
                  <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-gray-400 mb-4">Scent Notes</p>
                  <div className="flex flex-wrap gap-3">
                    {product.notes.map((note) => (
                      <span key={note} className="px-4 py-2 border border-gray-200 text-xs font-sans text-gray-600 tracking-wider hover:border-gray-900 transition-colors">
                        {note.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Buttons & Stock */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <button 
                    onClick={() => handleAdd(product)}
                    className="flex items-center justify-center gap-3 bg-[#111] text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors w-full sm:w-auto"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                  
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex items-center justify-center gap-3 bg-white border border-gray-200 text-[#111] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-gray-900 transition-colors w-full sm:w-auto"
                  >
                    Details
                  </Link>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-6 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-800 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Limited Stock Available</span>
                </motion.div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};