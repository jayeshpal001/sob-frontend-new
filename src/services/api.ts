// src/services/api.ts
import axios from "axios";
import { toast } from "sonner";
import type { Product, FilterParams } from "../types";

// ==========================================
// 1. REAL API SETUP (Axios Instance)
// ==========================================
const api = axios.create({
  // Make sure your backend runs on this URL, or use env variable
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Auto-inject Admin JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken");
      // Sirf admin routes se bahar feko
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = "/admin/login";
        toast.error("Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

// Default export is the real Axios instance
export default api;


// ==========================================
// 2. MOCK DATA SETUP (For Public UI only)
// ==========================================
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