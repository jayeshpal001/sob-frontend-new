// src/store/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    credentials: 'include', 
  }),
  
  tagTypes: [
    "User", "Product", "Cart", "Order", "Review", 
    "Dashboard", "Products", "Users", "Orders", "Categories", "Reviews", "Banners",
    "UserProfile", "UserProducts", "UserOrders" 
  ],
  
  endpoints: () => ({}),
});