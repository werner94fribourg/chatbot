import { configureStore } from '@reduxjs/toolkit';
import { businessesReducer } from './slices/businesses';
import { reviewsReducer } from './slices/reviews';

const store = configureStore({
  reducer: {
    businesses: businessesReducer,
    reviews: reviewsReducer,
  },
});

export default store;
