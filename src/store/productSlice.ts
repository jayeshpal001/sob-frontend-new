// src/store/productSlice.ts
import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import type{ Product, FilterParams } from '../types';
import { productService } from '../services/api';

// Async action (Thunk)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: FilterParams | undefined) => {
    const data = await productService.getProducts(filters);
    return data;
  }
);

interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: FilterParams;
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
  filters: { category: 'all', sortBy: 'newest', search: '' },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Partial<FilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { updateFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;