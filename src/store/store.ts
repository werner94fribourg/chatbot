import { configureStore } from '@reduxjs/toolkit';
import { businessesReducer } from './slices/businesses';
import { reviewsReducer } from './slices/reviews';
import { chatReducer } from './slices/chat';

const store = configureStore({
  reducer: {
    businesses: businessesReducer,
    reviews: reviewsReducer,
    chat: chatReducer,
  },
});

export default store;
