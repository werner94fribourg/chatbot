import { fetchAllReviews, fetchNewReviews } from '@/api_calls/calls';
import { Review } from '@/utils/frontend/utils';
import { createSlice, Dispatch } from '@reduxjs/toolkit';

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
}

const initialState: ReviewsState = {
  reviews: [],
  isLoading: false,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReviews(state, action) {
      const {
        payload: { reviews },
      } = action;

      reviews?.forEach((review: Review) => {
        let storedIndex = state.reviews.findIndex(b => b.id === review.id);
        if (storedIndex !== -1) state.reviews[storedIndex] = review;
        else state.reviews.push(review);
      });
    },
    setLoadingState(state, action) {
      const {
        payload: { isLoading },
      } = action;

      state.isLoading = isLoading;
    },
  },
});

const reviewsActions = reviewsSlice.actions;

export const reviewsReducer = reviewsSlice.reducer;

export const storeAllReviews = async (dispatch: Dispatch) => {
  dispatch(reviewsActions.addReviews({ isLoading: true }));
  const { valid, data: reviews } = await fetchAllReviews();
  if (valid && reviews) dispatch(reviewsActions.addReviews({ reviews }));

  dispatch(reviewsActions.addReviews({ isLoading: false }));
};

export const storeNewReviews = async (dispatch: Dispatch) => {
  dispatch(reviewsActions.addReviews({ isLoading: true }));
  const { valid, data: reviews } = await fetchNewReviews();
  if (valid && reviews) dispatch(reviewsActions.addReviews({ reviews }));

  dispatch(reviewsActions.addReviews({ isLoading: false }));
};
