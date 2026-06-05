// src/store/api/userApi.ts
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== UNIVERSAL AUTH ROUTES ====================
    loginUser: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyLogin: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/verify-login",
        method: "POST",
        body: data,
      }),
    }),
    registerUser: builder.mutation<any, any>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyRegister: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/verify-register",
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // ==================== PROFILE & ADDRESS ROUTES ====================
    getProfile: builder.query<any, void>({
      query: () => "/user/profile",
      providesTags: ["UserProfile"],
    }),
    updateProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    addAddress: builder.mutation<any, any>({
      query: (addressData) => ({
        url: "/user/profile/address",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    updateAddress: builder.mutation<any, { index: number; data: any }>({
      query: ({ index, data }) => ({
        url: `/user/profile/address/${index}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    deleteAddress: builder.mutation<any, number>({
      query: (index) => ({
        url: `/user/profile/address/${index}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserProfile"],
    }),
    setDefaultAddress: builder.mutation<any, number>({
      query: (index) => ({
        url: `/user/profile/address/default/${index}`,
        method: "PUT",
      }),
      invalidatesTags: ["UserProfile"],
    }),
    getDefaultAddress: builder.query<any, void>({
      query: () => "/user/profile/address/default/get/current",
      providesTags: ["UserProfile"],
    }),
    checkHasAddress: builder.query<any, void>({
      query: () => "/user/profile/address/check/exists",
    }),

    // ==================== PRODUCT ROUTES ====================
    getAllProducts: builder.query<any, string | void>({
      query: (queryString = "") => `/user/products/browse${queryString}`,
      providesTags: ["UserProducts"],
    }),
    
    getBundleProducts: builder.query<any, void>({
      query: () => "/user/products/bundle",
      providesTags: ["UserProducts"],
    }),
    
    getProductById: builder.query<any, string>({
      query: (id) => `/user/products/${id}`,
      providesTags: ["UserProducts"],
    }),

    // ==================== CART ROUTES ====================
    getCart: builder.query<any, void>({
      query: () => "/user/cart",
      providesTags: ["Cart"],
    }),
    addToCartApi: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartApi: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/cart",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeItemFromCartApi: builder.mutation<any, string>({
      query: (productId) => ({
        url: `/user/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ==================== ORDER & PAYMENT (RAZORPAY) ====================
    checkoutOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/orders/checkout",
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/orders/verify-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserOrders", "Cart"],
    }),
    getMyOrders: builder.query<any, void>({
      query: () => "/user/orders/my-orders",
      providesTags: ["UserOrders"],
    }),
    getOrderDetails: builder.query<any, string>({
      query: (id) => `/user/orders/${id}`,
      providesTags: ["UserOrders"],
    }),
    cancelOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/user/orders/cancel/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["UserOrders"],
    }),

    // ==================== REVIEWS ====================
    getReviews: builder.query<any, string>({
      query: (productId) => `/user/reviews/${productId}`,
      providesTags: ["Reviews"],
    }),
    addReview: builder.mutation<any, { productId: string; data: any }>({
      query: ({ productId, data }) => ({
        url: `/user/reviews/${productId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reviews", "UserProducts"],
    }),

    // ==================== CONTACT ROUTE ====================
    submitContactForm: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/contact",
        method: "POST",
        body: data,
      }),
    }),

    // ==================== COUPONS ====================
    applyCoupon: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/coupons/apply",
        method: "POST",
        body: data,
      }),
    }),

    // ==================== BANNER ROUTES ====================
    getActiveBanner: builder.query<any, void>({
      query: () => "/user/banners/active",
      providesTags: ["Banners"] as any, 
    }),

    // ==================== GLOBAL SETTINGS (Tax, Delivery & Bundle) ====================
    getSettings: builder.query<any, string | void>({
      query: () => "/settings",
      providesTags: ["Settings"] as any,
    }),

    // ==================== CATEGORIES ====================
    getUserCategories: builder.query<any, void>({
      query: () => '/admin/categories', 
    }),

  }),
  overrideExisting: false,
});

export const {
  // Auth
  useLoginUserMutation,
  useVerifyLoginMutation,
  useRegisterUserMutation,
  useVerifyRegisterMutation,
  useLogoutUserMutation,

  // Profile
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useGetDefaultAddressQuery,
  useCheckHasAddressQuery,

  // Products
  useGetAllProductsQuery,
  useGetBundleProductsQuery,
  useGetProductByIdQuery,

  // Cart
  useGetCartQuery,
  useAddToCartApiMutation,
  useUpdateCartApiMutation,
  useRemoveItemFromCartApiMutation,

  // Orders & Payment
  useCheckoutOrderMutation,
  useVerifyPaymentMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useCancelOrderMutation,

  // Reviews
  useGetReviewsQuery,
  useAddReviewMutation,
  useSubmitContactFormMutation,

  // Coupons
  useApplyCouponMutation,

  // Banners
  useGetActiveBannerQuery,
  
  // Settings
  useGetSettingsQuery,
  
  // Categories
  useGetUserCategoriesQuery,
} = userApi;