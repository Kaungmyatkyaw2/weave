import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  access_token: string | null;
}

const initalValue: initialState = { access_token: null };

const AuthSlice = createSlice({
  name: "Auth",
  initialState: initalValue,
  reducers: {
    login: (state, action) => {
      state.access_token = action.payload;
      localStorage.setItem("jwt_token", action.payload);
    },

    removeToken: (state) => {
      state.access_token = null;
    },
  },
});

export const { login, removeToken } = AuthSlice.actions;
export default AuthSlice.reducer;
