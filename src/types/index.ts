// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  badge?: string;
  scentNotes: string[];
  category: "mens" | "womens" | "unisex";
  inStock: boolean;
}

export interface FilterParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price-asc" | "price-desc" | "newest";
}