// src/components/sections/ProductGrid.tsx
import { products } from "../../data/products";
import { ProductCard } from "../ui/ProductCard";

export const ProductGrid = () => {
  return (
    <section className="w-full bg-[var(--color-surface)] py-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4">
            The Collection
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-gray-900 mb-6">
            Our Signature Scents
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto text-sm leading-relaxed">
            Each fragrance is a masterpiece — meticulously composed from the world's finest ingredients.
          </p>
        </div>

        {/* CSS Grid for Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};