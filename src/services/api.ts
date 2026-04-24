// src/services/api.ts
import type{ Product, FilterParams } from "../types";

// Extended Mock Data API standard ke hisaab se
const mockDatabase: Product[] = [
  { id: "sob-01", name: "Noir Absolu", tagline: "The Essence of Mystery", price: 145, image: "/sob-perfume-bottle.png", badge: "Bestseller", scentNotes: ["Black Pepper", "Amber"], category: "unisex", inStock: true },
  { id: "sob-02", name: "Azure Depths", tagline: "Power Redefined", price: 175, image: "/sob-perfume-bottle.png", scentNotes: ["Sea Salt", "Cedar"], category: "mens", inStock: true },
  { id: "sob-03", name: "Blanc Éthéréal", tagline: "Elegance in Every Drop", price: 220, image: "/sob-perfume-bottle.png", scentNotes: ["Jasmine", "Vanilla"], category: "womens", inStock: false },
  { id: "sob-04", name: "Obsidian Edge", tagline: "Unapologetically Bold", price: 295, image: "/sob-perfume-bottle.png", badge: "Limited", scentNotes: ["Leather", "Oud"], category: "mens", inStock: true },
];

export const productService = {
  // Simulate fetching products with filters and delay
  getProducts: async (filters?: FilterParams): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...mockDatabase];

        if (filters) {
          if (filters.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(p => p.name.toLowerCase().includes(q) || p.scentNotes.some(n => n.toLowerCase().includes(q)));
          }
          if (filters.category && filters.category !== "all") {
            results = results.filter(p => p.category === filters.category);
          }
          if (filters.sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
          if (filters.sortBy === "price-desc") results.sort((a, b) => b.price - a.price);
        }
        
        resolve(results);
      }, 800); // 800ms network delay simulation
    });
  }
};