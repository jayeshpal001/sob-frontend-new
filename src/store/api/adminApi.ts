// src/store/api/adminApi.ts
import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- DASHBOARD ---
    getDashboardStats: builder.query<any, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
    }),

    // --- PRODUCTS ---
    getProducts: builder.query<any, void>({
      query: () => "/admin/products",
      providesTags: ["Products"],
    }),
    getProductById: builder.query<any, string>({
      query: (id) => `/admin/products/${id}`,
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // --- CATEGORIES ---
    getCategories: builder.query<any, void>({ 
      query: () => "/admin/categories",
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // --- ORDERS ---
    getOrders: builder.query<any, void>({
      query: () => "/admin/orders",
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders", "Dashboard"],
    }),

    // --- USERS ---
    getUsers: builder.query<any, void>({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    toggleBlockUser: builder.mutation<any, { id: string; isBlocked: boolean }>({
      query: ({ id, isBlocked }) => ({
        url: `/admin/users/${id}/block`,
        method: "PUT",
        body: { isBlocked },
      }),
      invalidatesTags: ["Users"],
    }),
    searchUsers: builder.query<any, string>({
      query: (query) => `/admin/users/search?q=${query}`,
      providesTags: ["Users"],
    }),

    // --- REVIEWS ---
    getAllAdminReviews: builder.query<any, void>({
      query: () => "/admin/reviews",
      providesTags: ["Reviews"],
    }),
    approveReview: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/reviews/${id}/approve`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Reviews"],
    }),
    rejectReview: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/reviews/${id}/reject`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),

  // --- BANNERS ---
    getBanners: builder.query<any, void>({
      query: () => "/admin/banners",
      providesTags: ["Banners"],
    }),
    createBanner: builder.mutation<any, any>({
      query: (formData) => ({
        url: "/admin/banners",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Banners"],
    }),
    
    updateBanner: builder.mutation<any, { id: string; isActive?: boolean; redirectUrl?: string; image?: any }>({
      query: ({ id, ...patchData }) => ({
        url: `/admin/banners/${id}`,
        method: "PUT",
        body: patchData,
      }),
      invalidatesTags: ["Banners"],
    }),

    deleteBanner: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),

    // --- COUPONS ---
    getCoupons: builder.query<any, void>({
      query: () => "/admin/coupons",
      providesTags: ["Coupons"],
    }),
    createCoupon: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),
    deleteCoupon: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
    
    // --- SETTINGS ---
    getSettings: builder.query<any, void>({
      query: () => "/admin/settings", 
      providesTags: ["Settings"] as any,
    }),
    updateSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Settings"] as any,
    }),


  }),
  overrideExisting: false,
});

export const {
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
  useGetAllAdminReviewsQuery, 
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = adminApi;