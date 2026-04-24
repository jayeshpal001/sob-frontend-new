// src/pages/ProductDetails.tsx
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { products } from "../data/products";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { Button } from "../components/ui/Button";

// Dummy Reviews Data
const mockReviews = [
  { id: 1, user: "Elena R.", rating: 5, date: "Oct 12, 2026", text: "Absolutely mesmerizing. It lasts all day and I constantly get asked what I'm wearing. A true masterpiece." },
  { id: 2, user: "Marcus T.", rating: 5, date: "Sep 28, 2026", text: "Bold, sophisticated, and dark. The dry down is incredibly luxurious. Will definitely repurchase." },
  { id: 3, user: "Sarah J.", rating: 4, date: "Aug 15, 2026", text: "Beautiful scent profile. The packaging is stunning, though I wish the sillage was just a tiny bit stronger." }
];

export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <h1 className="font-display text-3xl">Product not found.</h1>
      </div>
    );
  }

  const scentNotes = product.scentNotes || ["Black Truffle", "Bergamot", "Black Orchid", "Plum", "Patchouli"];

  return (
    <div className="w-full min-h-screen pt-24 bg-[var(--color-surface)]">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 pb-32">
        
        {/* Back Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        {/* Top Section: Product Image & Core Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
          
          {/* Left Side: Sticky Image Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-[#f0f0f0] aspect-square md:aspect-[4/5] flex items-center justify-center p-12 relative"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-[70%] h-auto object-contain drop-shadow-2xl"
              />
              {product.badge && (
                <span className="absolute top-8 left-8 bg-black text-white text-xs font-bold uppercase tracking-widest px-4 py-2">
                  {product.badge}
                </span>
              )}
            </motion.div>
          </div>

          {/* Right Side: Product Information */}
          <div className="lg:col-span-5 flex flex-col pt-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
                Eau De Parfum — 100ML
              </span>
              <h1 className="text-5xl md:text-6xl font-display text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Quick Rating Summary */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-black text-black' : 'fill-transparent text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-sans underline cursor-pointer">4.8 (124 Reviews)</span>
              </div>

              <p className="text-2xl font-sans text-gray-500 mb-8">${product.price}</p>
              
              <p className="text-gray-600 leading-relaxed mb-10">
                {product.tagline}. A seductive, passionate composition with rich notes and deep oriental undertones. For nights that become unforgettable. Raw power meets refined luxury in every drop.
              </p>

              <Button 
                variant="primary" 
                className="w-full py-5 flex items-center justify-center gap-3 text-sm mb-12"
                onClick={() => {
                  dispatch(addToCart(product));
                  toast.success(`${product.name} Added`);
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart — ${product.price}
              </Button>
            </motion.div>

            {/* Scent Notes Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="border-t border-gray-200 pt-8">
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-6">Scent Notes</h3>
              <div className="flex flex-wrap gap-2">
                {scentNotes.map((note, idx) => (
                  <span key={idx} className="border border-gray-300 px-4 py-2 text-xs text-gray-600 uppercase tracking-wider">
                    {note}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Accordion Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12 border-t border-gray-200">
              {['Ingredients', 'Shipping & Returns'].map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 py-6 flex justify-between items-center cursor-pointer group">
                  <span className="font-sans font-bold text-xs uppercase tracking-widest group-hover:text-gray-500 transition-colors">
                    {item}
                  </span>
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Customer Reviews */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-200 pt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Reviews Summary */}
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-display text-gray-900 mb-6">Customer Reviews</h2>
              <div className="flex items-end gap-4 mb-8">
                <h1 className="text-6xl font-display leading-none">4.8</h1>
                <div className="pb-1">
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-black text-black" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Based on 124 reviews</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Write a Review</Button>
            </div>

            {/* Review List */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-white p-8 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold font-sans text-sm uppercase tracking-wider mb-1">{review.user}</h4>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-black text-black' : 'fill-transparent text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-sans">{review.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
              <button className="text-xs font-bold uppercase tracking-widest text-black underline mt-4 self-start">
                Load More Reviews
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};