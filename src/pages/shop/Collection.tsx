// src/pages/Collection.tsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProductsQuery, useGetUserCategoriesQuery } from "../../store/api/userApi"; 
import { ProductCard } from "../../components/ui/ProductCard";
import { ProductSkeleton } from "../../components/ui/ProductSkeleton";

const getCleanCategory = (rawName: string) => {
  if (!rawName) return "unisex";
  const lower = rawName.toLowerCase();
  if (lower.includes("female") || lower.includes("women")) return "women";
  if (lower.includes("men") || lower.includes("male")) return "men";
  if (lower.includes("unisex")) return "unisex";
  if (lower.includes("luxury") || lower.includes("attar") || lower.includes("itra")) return "attar";
  return lower;
};

export const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category")?.toLowerCase() || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(urlCategory); 
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setSelectedCategory(searchParams.get("category")?.toLowerCase() || "all");
  }, [searchParams]);

  const { data: responseData, isLoading, isError } = useGetAllProductsQuery("");
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetUserCategoriesQuery();

  const rawProducts = responseData?.data || [];
  const categories = categoriesResponse?.data || [];

  const filteredProducts = rawProducts.filter((p: any) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const rawCatName = p.category?.name || p.category || "";
    const cleanCatName = getCleanCategory(rawCatName);
    
    const matchesCategory = selectedCategory === "all" || cleanCatName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCategoryChange = (cleanValue: string) => {
    setSelectedCategory(cleanValue);
    if (cleanValue === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cleanValue }); 
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
    setSearchParams({});
  };

  return (
    <div className="w-full min-h-screen pt-24 md:pt-32 pb-24 md:pb-32 bg-[var(--color-surface)]">
      <div className="max-w-[1600px] mx-auto px-3 md:px-12">
        
        <div className="mb-10 md:mb-16 px-2 md:px-0">
          <h1 className="text-4xl md:text-6xl font-display text-gray-900 mb-3 md:mb-4">The Collection</h1>
          <p className="text-sm md:text-base text-gray-500 font-sans max-w-xl">
            Explore our complete range of signature scents. Filter by category or search for specific notes to find your perfect match.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          <div className="lg:col-span-3 lg:sticky lg:top-32 space-y-8 md:space-y-10 px-2 md:px-0">
            
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-3 md:mb-4">Search</h3>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 md:py-3 pl-8 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                />
                <Search className="absolute left-0 top-2.5 md:top-3 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-3 md:mb-4">Category</h3>
              <div className="flex flex-col space-y-3">
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === "all"}
                    onChange={() => handleCategoryChange("all")}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 capitalize group-hover:text-black transition-colors">
                    All
                  </span>
                </label>

                {isCategoriesLoading ? (
                  <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
                ) : (
                  categories.map((cat: any) => {
                    const cleanValue = getCleanCategory(cat.name);
                    return (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={selectedCategory === cleanValue}
                          onChange={() => handleCategoryChange(cleanValue)}
                          className="accent-black w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 capitalize group-hover:text-black transition-colors">
                          {cat.name}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-3 md:mb-4">Sort By</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border-b border-gray-300 py-2 md:py-3 bg-transparent text-sm text-gray-600 focus:outline-none focus:border-black transition-colors cursor-pointer rounded-none appearance-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <button 
              onClick={handleClearFilters}
              className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors pt-2 md:pt-4 border-b border-transparent hover:border-black"
            >
              Clear All Filters
            </button>

          </div>

          <div className="lg:col-span-9">
            
            {isLoading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-12">
                {[1, 2, 3, 4, 5, 6].map((n) => <ProductSkeleton key={n} />)}
              </div>
            )}

            {isError && (
              <div className="text-red-500 py-20 text-center border border-red-100 bg-red-50 text-sm tracking-widest uppercase font-bold">
                Failed to load the collection. Please check your connection.
              </div>
            )}

            {!isLoading && !isError && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-100 shadow-sm mx-2 md:mx-0">
                <p className="text-gray-500 mb-4">No fragrances match your current filters.</p>
                <button 
                  onClick={handleClearFilters}
                  className="border-b border-black text-sm font-bold uppercase tracking-widest pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {!isLoading && !isError && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-12">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};