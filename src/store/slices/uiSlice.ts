// src/store/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isSearchOpen: boolean;
}

const initialState: UIState = {
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    }
  },
});

export const { toggleSearch, closeSearch } = uiSlice.actions;
export default uiSlice.reducer;