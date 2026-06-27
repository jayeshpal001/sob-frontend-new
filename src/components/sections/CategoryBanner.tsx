// src/components/sections/CategoryBanner.tsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useGetUserCategoriesQuery } from "../../store/api/userApi";

const CLEAN_CATS_DEFINITION = [
  { name: "Men", slug: "men", matchers: ["men", "male"], image: "/men.jpeg" },
  { name: "Women", slug: "women", matchers: ["women", "female"], image: "/women.jpeg" },
  { name: "Unisex", slug: "unisex", matchers: ["unisex"], image: "/unisex.PNG" },
  { name: "Attar", slug: "attar", matchers: ["attar", "itra", "luxury"], image: "/attar.jpeg" },
];

export const CategoryBanner = () => {
  const navigate = useNavigate();
  
  const { data: categoriesResponse, isLoading } = useGetUserCategoriesQuery();

  const rawBackendCategories = categoriesResponse?.data || [];

  const finalCategories = CLEAN_CATS_DEFINITION.map(cleanCat => {
    const matchingBackend = rawBackendCategories.find((backendCat: { name: string; }) => 
      cleanCat.matchers.some(matcher => backendCat.name?.toLowerCase().includes(matcher))
    );

    return {
      _id: matchingBackend?._id || `fallback-${cleanCat.slug}`,
      name: cleanCat.name, 
      slug: cleanCat.slug,
      image: cleanCat.image, // Passed the image down
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
    const walk = (x - startX) * 2; 
    
    if (Math.abs(walk) > 5) {
      setHasDragged(true); 
    }
    
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleNavigation = (path: string) => {
    if (!hasDragged) {
      navigate(path);
    }
  };

  return (
    <div className="w-full bg-white py-16 lg:py-24 border-b border-gray-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            Discover
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-gray-900">
            Shop by Category
          </h2>
        </div>

        {/* Scrollable Luxury Cards Container */}
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            <div 
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex items-center gap-6 overflow-x-auto scrollbar-hide pb-8 pt-2 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              
              {/* Category Cards with Images */}
              {finalCategories.map((cat) => {
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleNavigation(`/collection?category=${cat.slug}`)} 
                    className="group relative flex-shrink-0 h-[320px] lg:h-[420px] w-[240px] lg:w-[320px] bg-gray-900 overflow-hidden flex flex-col justify-between p-6 md:p-8 text-left transition-all duration-500 hover:shadow-2xl"
                  >
                    {/* Background Image with Hover Zoom */}
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      draggable="false" // Crucial for drag-to-scroll
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1]"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500" />
                    
                    {/* Darker Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 group-hover:text-white transition-colors duration-500">
                      Collection
                    </span>

                    <div className="relative z-10 flex items-end justify-between w-full">
                      <h3 className="text-3xl lg:text-4xl font-display text-white transition-colors duration-500 drop-shadow-md">
                        {cat.name}
                      </h3>
                      <ArrowRight className="w-6 h-6 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
                    </div>
                  </button>
                );
              })}
              
            </div>

            <div className="mt-8 md:mt-12 flex justify-center md:justify-end">
              <button
                onClick={() => navigate("/collection")}
                className="group flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 text-xs font-bold uppercase tracking-[0.2em] text-black hover:border-black hover:bg-black hover:text-white transition-all duration-300"
              >
                Explore All Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};