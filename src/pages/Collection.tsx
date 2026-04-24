// src/pages/Collection.tsx
import { useEffect } from "react";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts, updateFilters, clearFilters } from "../store/productSlice";
import { ProductCard } from "../components/ui/ProductCard";
import { ProductSkeleton } from "../components/ui/ProductSkeleton";

export const Collection = () => {
  const dispatch = useAppDispatch();
  const { items, status, filters } = useAppSelector((state) => state.products);

  // Trigger API call whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateFilters({ search: e.target.value }));
  };

  const handleCategory = (category: string) => {
    dispatch(updateFilters({ category }));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateFilters({ sortBy: e.target.value as any }));
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
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by name or note..." 
                  value={filters.search}
                  onChange={handleSearch}
                  className="w-full border-b border-gray-300 py-3 pl-8 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                />
                <Search className="absolute left-0 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-4">Category</h3>
              <div className="flex flex-col space-y-3">
                {['all', 'unisex', 'mens', 'womens'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={filters.category === cat}
                      onChange={() => handleCategory(cat)}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 capitalize group-hover:text-black transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-4">Sort By</h3>
              <select 
                value={filters.sortBy} 
                onChange={handleSort}
                className="w-full border-b border-gray-300 py-3 bg-transparent text-sm text-gray-600 focus:outline-none focus:border-black transition-colors cursor-pointer rounded-none appearance-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <button 
              onClick={() => dispatch(clearFilters())}
              className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors pt-4"
            >
              Clear All Filters
            </button>

          </div>

          {/* Right Area: Product Grid */}
          <div className="lg:col-span-9">
            
            {/* Loading State */}
            {status === 'loading' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {[1, 2, 3, 4, 5, 6].map((n) => <ProductSkeleton key={n} />)}
              </div>
            )}

            {/* Success State - Empty Results */}
            {status === 'succeeded' && items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-500 mb-4">No fragrances match your current filters.</p>
                <button 
                  onClick={() => dispatch(clearFilters())}
                  className="border-b border-black text-sm font-bold uppercase tracking-widest pb-1"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Success State - Render Grid */}
            {status === 'succeeded' && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Error State */}
            {status === 'failed' && (
              <div className="text-red-500 py-20">
                Failed to load the collection. Please check your connection.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};