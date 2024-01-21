import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isDarkMode: boolean;
}

const initalValue: initialState = { isDarkMode: false };

const ThemeSlice = createSlice({
  name: "Theme",
  initialState: initalValue,
  reducers: {
    toggleMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { toggleMode } = ThemeSlice.actions;
export default ThemeSlice.reducer;
