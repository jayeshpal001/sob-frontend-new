// src/components/sections/ProductGrid.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useGetAllProductsQuery } from "../../store/api/userApi"; 
import { ProductCard } from "../ui/ProductCard";

export const ProductGrid = () => {
  const { data: response, isLoading, isError } = useGetAllProductsQuery();

  const products = response?.data || [];
  
  // 🚀 Smart Filter: Only keeps products with "Best" or "New" in their badge, then takes the top 4
  const featuredProducts = products.filter((product: any) => {
    const badge = product.badge?.toLowerCase() || "";
    return badge.includes("best") || badge.includes("new");
  }).slice(0, 4);

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4"
          >
            Top Picks
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display text-gray-900 mb-6"
          >
            Bestsellers & New Arrivals
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-600 max-w-lg mx-auto text-sm leading-relaxed"
          >
            Discover the most loved and latest additions to our luxury collection.
          </motion.p>
        </div>

        {/* Dynamic Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-gray-500 font-sans text-sm tracking-widest uppercase">
            Unable to load the collection at this moment.
          </div>
        ) : featuredProducts.length > 0 ? (
          /* 🚀 UPDATED GRID: 2 cols on mobile, 3 on tablet, 4 on desktop (Makes cards smaller & compact) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {featuredProducts.map((product: any, index: number) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-sans text-sm tracking-widest uppercase">
            No featured products found.
          </div>
        )}

        {/* View All Collection Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <Link to="/collection" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-[#111] hover:text-gray-600 transition-colors">
            Explore Full Collection
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};