// src/store/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';
import { logout } from '../slices/authSlice';

// 1. Define the standard base query
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include', 
});

// 2. Create the interceptor wrapper
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  
  // Execute the requested API call
  let result = await baseQuery(args, api, extraOptions);

  // Intercept 401 Unauthorized errors
  if (result.error && result.error.status === 401) {
    
    // Get current auth state to avoid showing "Session Expired" to guests on first load
    const state = api.getState() as any;
    const isAuthenticated = state.auth?.isAuthenticated;

    if (isAuthenticated) {
      // Clear Redux state
      api.dispatch(logout());
      
      // Show premium error toast
      toast.error("SESSION EXPIRED", {
        description: "Your secure session has ended. Please log in again.",
        style: { 
          background: '#FFF0F0', 
          color: '#D92D20', 
          border: '1px solid #FDA29B', 
          borderRadius: '0px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          fontSize: '10px', 
          fontWeight: 'bold' 
        }
      });

      // Redirect based on panel (Admin vs User)
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    } else {
      // If a background check fails for a guest, ensure state is wiped silently
      api.dispatch(logout());
    }
  }

  return result;
};

// 3. Export the base API using the new wrapped query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth, // Applied the interceptor here
  
  tagTypes: [
    "User", "Product", "Cart", "Order", "Review", 
    "Dashboard", "Products", "Users", "Orders", "Categories", "Reviews", "Banners",
    "UserProfile", "UserProducts", "UserOrders", "Coupons" 
  ],
  
  endpoints: () => ({}),
});