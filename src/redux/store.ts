import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer
  },
});

// Create three state and dispatch for usability | mudah digunakan
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;