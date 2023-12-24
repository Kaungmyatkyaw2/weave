import { User } from "@/types/user.type";
import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  currentUser: User | null;
}

const initalValue: initialState = { currentUser: null };

const UserSlice = createSlice({
  name: "User",
  initialState: initalValue,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    removeCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { removeCurrentUser, setCurrentUser } = UserSlice.actions;
export default UserSlice.reducer;
