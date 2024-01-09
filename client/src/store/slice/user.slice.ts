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
    updateFollow: (state, action: { payload: "add" | "remove" }) => {
      if (state.currentUser) {
        if (action.payload == "add") {
          state.currentUser.following += 1;
        } else {
          state.currentUser.following -= 1;
        }
      }
    },
  },
});

export const { removeCurrentUser, setCurrentUser, updateFollow } =
  UserSlice.actions;
export default UserSlice.reducer;
