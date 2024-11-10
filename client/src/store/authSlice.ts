import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
    user: boolean;
};

const initialState:AuthState = {
    user: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;