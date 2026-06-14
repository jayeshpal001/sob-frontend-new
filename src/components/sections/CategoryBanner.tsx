// src/components/sections/CategoryBanner.tsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useGetUserCategoriesQuery } from "../../store/api/userApi";

const CLEAN_CATS_DEFINITION = [
  { name: "Men", slug: "men", matchers: ["men", "male"] },
  { name: "Women", slug: "women", matchers: ["women", "female"] },
  { name: "Unisex", slug: "unisex", matchers: ["unisex"] },
  { name: "Attar", slug: "attar", matchers: ["attar", "itra", "luxury"] },
];

export const CategoryBanner = () => {
  const navigate = useNavigate();
  
  // Fetching categories from backend
  const { data: categoriesResponse, isLoading } = useGetUserCategoriesQuery();

  const rawBackendCategories = categoriesResponse?.data || [];

  // SMART MAPPING
  const finalCategories = CLEAN_CATS_DEFINITION.map(cleanCat => {
    const matchingBackend = rawBackendCategories.find((backendCat: { name: string; }) => 
      cleanCat.matchers.some(matcher => backendCat.name?.toLowerCase().includes(matcher))
    );

    return {
      _id: matchingBackend?._id || `fallback-${cleanCat.slug}`,
      name: cleanCat.name, 
      slug: cleanCat.slug, 
    };
  });

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false); 

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasDragged(false); 
    if (sliderRef.current) {
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    
    // If mouse moved more than 5px, consider it a drag
    if (Math.abs(walk) > 5) {
      setHasDragged(true); 
    }
    
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Smart Navigation: Only navigate if the user clicked, NOT if they dragged
  const handleNavigation = (path: string) => {
    if (!hasDragged) {
      navigate(path);
    }
  };

  return (
    <div className="w-full bg-white py-12 lg:py-20 border-b border-gray-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-display text-gray-900">Shop by Category</h2>
        </div>

        {/* Scrollable Luxury Cards Container */}
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-[320px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-6 overflow-x-auto scrollbar-hide pb-8 pt-2 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            
            {/* Category Cards */}
            {finalCategories.map((cat) => {
              return (
                <button
                  key={cat._id}
                  onClick={() => handleNavigation(`/collection?category=${cat.slug}`)} // 🚀 Smart Click
                  className="group relative flex-shrink-0 h-[280px] lg:h-[350px] w-[220px] lg:w-[280px] bg-[#F9FAFB] border border-gray-100 overflow-hidden flex flex-col justify-between p-6 md:p-8 text-left transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-[#111] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />

                  <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    Collection
                  </span>

                  <div className="relative z-10 flex items-end justify-between w-full">
                    <h3 className="text-3xl lg:text-4xl font-display text-black group-hover:text-white transition-colors duration-500">
                      {cat.name}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
                  </div>
                </button>
              );
            })}
            
            {/* Explore More Card */}
            <button
              onClick={() => handleNavigation("/collection")} // 🚀 Smart Click
              className="group relative flex-shrink-0 h-[280px] lg:h-[350px] w-[220px] lg:w-[280px] bg-white border border-gray-200 overflow-hidden flex flex-col justify-center items-center p-6 md:p-8 text-center transition-all duration-500 hover:border-black"
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">
                Explore All
              </span>
              <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
};