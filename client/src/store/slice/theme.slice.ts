import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isDarkMode: boolean;
  offsetY?: number;
}

const initalValue: initialState = { isDarkMode: false };

const ThemeSlice = createSlice({
  name: "Theme",
  initialState: initalValue,
  reducers: {
    toggleMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setOffsetY: (state, action) => {
      state.offsetY = action.payload;
    },
  },
});

export const { toggleMode, setOffsetY } = ThemeSlice.actions;
export default ThemeSlice.reducer;
