// src/components/common/SearchModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeSearch } from "../../store/uiSlice";
import { products } from "../../data/products"; // Using our local dummy data for instant search

export const SearchModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSearchOpen } = useAppSelector((state) => state.ui);
  const [query, setQuery] = useState("");

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeSearch());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  // Instant filter logic
  const filteredProducts = query 
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.tagline.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelectProduct = (id: string) => {
    dispatch(closeSearch());
    setQuery("");
    navigate(`/product/${id}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeSearch())}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[70]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white shadow-2xl z-[80] overflow-hidden flex flex-col"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center p-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input
                type="text"
                autoFocus
                placeholder="Search for fragrances, notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 px-4 text-lg outline-none placeholder:text-gray-300 font-display"
              />
              <button 
                onClick={() => dispatch(closeSearch())}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            {query && (
              <div className="max-h-[60vh] overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50/50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="flex items-center gap-4 p-3 hover:bg-white border border-transparent hover:border-gray-100 cursor-pointer transition-all group"
                    >
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-[var(--color-surface)]" />
                      <div>
                        <h4 className="font-display text-lg group-hover:text-black text-gray-800 transition-colors">{product.name}</h4>
                        <p className="font-sans text-xs text-gray-500 uppercase tracking-widest">{product.price} USD</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 font-sans text-sm">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}
            
            {/* Helper text */}
            {!query && (
              <div className="p-6 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Try searching for "Noir" or "Blanc"
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};