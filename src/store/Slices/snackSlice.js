import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  message: ""
};

export const snackSlice = createSlice({
  name: "snack",
  initialState,
  reducers: {
    updateSnack: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateSnack } = snackSlice.actions;

export default snackSlice.reducer;
