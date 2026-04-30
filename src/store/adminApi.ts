// src/store/adminApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Dashboard",
    "Products",
    "Users",
    "Orders",
    "Categories",
    "Reviews",
    "Banners",
  ],
  endpoints: (builder) => ({
    // --- AUTH ---
    adminLogin: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // --- DASHBOARD ---
    getDashboardStats: builder.query<any, void>({
      query: () => "/api/admin/dashboard",
      providesTags: ["Dashboard"],
    }),

    // --- PRODUCTS ---
    getProducts: builder.query<any, void>({
      query: () => "/api/admin/products",
      providesTags: ["Products"],
    }),
    
    getProductById: builder.query<any, string>({
      query: (id) => `/api/admin/products/${id}`,
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/admin/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/admin/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    
    // --- CATEGORIES ---
    getCategories: builder.query<any, void>({
      query: () => "/api/admin/categories",
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/admin/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/admin/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // --- ORDERS ---
    getOrders: builder.query<any, void>({
      query: () => "/api/admin/orders",
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/api/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders", "Dashboard"],
    }),

    // --- USERS ---
    getUsers: builder.query<any, void>({
      query: () => "/api/admin/users",
      providesTags: ["Users"],
    }),
    toggleBlockUser: builder.mutation<any, { id: string; isBlocked: boolean }>({
      query: ({ id, isBlocked }) => ({
        url: `/api/admin/users/${id}/block`,
        method: "PUT",
        body: { isBlocked },
      }),
      invalidatesTags: ["Users"],
    }),
    searchUsers: builder.query<any, string>({
      query: (query) => `/api/admin/users/search?q=${query}`,
      providesTags: ["Users"],
    }),

    // --- REVIEWS ---
    getReviews: builder.query<any, void>({
      query: () => "/api/admin/reviews",
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/admin/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),

    // --- BANNERS ---
    getBanners: builder.query<any, void>({
      query: () => "/api/admin/banners",
      providesTags: ["Banners"],
    }),
    createBanner: builder.mutation<any, any>({
      query: (formData) => ({
        url: "/api/admin/banners",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetDashboardStatsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery, 
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetUsersQuery,
  useToggleBlockUserMutation,
  useSearchUsersQuery,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useGetBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
} = adminApi;