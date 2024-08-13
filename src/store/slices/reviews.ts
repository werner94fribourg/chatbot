import { fetchAllReviews } from '@/api_calls/calls';
import { Review } from '@/utils/frontend/utils';
import { createSlice, Dispatch } from '@reduxjs/toolkit';

interface ReviewsState {
  reviews: Review[];
}

const initialState: ReviewsState = {
  reviews: [],
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReviews(state, action) {
      const {
        payload: { reviews },
      } = action;

      reviews.forEach((review: Review) => {
        let storedIndex = state.reviews.findIndex(b => b.id === review.id);
        if (storedIndex !== -1) state.reviews[storedIndex] = review;
        else state.reviews.push(review);
      });
    },
  },
});

const reviewsActions = reviewsSlice.actions;

export const reviewsReducer = reviewsSlice.reducer;

export const storeAllReviews = async (dispatch: Dispatch) => {
  const { valid, data: reviews } = await fetchAllReviews();
  if (valid && reviews) {
    dispatch(reviewsActions.addReviews({ reviews }));
  }
};
