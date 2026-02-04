import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Slices/userSlice";
import SlideBarReducer from "./Slices/sideBarSlice";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    slideBar: SlideBarReducer,
  },
});
