// src/services/admin.ts
import api from "./api"; // Import the core axios instance

export const adminService = {
  // ==========================
  // AUTHENTICATION
  // ==========================
  login: (data: any) => api.post("/api/auth/login", data),
  register: (data: any) => api.post("/api/auth/register", data), // if needed for admin creation

  // ==========================
  // DASHBOARD
  // ==========================
  getDashboardData: () => api.get("/api/admin/dashboard"),

  // ==========================
  // USERS
  // ==========================
  getAllUsers: () => api.get("/api/admin/users"),
  toggleBlockUser: (id: string, isBlocked: boolean) => api.put(`/api/admin/users/${id}/block`, { isBlocked }),
  searchUsers: (query: string) => api.get(`/api/admin/users/search?q=${query}`),
  filterUsers: (filters: any) => api.get("/api/admin/users/filter", { params: filters }),

  // ==========================
  // PRODUCTS
  // ==========================
  getProducts: () => api.get("/api/admin/products"),
  createProduct: (data: any) => api.post("/api/admin/products", data), // NOTE: Use FormData if uploading images
  updateProduct: (id: string, data: any) => api.put(`/api/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/api/admin/products/${id}`),

  // ==========================
  // CATEGORIES
  // ==========================
  getCategories: () => api.get("/api/admin/categories"),
  createCategory: (data: any) => api.post("/api/admin/categories", data),
  updateCategory: (id: string, data: any) => api.put(`/api/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/api/admin/categories/${id}`),

  // ==========================
  // ORDERS
  // ==========================
  getOrders: () => api.get("/api/admin/orders"),
  updateOrderStatus: (id: string, status: string) => api.patch(`/api/admin/orders/${id}/status`, { status }),

  // ==========================
  // REVIEWS
  // ==========================
  getReviews: () => api.get("/api/admin/reviews"),
  approveReview: (id: string) => api.put(`/api/admin/reviews/${id}/approve`),
  rejectReview: (id: string) => api.put(`/api/admin/reviews/${id}/reject`),
  deleteReview: (id: string) => api.delete(`/api/admin/reviews/${id}`),

  // ==========================
  // BANNERS
  // ==========================
  getBanners: () => api.get("/api/admin/banners"),
  createBanner: (data: any) => api.post("/api/admin/banners", data),
  updateBanner: (id: string, data: any) => api.put(`/api/admin/banners/${id}`, data),
  deleteBanner: (id: string) => api.delete(`/api/admin/banners/${id}`),
};