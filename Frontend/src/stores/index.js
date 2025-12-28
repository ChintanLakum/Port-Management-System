// src/stores/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authentication" // Correct import path and variable name

const store = configureStore({
  reducer: {
    auth: authReducer // Correctly assigning the reducer from the slice
  },
});

export default store;