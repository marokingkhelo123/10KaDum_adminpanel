import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: {},
  refreshToken: "",
  accessToken: "",
  isLoggedIn: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateBalance: (state, action) => {
      state.user.balance = action.payload.balance;
      state.user.winning_amount = action.payload.winning_amount;
    },
  },
});

export const { updateUser, updateBalance } = userSlice.actions;

export default userSlice.reducer;
