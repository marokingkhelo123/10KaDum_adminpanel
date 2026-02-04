import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
};

export const slideBarSlice = createSlice({
  name: "slideBar",
  initialState,
  reducers: {
    updateSlideBar: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateSlideBar } = slideBarSlice.actions;

export default slideBarSlice.reducer;
