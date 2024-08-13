'use client';

import { NextPage } from 'next';
import Table from './components/Table/Table';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { storeAllBusinesses, StoredBusiness } from '@/store/slices/businesses';
import { useSelector } from 'react-redux';
import { BUSINESS_COLUMNS, REVIEWS_COLUMNS } from '@/utils/frontend/globals';
import { Typography } from '@mui/material';
import { storeAllReviews } from '@/store/slices/reviews';
import { Review } from '@/utils/frontend/utils';
import Chat from './components/Chat/Chat';

const App: NextPage = () => {
  const businesses = useSelector(
    (state: { businesses: { businesses: StoredBusiness[] } }) =>
      state.businesses.businesses
  );
  const reviews = useSelector(
    (state: { reviews: { reviews: Review[] } }) => state.reviews.reviews
  );
  const dispatch = useDispatch();

  useEffect(() => {
    storeAllBusinesses(dispatch);
    storeAllReviews(dispatch);
  }, [dispatch]);
  return (
    <>
      <Typography component="h1" variant="h3">
        Business Recommendation Application
      </Typography>
      <Typography component="h2" variant="h4">
        List of the existing businesses
      </Typography>
      <Table rows={businesses} columns={BUSINESS_COLUMNS} />
      <Typography component="h2" variant="h4">
        List of the existing reviews
      </Typography>
      <Table rows={reviews} columns={REVIEWS_COLUMNS} />
      <Chat />
    </>
  );
};

export default App;
