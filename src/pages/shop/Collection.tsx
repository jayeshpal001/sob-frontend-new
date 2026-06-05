// src/pages/Collection.tsx
import { useState } from "react";
import { Search } from "lucide-react";
import { useGetAllProductsQuery, useGetUserCategoriesQuery } from "../../store/api/userApi"; 
import { ProductCard } from "../../components/ui/ProductCard";
import { ProductSkeleton } from "../../components/ui/ProductSkeleton";

export const Collection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch Live Products and Categories from API
  const { data: responseData, isLoading, isError } = useGetAllProductsQuery("");
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetUserCategoriesQuery();

  // Extract data safely
  const rawProducts = responseData?.data || [];
  const categories = categoriesResponse?.data || [];

  const filteredProducts = rawProducts.filter((p: any) => {
    // 1. Search Filter
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category Filter (Handles both populated object {name: '...'} and flat string ID/name)
    const catName = (p.category?.name || p.category || "unisex").toLowerCase();
    const matchesCategory = selectedCategory === "all" || catName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => {
    // 3. Sorting
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    // Newest default 
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  return (
    <div className="w-full min-h-screen pt-32 pb-32 bg-[var(--color-surface)]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-display text-gray-900 mb-4">The Collection</h1>
          <p className="text-gray-500 font-sans max-w-xl">
            Explore our complete range of signature scents. Filter by category or search for specific notes to find your perfect match.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Sidebar: Filters (Sticky) */}
          <div className="lg:col-span-3 lg:sticky lg:top-32 space-y-10">
            
            {/* Search */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-4">Search</h3>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search by name or note..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-b border-gray-300 py-3 pl-8 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                />
                <Search className="absolute left-0 top-3 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
              </div>
            </div>

            {/* Dynamic Categories */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-4">Category</h3>
              <div className="flex flex-col space-y-3">
                
                {/* Default All Option */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === "all"}
                    onChange={() => setSelectedCategory("all")}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 capitalize group-hover:text-black transition-colors">
                    All
                  </span>
                </label>

                {/* API Fetched Categories */}
                {isCategoriesLoading ? (
                  <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
                ) : (
                  categories.map((cat: any) => {
                    const catValue = cat.name.toLowerCase();
                    return (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={selectedCategory === catValue}
                          onChange={() => setSelectedCategory(catValue)}
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

            {/* Sort */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-4">Sort By</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border-b border-gray-300 py-3 bg-transparent text-sm text-gray-600 focus:outline-none focus:border-black transition-colors cursor-pointer rounded-none appearance-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <button 
              onClick={handleClearFilters}
              className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors pt-4 border-b border-transparent hover:border-black"
            >
              Clear All Filters
            </button>

          </div>

          {/* Right Area: Product Grid */}
          <div className="lg:col-span-9">
            
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {[1, 2, 3, 4, 5, 6].map((n) => <ProductSkeleton key={n} />)}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-red-500 py-20 text-center border border-red-100 bg-red-50 text-sm tracking-widest uppercase font-bold">
                Failed to load the collection. Please check your connection.
              </div>
            )}

            {/* Success State - Empty Results */}
            {!isLoading && !isError && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-100 shadow-sm">
                <p className="text-gray-500 mb-4">No fragrances match your current filters.</p>
                <button 
                  onClick={handleClearFilters}
                  className="border-b border-black text-sm font-bold uppercase tracking-widest pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Success State - Render Grid */}
            {!isLoading && !isError && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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